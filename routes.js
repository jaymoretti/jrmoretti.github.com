var express = require('express');
exports.setup = function(app, controllers) {
  app.use("/", express.static(__dirname + '/public'));
  app.get("/html5_player_template", function(req, res){
  	res.writeHead(302, {'Location' : "https://www.youtube.com/html5_player_template"});
  });
  app.get("/maplebear", function(req, res){
  	var fs = require('fs');
  	fs.readFile('./public/maplebear/MapleBear-Toddlers.pls', function(err, data){
  		res.setHeader('content-type', 'audio/x-scpls');
  		res.send(data);
  	});
  });
};