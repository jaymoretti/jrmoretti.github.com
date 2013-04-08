var cl = new CanvasLoader('canvasloader-container');
			cl.setColor('#0099ff'); // default is '#000000'
			cl.setShape('spiral'); // default is 'oval'
			cl.setDensity(44); // default is 40
			cl.setRange(0.9); // default is 1.3
			cl.show(); // Hidden by default
Main = {
	videoManager : null,

	initialize:function()
	{
		var scope = this;
		//var worker = new Worker("js/effects/filters/Filters.js");
		require(
			[ 
				"libs/order!utils/Utils", 
				"libs/order!libs/log.min",
				"libs/order!libs/Stats", 
				"libs/order!libs/dat.gui.min", 
				"libs/order!libs/json2", 
				"libs/order!filters/Filters", 
				"libs/order!effects/Effects", 
				"libs/order!canvas/media/video/Camera",
				"libs/order!core/Application"
			], function()
			{
			
				_application = new Application();
			});

	}
};

Main.initialize();