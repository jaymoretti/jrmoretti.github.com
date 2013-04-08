Main = {
	videoManager : null,

	initialize:function()
	{
		var scope = this;
		
		require(["libs/order!utils/Utils", "libs/order!libs/Stats", "libs/order!libs/dat.gui.min", "libs/order!libs/json2", "libs/order!canvas/media/video/Video","libs/order!controllers/video/VideoController", "libs/order!../videos/c1", "libs/order!core/Application"], function()
		{
				_application = new Application();
		});

	}
};

Main.initialize();