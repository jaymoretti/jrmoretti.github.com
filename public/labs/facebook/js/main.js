requirejs.config({
    baseUrl: 'js/',
    waitSeconds: 666,
    paths : {
        //create alias to plugins (not needed if plugins are on the baseUrl)
        jquery : 'libs/jquery-2.0.3.min',
        jquery_easing : 'libs/jquery.easing.1.3',
        phonegap : 'libs/cordova',
        sortby: 'libs/sort_by',
		text: 'libs/text',
		json: 'libs/json',
		utils : 'utils/utils',
		bootstrap : 'libs/bootstrap.min',
		bootstrapSelect : 'libs/bootstrap-select'
    }, 
    shim : {
		bootstrapSelect : {deps : ['bootstrap'] },
		bootstrap : {deps : ['jquery']}
    }
});

var currentRound = 29;

requirejs(['bootstrapSelect','utils', 'core/Application'],
	function (bootstrapSelect, utils, Application) {
		var app = new Application();
	}
);