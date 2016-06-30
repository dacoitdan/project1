document.querySelector("#search").addEventListener('click', function(){

	var lat = document.querySelector("#lat").value;
	var lon = document.querySelector("#lon").value;
	var today = new Date();
	var d = today.getDate();
	var m = today.getMonth()+1;
	var y = today.getFullYear()-1;
	var x = '' + y + '-' + m + '-' + d;

	var img = document.createElement('img');

	var req = new XMLHttpRequest();
	var req2 = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if(req.readyState === 4){
			var assets = JSON.parse(req.responseText);
			var date = assets.results[0].date.split('T')[0];
			req2.open('GET', 'https://api.nasa.gov/planetary/earth/imagery?lon='+lon+'&lat='+lat+'&date='+date+'&api_key=oimeUzHTeCeTKXALwmS3oe5kBevFbqaeVrcqBgK6');
			req2.send(null);
		}
	}
	req2.onreadystatechange = function(){
		if(req2.readyState === 4) {
			console.log(req2.responseText);
			img.src = JSON.parse(req2.responseText).url;
			document.body.appendChild(img);
		}
	}
	req.open('GET', 'https://api.nasa.gov/planetary/earth/assets?lon='+lon+'&lat='+lat+'&begin='+x+'&api_key=oimeUzHTeCeTKXALwmS3oe5kBevFbqaeVrcqBgK6');
	req.send(null);
})