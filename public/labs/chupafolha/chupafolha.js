(function (){
	$(document).ready(function(){
		$("body").attr('style', "");
		$("body map").parents('div').remove();

		removeAllEvents(window, "DOMMouseScroll");

		$(document).unbind("mousedown");
		window.onscroll = null;
		window.onmousewheel = null;
		document.onmousewheel = null;
		document.onkeydown = null;

		$("body").unbind('copy'); // e mais essa agora... eu sinto pena de vcs.

		paywall.controller.wheel = function(){ console.log("Boa... botou o map de volta"); }
		paywall.controller.t = function(){ console.log("Agora tem menos chances de ser demitido."); }
		paywall.controller.p = function(){ console.log("Só falta convencer o chefe a fazer o serviço via backend."); }

		console.log("CHUPA FOLHA");
	});

	var _eventHandlers = {};

	function removeAllEvents(node, event) {
	    if(node in _eventHandlers) {
	        var handlers = _eventHandlers[node];
	        if(event in handlers) {
	            var eventHandlers = handlers[event];
	            for(var i = eventHandlers.length; i--;) {
	                var handler = eventHandlers[i];
	                node.removeEventListener(event, handler[0], handler[1]);
	            }
	        }
	    }
	}
})();
