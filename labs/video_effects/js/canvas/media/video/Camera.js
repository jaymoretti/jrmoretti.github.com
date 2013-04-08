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
function Video(params) /*width, height, customFPS*/
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

	function initialize()
	{
		// get camera
	}

	function render()
	{
		// get frame bitmapData
		var idata = scope.frames[fpos];
		
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
var RTCPeerConnection = null;
var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedBrowser = null;

if (navigator.mozGetUserMedia) {
  console.log("This appears to be Firefox");

  webrtcDetectedBrowser = "firefox";

  // The RTCPeerConnection object.
  RTCPeerConnection = mozRTCPeerConnection;

  // The RTCSessionDescription object.
  RTCSessionDescription = mozRTCSessionDescription;

  // The RTCIceCandidate object.
  RTCIceCandidate = mozRTCIceCandidate;

  // Get UserMedia (only difference is the prefix).
  // Code from Adam Barth.
  getUserMedia = navigator.mozGetUserMedia.bind(navigator);

  // Attach a media stream to an element.
  attachMediaStream = function(element, stream) {
    console.log("Attaching media stream");
    element.mozSrcObject = stream;
    element.play();
  };

  reattachMediaStream = function(to, from) {
    console.log("Reattaching media stream");
    to.mozSrcObject = from.mozSrcObject;
    to.play();
  };

  // Fake get{Video,Audio}Tracks
  MediaStream.prototype.getVideoTracks = function() {
    return [];
  };

  MediaStream.prototype.getAudioTracks = function() {
    return [];
  };
} else if (navigator.webkitGetUserMedia) {
  console.log("This appears to be Chrome");

  webrtcDetectedBrowser = "chrome";

  // The RTCPeerConnection object.
  RTCPeerConnection = webkitRTCPeerConnection;
  
  // Get UserMedia (only difference is the prefix).
  // Code from Adam Barth.
  getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

  // Attach a media stream to an element.
  attachMediaStream = function(element, stream) {
    element.src = webkitURL.createObjectURL(stream);
  };

  reattachMediaStream = function(to, from) {
    to.src = from.src;
  };

  // The representation of tracks in a stream is changed in M26.
  // Unify them for earlier Chrome versions in the coexisting period.
  if (!webkitMediaStream.prototype.getVideoTracks) {
    webkitMediaStream.prototype.getVideoTracks = function() {
      return this.videoTracks;
    };
    webkitMediaStream.prototype.getAudioTracks = function() {
      return this.audioTracks;
    };
  }

  // New syntax of getXXXStreams method in M26.
  if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
    webkitRTCPeerConnection.prototype.getLocalStreams = function() {
      return this.localStreams;
    };
    webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
      return this.remoteStreams;
    };
  }
} else {
  console.log("Browser does not appear to be WebRTC-capable");
}