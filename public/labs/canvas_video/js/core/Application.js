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
	
	
	video = new Video(
							{
								source: VideoData,
								width: 690,
								height: 360,
								fps: 29,
								autoplay: true,
								loop: true,
								reverse: true
								//outputdata: true
							}
						);
	video.setCallback(addGUI);
	
	var gui = new dat.GUI();

	function addGUI()
	{
		//////////////////
		// init dat.gui //
		//////////////////
		
		var fps = gui.add(video, 'fps', 1, 60);
		fps.onFinishChange(video.setFPS);

		var reverse = gui.add(video, 'reverse');
		reverse.onChange(video.reversePlay);
	
		gui.add(video, 'loop');

		var frame = gui.add(video, 'currentFrame', 0, video.frames.length-1).listen();
		frame.onChange(video.seek);

		var controls = gui.addFolder('Controls');
		controls.add(video, 'play');
		controls.add(video, 'pause');
		controls.add(video, 'stop');

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

		var blendmodes = gui.addFolder('Blend Modes');
	}
}

Application.prototype = {};