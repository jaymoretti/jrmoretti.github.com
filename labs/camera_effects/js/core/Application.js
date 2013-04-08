function Application()
{
	///////////////////
	// Set Stats.js  //
	///////////////////
	var stats = new Stats();

	////////////////////
	// Align top-left //
	////////////////////
	stats.getDomElement().style.position = 'absolute';
	stats.getDomElement().style.left = '0px';
	stats.getDomElement().style.top = '0px';

	document.body.appendChild( stats.getDomElement() );
	
	setInterval( function () {stats.update();}, 1000 / 60 );

	/////////////////
	// init video  //
	/////////////////
	
	
	video = new Camera(
							{
								width: 690,
								height: 360,
							}
						);

	video.setCallback(addGUI);
	
	var gui = new dat.GUI();
	
	function addGUI()
	{
		cl.hide();
		//////////////////
		// init dat.gui //
		//////////////////
		var filtersFolder = gui.addFolder('Filters');
		var filters = filtersFolder.add(video, 'filter', [ "None", "Sharpen", "Blur", "Threshold", "Black & White"] );
		filters.onChange(
			function(v)
			{
				if(v == "Blur")
					video.setFilter(Filters.BLUR);
				else if( v == "Sharpen")
					video.setFilter(Filters.SHARPEN);
				else if( v == "Threshold")
					video.setFilter(Filters.THRESHOLD);
				else if( v == "Black & White")
					video.setFilter(Filters.BW);
				else if( v == "None")
					video.clearFilters();
			});

		//var blendmodes = gui.addFolder('Blend Modes');
		
		var effectsFolder = gui.addFolder('Effects');
		var effects = effectsFolder.add(video, 'effect', [ "None", "Analog"] );
		effects.onChange(
		function(v)
		{
			if(v == "Analog")
				video.setEffect(Effects.ANALOG);
			else if( v == "None")
				video.clearEffects();
		});
	}
}

Application.prototype = {};