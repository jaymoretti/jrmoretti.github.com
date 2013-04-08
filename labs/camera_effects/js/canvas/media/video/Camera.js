/**
 * Canvas Camera Class;
 *
 * @author Jay Moretti (jrmoretti@gmail.com)
 * @version 0.0.1
 * @param Number width	Width of the video player
 * @param Number height Height of the video player
 * @returns CanvasElement	Appends a canvas element to the document root.
 * @todo Add Filter and Blend Mode Support
 * @todo Add target container support
 * @todo Add frameblending
 * @todo Add Sound Support
 *
 */
function Camera(params) /*width, height, customFPS*/
{
	var scope=this;
	
	var filter = null;		// Expects function to be passed via setFilter
	this.filter = "none";	// Default dat.gui option
	var blendmode = null;	// Expects function to be passed via setBlendMode
	this.blendmode = "none";// Default dat.gui option
	var effect = Effects.ANALOG;		// Expects function to be passed via setEffect
	this.effect = "Analog";	// Default dat.gui option

	this.timer = null;
	this.state = CameraState.LOADING;
		
	/////////////////////
	// playback params //
	/////////////////////
	this.fps = params.customFPS ? params.customFPS : 24;
	var fps = (1/scope.fps)*1000;

	////////////////////////
	// The canvas output  //
	////////////////////////
	this.canvas = document.createElement('canvas');
	this.canvasContext = this.canvas.getContext('2d');
	this.canvas.width = params.width;
	this.canvas.height = params.height;
	document.body.appendChild(this.canvas);
	
	//////////////////////
	// The other stuff  //
	//////////////////////
	this.width = params.width;
	this.height = params.height;
	
	this.callback = null;
	
	////////////////////
	// Camera Options //
	////////////////////	
	this.video = document.createElement('video');
	this.video.autoplay = true;
			
	this.video.height = params.height;
	this.video.width = params.width;

	function initialize()
	{
		// get camera
		console.log("GET CAMERA");
		navigator.webkitGetUserMedia({video: true, audio: true}, function(localMediaStream) {
			scope.video.src = window.URL.createObjectURL(localMediaStream);
			scope.video.volume = 0.1;
			console.log("CAMERA READY");
			render();
			if(scope.callback!==null)
				scope.callback();
    	}, function(){
    		console.log("FAILED CAM");
    	});
	}

	function render()
	{
		// get frame bitmapData
		var canvas  = document.createElement('canvas');
		canvas.width = scope.width;
		canvas.height = scope.height;
		var context = canvas.getContext('2d');
		context.drawImage(scope.video,0,0,scope.width,scope.height);

		var idata = context.getImageData(0,0,scope.width,scope.height);
		
		if(filter!==null)
			idata = applyFilter(idata);

		if(blendmode!==null)
			idata = applyBlendMode(idata);
			
		if(effect!==null)
			idata = applyEffect(idata);

		scope.canvasContext.putImageData(idata, 0,0);
		
		scope.timer = clearTimeout();
		scope.timer = setTimeout( render, fps, scope.currentFrame );		
	}

	function applyFilter(idata)
	{
		return filter.call(scope, idata);
	}
	
	function applyEffect(idata)
	{
		return effect.call(scope, idata);
	}

	this.setCallback = function(fn)
	{
		scope.callback = fn;
	};

	/////////////////////////////////////////////////////////////
	// Sets the filter function to run over individual frames  //
	/////////////////////////////////////////////////////////////
	this.setFilter = function(fn)
	{
		filter = fn;
	};
	
	///////////////////////////////////////////////////////
	// Sets the blendmode to run over individual frames  //
	///////////////////////////////////////////////////////
	this.setBlendMode = function(fn)
	{
		blendmode = fn;
	};
	
	///////////////////////////////////////////////////////
	// Sets the effect to run over individual frames  //
	///////////////////////////////////////////////////////
	this.setEffect = function(fn)
	{
		effect = fn;
	};

	//////////////////
	// Clear Filter //
	//////////////////
	this.clearFilters = function()
	{
		log("Clear filter");
		filter = null;
	};

	///////////////////////
	// Clear Blend Modes //
	///////////////////////
	this.clearBlendMode = function()
	{
		blendmode = null;
	};
	
	///////////////////////
	// Clear Effects //
	///////////////////////
	this.clearEffects = function()
	{
		effect = null;
	};

	initialize();
};

Camera.prototype = {};

CameraState = {
	LOADING : "CameraLoading",
	READY : "CameraReady",
	PLAYING : "CameraPlaying",
	PAUSED : "CameraPaused",
	STOPPED : "CameraStopped"
};