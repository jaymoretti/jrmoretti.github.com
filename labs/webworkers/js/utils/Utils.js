/* http://www.quirksmode.org/js/detect.html + mobile detection
	isAndroid.version = float | isAndroid.device = string | isAndroid.tablet = false;
	isIOS.version = float | isIOS.device = string;
	BrowserDetect.browser = string | BrowserDetect.version = float;
*/
var BrowserDetect = {init: function () {this.browser = this.searchString(this.dataBrowser) || "An unknown browser";this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";this.OS = this.searchString(this.dataOS) || "an unknown OS";},searchString: function (data) {for (var i=0;i<data.length;i++)	{var dataString = data[i].string;var dataProp = data[i].prop;this.versionSearchString = data[i].versionSearch || data[i].identity;if (dataString) {if (dataString.indexOf(data[i].subString) != -1)return data[i].identity;}else if (dataProp)return data[i].identity;}},searchVersion: function (dataString) {var index = dataString.indexOf(this.versionSearchString);if (index == -1) return;return parseFloat(dataString.substring(index+this.versionSearchString.length+1));},dataBrowser: [{string: navigator.userAgent,subString: "Chrome",identity: "Chrome"},{string: navigator.userAgent,subString: "OmniWeb",versionSearch: "OmniWeb/",identity: "OmniWeb"},{string: navigator.vendor,subString: "Apple",identity: "Safari",versionSearch: "Version"},{prop: window.opera,identity: "Opera",versionSearch: "Version"},{string: navigator.vendor,subString: "iCab",identity: "iCab"},{string: navigator.vendor,subString: "KDE",identity: "Konqueror"},{string: navigator.userAgent,subString: "Firefox",identity: "Firefox"},{string: navigator.vendor,subString: "Camino",identity: "Camino"},{string: navigator.userAgent,subString: "Netscape",identity: "Netscape"},{string: navigator.userAgent,subString: "MSIE",identity: "Explorer",versionSearch: "MSIE"},{string: navigator.userAgent,subString: "Gecko",identity: "Mozilla",versionSearch: "rv"},{string: navigator.userAgent,subString: "Mozilla",identity: "Netscape",versionSearch: "Mozilla"}],dataOS : [{string: navigator.platform,subString: "Win",identity: "Windows"},{string: navigator.platform,subString: "Mac",identity: "Mac"},{string: navigator.userAgent,subString: "iPhone",identity: "iPhone/iPod"},{string: navigator.platform,subString: "Linux",identity: "Linux"}]};BrowserDetect.init();var deviceAgent = navigator.userAgent.toLowerCase();var isIOS = deviceAgent.match(/(iphone|ipod|ipad)/) ? {version: deviceAgent.substring(deviceAgent.indexOf('os '), deviceAgent.indexOf(' like')).split(" ")[1].replace("_", "."), device: deviceAgent.match(/(iphone|ipod|ipad)/)[0]} : null;var isAndroid = deviceAgent.match(/(android)/) ? {version: deviceAgent.substring(deviceAgent.indexOf('android '), deviceAgent.indexOf(';', deviceAgent.indexOf('android '))).split(" ")[1], device: deviceAgent.substring(deviceAgent.indexOf('; ', deviceAgent.indexOf("android ")+15), deviceAgent.indexOf("build")).slice(2), tablet: deviceAgent.match(/(mobile)/) ? false : true} : null;

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){return  window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback, element){window.setTimeout(callback, 1000 / 60);};})();
window.cancelAnimFrame = (function() {return window.cancelAnimationFrame ||window.webkitCancelAnimationFrame ||window.mozCancelAnimationFrame ||window.oCancelAnimationFrame ||window.msCancelAnimationFrame ||window.clearTimeout;})();

var mode = "debug"; // allow logging

/* log function, iOS compatible */
function log()
{
	if(mode == "debug")
	{
		if(window.console)
		{
			if(!isIOS)
			{
				console.log(Array.prototype.slice.call(arguments));
			} else {
				for (var i = 0 ; i < arguments.length; i++)
					console.log(arguments[i]);
			}
		} else {
			for (var j = 0; j < arguments.length; j++)
				alert(arguments[j]);
		}
	}
}