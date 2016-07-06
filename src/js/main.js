function View (data, tagName){
	this.el = document.createElement(tagName || 'div');
	this.data = data;
}

View.prototype.render = function(){
	var _this = this;
	document.body.appendChild(this.el);
}
View.prototype.bindEvents = function (){};
View.prototype.hide = function(){
	var _this = this;
	document.body.removeChild(this.el);
}

function pageView(data, id){
	View.call(this, data);
	this.el.id = id;
}
// Google libraries
// 

function initialize() {
        var address = (document.getElementById('my-address'));
        var autocomplete = new google.maps.places.Autocomplete(address);
        autocomplete.setTypes(['geocode']);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
        }
      });
}

function codeAddress() {
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById("my-address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
	if (status == google.maps.GeocoderStatus.OK) {
		search(results[0].geometry.location.lat(), results[0].geometry.location.lng());
	} 

	else {
		alert("Geocode was not successful for the following reason: " + status);
	}
    });
  }
google.maps.event.addDomListener(window, 'load', initialize);


pageView.prototype = Object.create(View.prototype);

pageView.prototype.bindEvents = function () {
	var _this = this;
	_this.el.innerHTML = _this.data;
	var b = document.createElement('button');
	b.textContent = 'Back'
	b.classList.add = 'Back';
	b.addEventListener('click', function(){
		_this.hide()
		searchV.render();
	})
	_this.el.children[1].appendChild(b);
}

var aboutHTML = `
		<header>
			<h1>Jaidev & Adrian's Globe Explorer</h1>
		</header>
		<div class="aboutpage">
			<div>
				<h2>About</h2>
				<p>This is a simple web application that utilizes the Google and NASA APIs. Given a location, the application will display a list of dates at which NASA's Landsat has imaged the location. The user may then view any of the individual images.</p>
			</div>
			<div class="form">

			</div>	
		</div>
		`;

var contactHTML = `
		<header>
			<h1>Jaidev & Adrian's Globe Explorer</h1>
		</header>
		<div class="contactpage">
			<div>
				<h2>Contact Us</h2>
				<p>Let us know if you have any questions.</p>
			</div>
			<div class="form">

			</div>	
		</div>
		`;


function searchView(data){
	View.call(this, data);
	this.el.innerHTML = this.data;
	this.el.id = 'search';
}

searchView.prototype = Object.create(View.prototype);

search = function(latitude, longitude){

	var lat = latitude;
	var lon = longitude;
	var today = new Date();
	var d = today.getDate();
	var m = today.getMonth()+1;
	var y = today.getFullYear()-1;
	var x = '' + y + '-' + m + '-' + d;

	var params = [lon, lat, x];

	var img = document.createElement('img');

	var req = new XMLHttpRequest();
	// var req2 = new XMLHttpRequest();

	req.onreadystatechange = function () {
		if(req.readyState === 4){
			var assets = JSON.parse(req.responseText).results;
			var listV = new listView(assets, params);
			searchV.hide();
			listV.bindEvents();	
			listV.render();
		}
	}
	req.open('GET', 'https://api.nasa.gov/planetary/earth/assets?lon='+lon+'&lat='+lat+'&begin='+x+'&api_key=oimeUzHTeCeTKXALwmS3oe5kBevFbqaeVrcqBgK6');
	req.send(null);
}

searchView.prototype.bindEvents = function () {
	var _this = this;

	_this.el.querySelector(".about").addEventListener('click', function(){
		var aboutV = new pageView(aboutHTML, 'about');
		aboutV.bindEvents();
		_this.hide();
		aboutV.render();
	})

	_this.el.querySelector(".contact").addEventListener('click', function(){
		var contactV = new pageView(contactHTML, 'contact');
		contactV.bindEvents();
		_this.hide();
		contactV.render();
	})

}

function listView(data, params){
	View.call(this, data);
	this.params = params;
	this.el.id = 'list';
}

listView.prototype = Object.create(View.prototype);

listView.prototype.bindEvents = function(){
	var _this = this;
	var title = document.createElement('h1');
	title.textContent = 'Dates';
	_this.el.appendChild(title);

	for(var i = 0; i < _this.data.length; i++){
		var elem = document.createElement('div');
	 	elem.textContent = _this.data[i].date.split('T')[0];
	 	elem.addEventListener('click', function(){
	 		var passParams = _this.params;
	 		passParams[2] = this.textContent;
	 		var imgV = new imgView(passParams, _this);
	 		_this.hide();
	 		imgV.bindEvents();
	 		imgV.render();
	 	})
	 	_this.el.appendChild(elem);
	}

	var b = document.createElement('button');
	b.textContent = 'Back'
	b.classList.add('back');
	b.addEventListener('click', function(){
		_this.hide()
		searchV.render();
	})
	_this.el.appendChild(b);
}

function imgView(data, lv){
	View.call(this, data)
	this.el.id = 'image';
	this.list = lv;
}

imgView.prototype = Object.create(View.prototype);

imgView.prototype.bindEvents = function (){

	var _this = this;

	var req = new XMLHttpRequest();
	var imgcont = document.createElement('div');
	var img = document.createElement('img');
	var date = _this.data[2]
	var title = document.createElement('h1');

	var lat = _this.data[1]
	var lon = _this.data[0]

	title.textContent = date;
	_this.el.appendChild(title);

	img.id = 'displayImg';
	imgcont.id = 'imagecontainer';
	_this.el.appendChild(imgcont);
	imgcont.textContent = 'Loading';
	img.classList.add('locImg');

	req.onreadystatechange = function(){
		if(req.readyState === 4) {
			imgcont.textContent = null;
			img.src = JSON.parse(req.responseText).url;
			imgcont.appendChild(img);
			var latdiv = document.createElement('div')
			var londiv = document.createElement('div')
			var datediv = document.createElement('div')
			latdiv.textContent = 'LAT: ' + lat;
			londiv.textContent = 'LON: ' + lon;
			datediv.textContent = 'Date: ' + date;
			imgcont.appendChild(latdiv);
			imgcont.appendChild(londiv);
			imgcont.appendChild(datediv);
			var b = document.createElement('button');
			b.textContent = 'Back'
			b.classList.add('back');
			b.addEventListener('click', function(){
				_this.hide()
				_this.list.render();
			})
			imgcont.appendChild(b);
		}
	}

	req.open('GET', 'https://api.nasa.gov/planetary/earth/imagery?lon='+lon+'&lat='+lat+'&date='+date+'&cloud_score=True&api_key=oimeUzHTeCeTKXALwmS3oe5kBevFbqaeVrcqBgK6')
	req.send(null);
}

var searchCode = `
		<div class="top">
			<nav>	
				<ul>
					<li><a href="index.html">HOME</a></li>
					<li><a href="#" class="about">ABOUT</a></li>
					<li class = "logo"><a href="index.html"><img src="src/images/globe.png" class="globe"></a></li>
					<li><a href="#" class="contact">CONTACT</a></li>
					<li><a href="https://api.nasa.gov/">NASA API</a></li>
				</ul>
			</nav>
			<header>
				<div>
					<h1>Jaidev & Adrian's Globe Explorer</h1>
				</div>
			</header>
		</div>
		<div>
			<div>
				<input type="text" id="my-address">
        		<button id="find" onClick="codeAddress();">Find</button>
			</div>
		</div>
	`;

var searchV = new searchView(searchCode);
searchV.bindEvents();
searchV.render();



