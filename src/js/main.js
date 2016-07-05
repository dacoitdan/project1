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

pageView.prototype = Object.create(View.prototype);

pageView.prototype.bindEvents = function () {
	var _this = this;
	_this.el.innerHTML = _this.data;
	var b = document.createElement('button');
	b.textContent = 'Back'
	b.addEventListener('click', function(){
		_this.hide()
		searchV.render();
		searchV.el.querySelector('#lat').value = '';
		searchV.el.querySelector('#lon').value = '';
	})
	_this.el.appendChild(b);
}

function searchView(data){
	View.call(this, data);
	this.el.innerHTML = this.data;
	this.el.id = 'search';
}

searchView.prototype = Object.create(View.prototype);

searchView.prototype.bindEvents = function () {
	var _this = this;

	_this.el.querySelector("#searchbutton").addEventListener('click', function(){

		var lat = document.querySelector("#lat").value;
		var lon = document.querySelector("#lon").value;
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
				_this.hide();
				listV.bindEvents();	
				listV.render();
				// req2.open('GET', 'https://api.nasa.gov/planetary/earth/imagery?lon='+lon+'&lat='+lat+'&date='+date+'&api_key=oimeUzHTeCeTKXALwmS3oe5kBevFbqaeVrcqBgK6');
				// req2.send(null);
			}
		}
		// req2.onreadystatechange = function(){
		// 	if(req2.readyState === 4) {
		// 		console.log(req2.responseText);
		// 		img.src = JSON.parse(req2.responseText).url;
		// 		img.id = 'displayImg';
		// 		document.querySelector('#search').appendChild(img);
		// 	}
		// }
		req.open('GET', 'https://api.nasa.gov/planetary/earth/assets?lon='+lon+'&lat='+lat+'&begin='+x+'&api_key=oimeUzHTeCeTKXALwmS3oe5kBevFbqaeVrcqBgK6');
		req.send(null);

	})

	_this.el.querySelector(".about").addEventListener('click', function(){
		var aboutV = new pageView(aboutHTML, 'about');
		aboutV.bindEvents();
		_this.hide();
		aboutV.render();
	})

	_this.el.querySelector(".contact").addEventListener('click', function(){
		var aboutV = new pageView(contactHTML, 'contact');
		aboutV.bindEvents();
		_this.hide();
		aboutV.render();
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
	b.addEventListener('click', function(){
		_this.hide()
		searchV.render();
		searchV.el.querySelector('#lat').value = '';
		searchV.el.querySelector('#lon').value = '';
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
				<h1>Jaidev & Adrian's Globe Explorer</h1>
			</header>
		</div>
		<div>
			<div>
				<label for="lat">LAT: </label><input type="number" name="lat" id="lat" class="input">
			</div>
			<div>
				<label for="lon">LON: </label><input type="number" name="lon" id="lon" class="input">
			</div>
		</div>
		<div>
			<button id="searchbutton">Search!</button>
		</div>
	`;

var aboutHTML = `
			about
		`;

var contactHTML = `
			contact
		`;

var searchV = new searchView(searchCode);
searchV.bindEvents();
searchV.render();



