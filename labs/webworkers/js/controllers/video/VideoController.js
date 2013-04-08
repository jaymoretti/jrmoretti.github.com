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
		
		this.video2 = new Video("videos/c1", 640,360);
		this.video2.setCallback(this.videoReady);
		this.video2.initialize();
		
		this.video3 = new Video("videos/c2", 640,360);
		this.video3.setCallback(this.videoReady);
		this.video3.initialize();
		
		this.video4 = new Video("videos/c3", 640,360);
		this.video4.setCallback(this.videoReady);
		this.video4.initialize();
		
		this.video5 = new Video("videos/c4", 640,360);
		this.video5.setCallback(this.videoReady);
		this.video5.initialize();
		
		this.video6 = new Video("videos/c5", 640,360);
		this.video6.setCallback(this.videoReady);
		this.video6.initialize();
	},

	videoReady : function()
	{
		console.log(this.path);
	},
	jumpTo : function(angle)
	{
		
	}
};