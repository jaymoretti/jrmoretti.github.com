var express = require('express');
	http = require('http');
	fs = require('fs');
	routes = require('./routes')

var app = express();

http.createServer(app).listen(8080, function(){
	
});

var controllers = require('./controllers')({app:app});
routes.setup(app, controllers);