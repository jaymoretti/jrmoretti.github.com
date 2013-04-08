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


	///////////////////////////////////////////////////////////////
	// setup worker                                              //
	// made it public so the video can post and receive messages //
	///////////////////////////////////////////////////////////////
	this.worker = new Worker("js/effects/filters/Filters.js");
	
	var workerconsole = new MessageChannel();
	// register console
	this.worker.postMessage("console", [workerconsole.port2]);
	workerconsole.port1.onmessage = function(e)
	{
		log(e.data);
	};
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
		var filters = filtersFolder.add(video, 'filter', [ "None", "Sharpen", "Blur", "Threshold", "BW"] );
		filters.onChange(
			function(v)
			{
				if( v != "None")
					video.setFilter(v);
				else
					video.clearFilters();
			});

		var blendmodes = gui.addFolder('Blend Modes');
	}
}

Application.prototype = {};