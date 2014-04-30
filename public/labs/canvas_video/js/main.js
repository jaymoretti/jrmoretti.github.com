Main = {
	videoManager : null,

	initialize:function()
	{
		var scope = this;
		//var worker = new Worker("js/effects/filters/Filters.js");
		require(["libs/order!utils/Utils", "libs/order!libs/Stats", "libs/order!libs/dat.gui.min", "libs/order!libs/json2", "libs/order!effects/filters/Filters", "libs/order!canvas/media/video/Video","libs/order!controllers/video/VideoController", "libs/order!../videos/c1", "libs/order!core/Application"], function()
		{
				_application = new Application();
		});

	}
};

Main.initialize();