// Video Manager Class
VideoManager = function()
{
	this.video1=null;
	this.video2=null;
	this.video3=null;
	this.video4=null;
	this.video5=null;
	this.video6=null;

	this.initialize();


	this.canvas = document.createElement('canvas');
	this.canvasContext = this.canvas.getContext('2d');
	this.canvas.width = 640;
	this.canvas.height = 360;
	this.loadedVideos = 0;
};


VideoManager.prototype = {
	initialize : function()
	{

		scope = this;

		this.video1 = new Video("videos/c0", 640,360);
		this.video1.setCallback(this.videoReady);
		this.video1.initialize();
	},

	videoReady : function()
	{
		console.log(this.path);
	},
	jumpTo : function(angle)
	{
		
	}
};