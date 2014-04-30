requirejs.config({
    baseUrl: 'js/',
    paths : {
    	log : 'libs/log',
    	stacktrace : 'libs/vendor/stacktrace'
        //create alias to plugins (not needed if plugins are on the baseUrl)
		/*text: 'libs/text',
		json: 'libs/json',
		stats: 'libs/stats',
		dat: 'libs/dat.gui'*/
    }
});

requirejs(['stacktrace', 'log', 'app',  ],
	function (st, log, Application ) {
		var app = new Application();
	}
);