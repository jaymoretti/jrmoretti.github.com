(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("controllers/MapsController", function(exports, require, module) {
function MapsController(){
	var scope = this;
	var mapsdk = document.createElement('script');
	mapsdk.type = 'text/javascript';
	mapsdk.src = 'https://maps.googleapis.com/maps/api/js??key=AIzaSyBkRfvEt4j0-q3wITsgF0363nag8Zmd4zc&sensor=false&callback=mapsLoaded';
	document.body.appendChild(mapsdk);

	window.mapsLoaded = function(){
		scope.initializeMap();
	}

	$(document).bind(Events.ZOOM_UP, function(){scope.onZoomUp();});
	$(document).bind(Events.ZOOM_DOWN, function(){scope.onZoomDown();});

}

MapsController.prototype = {
	map : null,
	initializeMap : function(){
		var mapOptions = {
			center: new google.maps.LatLng(40.74833, -98.98556),
			zoom: 5,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		google.maps.event.addListener(this.map, "mouseup", function(event){
			console.log(event.latLng);
		});
	},

	createMaker : function (point){
		var point = this.pointToLatLang(point);
	}, 

	onZoomUp : function(){
		this.map.setZoom(this.map.getZoom()+1);
	},

	onZoomDown : function(){
		this.map.setZoom(this.map.getZoom()-1);
	}
}
MapsController.prototype.contructor = MapsController;

module.exports = MapsController;
});

;require.register("controllers/ViewController", function(exports, require, module) {
HomeView = require("views/Home");

function ViewController(){

	var currentView = "home";
	var scope = this;
	this.setView(currentView);

	$(document).bind(Events.VIEW_ANIMATE_OUT, function(){
		scope.currentView.animateIn();
	});
}

ViewController.prototype = {
	map : document.getElementById("map-canvas"),
	views : { 
				home : new HomeView(), 
			},
	currentView : null, 
	setView : function( view ){
		if(this.currentView)
			this.currentView.animateOut();
		else
			this.views[view].animateIn();

		this.map.className = this.map.className.split(" ")[0]+" disabled";
		this.currentView = this.views[view];
	}
}

ViewController.prototype.constructor = ViewController;

module.exports = ViewController;

});

;require.register("core/Application", function(exports, require, module) {
require('events/Events');
MapsController = require("controllers/MapsController")
ViewController = require("controllers/ViewController");

function Application(){
	if(window.location.href.indexOf("localhost") > -1){
		var s = document.createElement('script');
		s.src = "//localhost:35729/livereload.js?snipver=1";
		document.body.appendChild(s);
	}
	var mapsController = new MapsController();
	var viewController = new ViewController();
}

Application.prototype = {};
Application.prototype.constructor = Application;

module.exports = Application;
});

;require.register("events/Events", function(exports, require, module) {
window.Events = {
	ZOOM_UP : "MAP_ZOOM_UP",
	ZOOM_DOWN : "MAP_ZOOM_DOWN",
	VIEW_ANIMATE_OUT : "VIEW_ANIMATE_OUT"
}
});

;require.register("main", function(exports, require, module) {
Application = require("core/Application");

var app = new Application();
});

;require.register("models/QuestionsModel", function(exports, require, module) {
var instance = null
function QuestionsModel(){
}

QuestionsModel.prototype = {
	data : {},
	inject : function(prop, data){
		this.data[prop] = data;
	}
};
QuestionsModel.prototype.constructor = QuestionsModel;

function getInstance(){ 
	if(instance === null){
		return new QuestionsModel();
	} else {
		return instance;
	}
}

module.exports = getInstance;
});

;require.register("views/Home", function(exports, require, module) {
function Home(){
	var scope = this;
	$(".button").click(function(e){
		e.preventDefault();
		$(".card").addClass("answer");
		setTimeout(function(){
			//$(".answer-submit").removeClass("closed");
			$(".controls").removeClass("closed");
			$(".controls .zoom-up").click(function(){
				$(document).trigger(Events.ZOOM_UP);
			});
			$(".controls .zoom-down").click(function(){
				$(document).trigger(Events.ZOOM_DOWN);
			});
			$(".map").removeClass("disabled").addClass("enabled");
			$(".answer-pin").addClass("draggable");
			
			$("#pin").drags(
				{
					onDragEnd : function(offset)
					{
						console.log(offset)
					}
				})
		}, 250);
	});
}

Home.prototype = {
	animateIn : function(){
		
	}, 

	animateOut : function(){

	}
}

Home.prototype.constructor = Home;

module.exports = Home;

});

;
//# sourceMappingURL=app.js.map