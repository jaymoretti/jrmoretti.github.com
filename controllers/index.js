function controllers(params)
{
  var app = params.app;
  controllers.index = function(req, res) {
		express.static(__dirname + '/public')
  };

  return controllers
}

module.exports = controllers;