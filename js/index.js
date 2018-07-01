var weather;//Global
//html elements
var weatherCard = $('.weather');
var loader = $('.loader');
var tempValue = $('.temp .value');
var mainValue = $('.main .value');
var windValue = $('.wind .value');
var pressureValue = $('.pressure .value');
var humidityValue = $('.humidity .value');
var locationValue = $('.location .value');
var mainIcon = $('.main .icon');
var windIcon = $('.wind .icon');
var cButton = $('#celsius');
var fButton = $('#fahrenheit');
var weatherCode = {
  200:0,
  210:0,
  211:0,
  221:0,
  230:0,
  231:0,
  232:0,
  //---
  201:1,
  202:1,
  212:1,
  //---
  500:2,
  501:2,
  502:2,
  503:2,
  504:2,
  511:2,
  //---
  520:3,
  521:3,
  522:3,
  531:3,
  300:3,
  301:3,
  302:3,
  310:3,
  311:3,
  312:3,
  313:3,
  314:3,
  321:3,
  //---
  600:4,
  601:4,
  602:4,
  //---
  611:5,
  612:5,
  615:5,
  616:5,
  620:5,
  621:5,
  622:5,
  //---
  701:6,
  721:6,
  741:6,
  //---
  711:7,
  //---
  731:8,
  751:8,
  761:8,
  762:8,
  //---
  771:9,
  905:9,
  956:9,
  957:9,
  958:9,
  959:9,
  //---
  781:10,
  900:10,
  //---
  951:11,
  800:11,
  //---
  801:12,
  802:12,
  803:12,
  804:12,
  //---
  901:13,
  902:13,
  960:13,
  961:13,
  962:13,
  //---
  903:14,
  //---
  904:15,
  //---
  906:16,
  //---
  952:17,
  953:17,
  954:17,
  955:17,
};

var iconClass = {
  0:["wi-day-storm-showers","wi-night-alt-storm-showers"],
  1:["wi-day-thunderstorm","wi-night-alt-thunderstorm"],
  2:["wi-day-rain","wi-night-alt-rain"],
  3:["wi-day-showers","wi-night-alt-showers"],
  4:["wi-day-snow","wi-night-alt-snow"],
  5:["wi-day-sleet","wi-night-alt-sleet"],
  6:["wi-day-fog","wi-night-fog"],
  7:"wi-smoke",
  8:"wi-sandstorm",
  9:"wi-strong-wind",
  10:"wi-tornado",
  11:["wi-day-sunny","wi-night-clear"],
  12:["wi-day-cloudy","wi-night-alt-cloudy"],
  13:"wi-hurricane",
  14:"wi-snowflake-cold",
  15:"wi-hot",
  16:["wi-day-hail","wi-night-alt-hail"],
  17:"wi-windy",
};

function setIcon(code,sunrise,sunset,recordedAt){
  var time = dayOrNight(sunrise,sunset,recordedAt); 
  if(typeof(iconClass[weatherCode[code]])!== 'string'){
    return iconClass[weatherCode[code]][time];
  }
  return iconClass[weatherCode[code]];
};

function dayOrNight(sunrise,sunset,recordedAt){
  if((sunrise <= recordedAt) && (recordedAt < sunset)){
    return 0;
  }
  return 1;
};

function unitChange(tempHtml,activeHtml,inactiveHtml,value){
  tempHtml.html(value);
  activeHtml.removeClass('inactive');
  inactiveHtml.addClass('inactive');
};


function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
};

function getData(){
  
    if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(
  function(position){
    //On success
 getWeather([position.coords.latitude,position.coords.longitude]);
},function(err){
  //On error
    console.log('ERROR(' + err.code + '): ' + err.message);
    loader.removeClass('loader');
    loader.html("ERROR(" + err.code + "): " + err.message+"<br> NOTE: If you have previously denied permission to access location you'll have to grant permission through browser's location settings");
},{//Options
  enableHighAccuracy: true});}

    else{
      loader.removeClass('loader');
      loader.html("Doesn't support geolocation API");
    }
  
                     
  
};

function getWeather(coord){
 var url = "http://api.openweathermap.org/data/2.5/weather?lat="+coord[0]+"&lon="+coord[1]+"&appid=2d437be646775f8e8d7c8b2ac1ec92e3";
  
  $.getJSON(url,function(json){
  weather = filterJSON(json);
  $(document).ready(function(){
      jsonToHtml();
      loader.remove();
      weatherCard.css('display','table');
      loader.remove();
      weatherCard.animate({'opacity':1});
      
     
  cButton.click(function(){
    unitChange(tempValue,cButton,fButton,weather.main.tempCelsius[0]);
    
  });
  
  fButton.click(function(){
    unitChange(tempValue,fButton,cButton,weather.main.tempFahrenheit[0]);
    
  });
  
  
  });
}).fail(
    function( jqxhr, textStatus, error ) {
    var err = textStatus.toString() + ", " + error.toString();




    console.log( "Request Failed: " + err );
    loader.removeClass('loader');














































    loader.html( "Request Failed: " + err + "\n Note: Google Chrome only allows https connection to access geolocation API. Try using another browser.");
});;  
  
};

function truncate(val){
  var split = (''+val).split('.');
  
  if(split.length > 1){
    split[1] = split[1].substring(0,2); 
    return +split.join('.');
  }
  return val;
};

function jsonToHtml(){
  mainValue.html(weather.weather[0].description);
    tempValue.html(weather.main.tempCelsius[0]);      windValue.html(weather.wind.direction + ' ' + weather.wind.speed + 'm/s');
  pressureValue.html(weather.main.pressure + ' hPa');
    humidityValue.html(weather.main.humidity + '%');
    locationValue.html(weather.name + ', '+weather.sys.country);
    
    mainIcon.addClass(weather.weather[0].icon);
    windIcon.addClass(weather.wind.icon);
};

function KelvinToCelsius(arr){
  return arr.map(function(val){
    val = val - 273.15;
    return truncate(val);
  });
};

function KelvinToFahrenheit(arr){
  return arr.map(function(val){
    val = (1.8*(val - 273.15)) + 32;
    return truncate(val);
  });
};

function filterJSON(json){
    json.main.tempCelsius = KelvinToCelsius([json.main.temp,json.main.temp_min,json.main.temp_max]);
  json.main.tempFahrenheit = KelvinToFahrenheit([json.main.temp,json.main.temp_min,json.main.temp_max]);

  json.wind.direction = degToCompass(json.wind.deg);
  delete json.wind.deg;
  
  json.wind.icon = "wi-towards-" + json.wind.direction.toLowerCase();

  json.weather[0].icon = setIcon(json.weather[0].id,json.sys.sunrise,json.sys.sunset,json.dt);
  
  return json;
  
};

getData();