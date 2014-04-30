define(function(){
	function Application(){
		if(window.location.href.indexOf("localhost") > -1){
			var s = document.createElement('script');
			s.src = "//localhost:35729/livereload.js?snipver=1";
			document.body.appendChild(s);
		}
		console.log("App running")
	}
	return Application;
})