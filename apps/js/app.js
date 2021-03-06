var testing = '';	
var center = [-103, 51];
var weather_map_layer = '';
var mapLayers = ['Empty','precipitation','snow','rain','clouds','temp','wind','pressure'];
var comments = ['You look very nice today!', 'Daaaaaang!!','Looking Good!','Ooooph, Maybe you should stay in bed today']
var index = 0;	
var commentIndex = 0;
var url = "http://www.cbc.ca/cmlink/rss-world";
var stories = [];
var newsIndex = 0;
	
function updateNews(){
	stories=[]
	feednami.load(url,function(result){
	  if(result.error){
	    console.log(result.error)
	  }
	  else{
	    var entries = result.feed.entries
	    for(var i = 0; i < entries.length; i++){
	      var entry = entries[i]
	      console.log(entry)
	      stories.push(entry.title + " : " + entry.author)
	    }
	  }
	})
}

function updateWeather(){
	var weather = $.ajax({
		  url: 'http://api.openweathermap.org/data/2.5/weather/?q=calgary,ca&units=metric&APPID=21533dee088f3bf9341ea0fcee12a95f',
		  success: function(d){
			  testing = d
			  $('#city').text(d.name)
			  $('#humidity').text("Humidity: " + d.main.humidity + "%")
			  $('#pressure').text("Pressure: " + d.main.pressure + " hpa")
			  $('#sunrise').text("Sunrise: " + timeConverter(d.sys.sunrise, ''))
			  $('#sunset').text("Sunset: " + timeConverter(d.sys.sunset, ''))
			  $('#temperature').text(parseFloat(d.main.temp).toFixed(1) + " \xB0C")  
			  $('#weather-description').text(toTitleCase(d.weather[0].description))
			  $('#weather-symbol').addClass('icon ' +weather_symbols.iconTable[(d.weather[0].icon)] + ' text') 
			  center = [d.coord.lon, d.coord.lat]
		  }
		});
	setTimeout(updateWeather, 3600000);
}

function timeConverter(UNIX_timestamp, return_format){
	  var a = new Date(UNIX_timestamp * 1000);
	  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = (a.getHours() <= 12 ? a.getHours() : a.getHours()-12);
	  var tod = (a.getHours() < 12 ? "am" : "pm");
	  var min = pad(a.getMinutes(),2);
	  var sec = pad(a.getSeconds(),2);
	  var date_time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec + ' ' + tod ;
	  var time = hour + ':' + min + ':' + sec + ' ' + tod;
	  result = (return_format == 'full' ? date_time : time);
	  return result
	}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function pad(n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

var weather_symbols = {
	iconTable: {
		'01d':'wi-day-sunny',
		'02d':'wi-day-cloudy',
		'03d':'wi-cloudy',
		'04d':'wi-cloudy-windy',
		'09d':'wi-showers',
		'10d':'wi-rain',
		'11d':'wi-thunderstorm',
		'13d':'wi-snow',
		'50d':'wi-fog',
		'01n':'wi-night-clear',
		'02n':'wi-night-cloudy',
		'03n':'wi-night-cloudy',
		'04n':'wi-night-cloudy',
		'09n':'wi-night-showers',
		'10n':'wi-night-rain',
		'11n':'wi-night-thunderstorm',
		'13n':'wi-night-snow',
		'50n':'wi-night-alt-cloudy-windy'
	},
}

function updateClock() {
    var now = new Date(); // current date
	var hour = now.getHours()// USE FOR 12 HOUR(now.getHours() <= 12 ? now.getHours() : now.getHours()-12);
	// USE FOR 12 HOUR var tod = (now.getHours() < 12 ? "am" : "pm");
	
    time = hour + ':' + pad(now.getMinutes(),2) + ':' + pad(now.getSeconds(),2), //// USE FOR 12 HOUR + " " + tod, 
    
    months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    date = [months[now.getMonth()],
            now.getDate(), 
            now.getFullYear()].join(' ');


    $('#time').text([date, time].join('  '));

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}

function updateMapLayer(layer) {  
	weather_map_layer.setSource(
		new ol.source.XYZ({
			url: 'http://a.tile.openweathermap.org/map/' + layer + '/{z}/{x}/{y}.png'
		})
	);
}

function changeNewsLayers(){
	$('#title').text(stories[newsIndex]);
	newsIndex = (newsIndex + 1) % stories.length;
	setTimeout(changeNewsLayers, 5000);
}

function changeMapLayers(){
	$('#mapLayer').text("Map Layer: "+toTitleCase(mapLayers[index]));
	updateMapLayer(mapLayers[index]);
	index = (index + 1) % mapLayers.length;
	setTimeout(changeMapLayers, 15000);
}

function changeComment(){
	$('#comment').text(comments[commentIndex]);
	commentIndex = (commentIndex + 1) % comments.length;
	setTimeout(changeComment, 5000);
}

var map = new ol.Map({
    target: 'map',
    layers: [
		new ol.layer.Tile({
			source: new ol.source.Stamen({layer: 'toner-background'}),
		}),
		weather_map_layer = new ol.layer.Tile({
			source: new ol.source.XYZ({
				url: 'http://a.tile.openweathermap.org/map/temp/{z}/{x}/{y}.png'
			})
		}), 
	    new ol.layer.Tile({
	        source: new ol.source.Stamen({layer: 'toner-lines'}),
	    }),
	    new ol.layer.Tile({
	        source: new ol.source.Stamen({layer: 'toner-labels'}),
	    }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat(center),
      zoom: 4
    }),
    controls: ol.control.defaults({
        zoom: false,
        attribution: false,
    }),
  });

window.onload = function(){
	updateNews()
	updateClock();
	changeMapLayers();
	changeComment();
    setTimeout(changeNewsLayers, 1000);
	updateWeather();
};