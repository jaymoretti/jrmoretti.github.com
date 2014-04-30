/**
 * Video Canvas Class;
 *
 * @author Jay Moretti (jrmoretti@gmail.com)
 * @version 0.0.1
 * @param String path	Video Path to be loaded
 * @param Number width	Width of the video player
 * @param Number height Height of the video player
 * @returns CanvasElement	Appends a canvas element to the document root.
 * @todo Add Filter and Blend Mode Support
 * @todo Add target container support
 * @todo Add frameblending
 * @todo Add Sound Support
 *
 */
function Video(params)/*source, width, height, customFPS, autoplay, outputImageData*/
{
	var scope=this;
	var dataOutput = "{";
	
	var filter = null;		// Expects function to be passed via setFilter
	this.filter = "none";	// Default dat.gui option
	var blendmode = null;	// Expects function to be passed via setBlendMode
	this.blendmode = "none";// Default dat.gui option

	this.timer = null;
	this.state = VideoState.LOADING;



	if(typeof params.source == "string")
	{
		this.path = params.source;
		
		//////////////////////////////////////////////
		//  Video Element used to cache the video   //
		//////////////////////////////////////////////
		this.video = document.createElement('video');
	} else if(typeof params.source == "object")
	{
		this.data = params.source;
	}
		
	/////////////////////
	// playback params //
	/////////////////////
	this.autoplay = params.autoplay ? params.autoplay : false;
	this.reverse = params.reverse ? params.reverse : false;
	this.loop = params.loop ? params.loop : false;
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
	this.currentFrame = 0;
	this.width = params.width;
	this.height = params.height;
	this.frames = [];
	this.callback = null;

	///////////////////////////////////////////////////////////////
	// Detects which video to use and start the caching process  //
	///////////////////////////////////////////////////////////////
	function initialize()
	{
		
		if(scope.path)
		{
			if (scope.video.canPlayType("video/webm") == "maybe") {
				scope.video.src=scope.path+".webm";
			} else if (scope.video.canPlayType("video/ogg") == "maybe") {
				scope.video.src=scope.path+".theora.ogv";
			} else if (scope.video.canPlayType("video/mp4") == "maybe"){
				scope.video.src=scope.path+".mp4";
			} else {
				alert("Your Browser Cannot Play HTML5 Videos");
				return;
			}

			scope.video.addEventListener('play', function(){
				cacheFrames();
			},false);

			scope.video.play();
		} else if(scope.data)
		{
			cacheImages(0);
		}
	}

	////////////////////////////////////
	// converts images into imageData //
	////////////////////////////////////
	function cacheImages(frame)
	{
		var image = new Image();
		image.src = scope.data[frame];
		image.onload = function(){
			var canvas  = document.createElement('canvas');
			canvas.width = scope.width;
			canvas.height = scope.height;
			var context = canvas.getContext('2d');
			context.drawImage(image,0,0,scope.width,scope.height);
	
			var idata = context.getImageData(0,0,scope.width,scope.height);
				
			scope.frames.push(idata);
			canvas = null;

			if(scope.frames.length == scope.data.length-1)
				videoReady();
			else
				cacheImages(frame+1);
		};
	
	}

	//////////////////////////////////////////////////////////////////////
	// Convert frames into imageData objects so they can be manipulated //
	//////////////////////////////////////////////////////////////////////
	function cacheFrames()
	{
		if(scope.video.paused || scope.video.ended ){
			videoReady();
			return;
		}

		var canvas  = document.createElement('canvas');
		canvas.width = scope.width;
		canvas.height = scope.height;
		var context = canvas.getContext('2d');
		context.drawImage(scope.video,0,0,scope.width,scope.height);

		var idata = context.getImageData(0,0,scope.width,scope.height);

		if(params.outputImageData)
			dataOutput += '"frame":"'+canvas.toDataURL() + '",';

		scope.frames.push(idata);

		canvas = null;

		setTimeout(cacheFrames, fps);
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////
	// calls a function callback saying all frames have been cached and the video is ready to play //
	/////////////////////////////////////////////////////////////////////////////////////////////////
	function videoReady()
	{
		scope.state = VideoState.READY;
		
		if(scope.video)
			scope.video = null;
		
		if(params.outputImageData)
			log(dataOutput + "}");

		if(scope.callback!==null)
			scope.callback();
		
		if(scope.autoplay)
			scope.play();

	}

	///////////////////////////////////////////
	// print image data into the main canvas //
	///////////////////////////////////////////
	function render( fpos )
	{

		var idata = scope.frames[fpos];
		
		if(filter!==null)
			idata = applyFilter(idata);

		if(blendmode!==null)
			idata = applyBlendMode(idata);

		scope.canvasContext.putImageData(idata, 0,0);

		if( scope.reverse === false )
		{
			if( fpos < scope.frames.length-1 )
			{
				scope.currentFrame++;
			
				if(scope.state == VideoState.PLAYING )
					scope.timer = setTimeout( render, fps, scope.currentFrame );
			
			} else {
			
				scope.currentFrame = 0;
			
				if( scope.loop && scope.state == VideoState.PLAYING )
				{
					scope.timer = clearTimeout();
					scope.timer = setTimeout( render, fps, scope.currentFrame );
				}
				else
				{
					scope.timer = clearTimeout();
					scope.state = VideoState.STOPPED;
				}
			}
		} else {
			if(fpos > 0)
			{
			
				scope.currentFrame--;
				
				if(scope.state == VideoState.PLAYING )
					scope.timer = setTimeout( render, fps, scope.currentFrame );
				
			} else {
			
				scope.currentFrame = scope.frames.length-1;
				
				if( scope.loop && scope.state == VideoState.PLAYING )
				{
					scope.timer = clearTimeout();
					scope.timer = setTimeout( render, fps, scope.currentFrame );
				}
				else
				{
					scope.timer = clearTimeout();
					scope.state = VideoState.STOPPED;
				}
			}
		}
	}

	function applyFilter(idata)
	{
		return filter.call(scope, idata);
	}

	///////////////////////////////////////////////////////////////
	// set function to be called when the video is ready to play //
	///////////////////////////////////////////////////////////////
	this.setCallback = function(fn)
	{
		scope.callback = fn;
	};

	///////////////////////////////
	// video execution functions //
	///////////////////////////////
	this.play = function()
	{
		if(scope.state!=VideoState.PLAYING)
		{
			scope.state = VideoState.PLAYING;
			render(scope.currentFrame);
		}
		
	};

	this.pause = function()
	{
		scope.state = VideoState.PAUSED;
	};

	this.stop = function()
	{
		scope.timer = null;
		scope.currentFrame = 0;
		scope.state = VideoState.STOPPED;
		render(scope.currentFrame);
	};

	this.seek = function(frame)
	{
		scope.state = VideoState.PAUSED;
		scope.currentFrame = Math.round(frame);
		render(scope.currentFrame);
	};

	this.reversePlay = function()
	{
		scope.timer = null;

		if(scope.state == VideoState.PLAYING)
			render(scope.currentFrame);
	};

	this.setFPS = function(v)
	{
		scope.fps = v;
		fps = (1/scope.fps)*1000;
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

	initialize();

}

Video.prototype = {};

VideoState = {
	LOADING : "VideoLoading",
	READY : "VideoReady",
	PLAYING : "VideoPlaying",
	PAUSED : "VideoPaused",
	STOPPED : "VideoStopped"
};