	
var weather = $.ajax({
  url: 'http://api.openweathermap.org/data/2.5/weather/?q=calgary,ca&units=metric&APPID=21533dee088f3bf9341ea0fcee12a95f',
  success: function(d){
	  $('#city').text(d.name)
	  $('#sunrise').text("Sunrise: " + timeConverter(d.sys.sunrise, ''))
	  $('#sunset').text("Sunrise: " + timeConverter(d.sys.sunset, ''))
	  $('#temperature').text(parseFloat(d.main.temp).toFixed(1) + " \xB0C")  
	  $('#weather-description').text("Weather: " + d.weather[0].description)
	  $('#weather-symbol').addClass('icon ' +weather_symbols.iconTable[(d.weather[0].icon)] + ' text') 
	  console.log("fired")
	  setTimeout(weather, 3.6e+6);
  }
});

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
	var hour = (now.getHours() <= 12 ? now.getHours() : now.getHours()-12);
	var tod = (now.getHours() < 12 ? "am" : "pm");
	
    time = hour + ':' + now.getMinutes() + ':' + pad(now.getSeconds(),2) + " " + tod, 
    
    months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    date = [months[now.getMonth()],
            now.getDate(), 
            now.getFullYear()].join(' ');


    $('#time').text([date, time].join('  '));

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}
updateClock(); // initial call