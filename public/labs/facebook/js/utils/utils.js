NodeList.prototype.toArray = function(){
	var arr = [];
	for(var i = this.length; i--; arr.unshift(this[i]));
	return arr;
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

String.prototype.toCamel = function(){
	return this.replace(/( ?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

if (typeof CustomEvent === 'undefined') {
    CustomEvent = function(type, eventInitDict) {
        var event = document.createEvent('CustomEvent');

        event.initCustomEvent(type, eventInitDict['bubbles'], eventInitDict['cancelable'], eventInitDict['detail']);
        console.log(event);
        return event;
    };
}