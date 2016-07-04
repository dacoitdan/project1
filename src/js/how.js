// How to Button
// Click button and a text box stating how to use app will appear

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

function How(data){
	View.call(this, data);
	this.el.innerHTML = this.data;
	this.el.id = 'how';
}

How.prototype = Object.create(View.prototype);

How.prototype.bindEvents = function () {
	var _this = this;
	_this.el.querySelector("#howbutton").addEventListener('click', function() {

	var _this = this;
	var p = document.createElement('p');
	p.textContent = 'How to Use';
	_this.el.appendChild(p);

	var x = document.createElement('button');
	x.textContent = 'HowTo'
	x.addEventListener('click', function(){
		_this.hide()
		howTo.render();
	})
	_this.el.appendChild(x);
}


