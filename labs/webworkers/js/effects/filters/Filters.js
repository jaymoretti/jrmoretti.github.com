// ALL FILTERS FROM: http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
Filters = {

	BW : function(idata)
	{
		var d = idata.data;
		for (var i=0; i<d.length; i+=4)
		{
			var r = d[i];
			var g = d[i+1];
			var b = d[i+2];
			// CIE luminance for the RGB
			// The human eye is bad at seeing red and blue, so we de-emphasize them.
			var v = 0.2126*r + 0.7152*g + 0.0722*b;
			d[i] = d[i+1] = d[i+2] = v;
		}
		return idata;
	},

	THRESHOLD : function(idata)
	{
		var d = idata.data;
		var threshold = 32;
		for (var i=0; i<d.length; i+=4)
		{
			var r = d[i];
			var g = d[i+1];
			var b = d[i+2];
			var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
			d[i] = d[i+1] = d[i+2] = v;
		}
		return idata;
	},

	BLUR : function(idata, newiData)
	{
		return Filters.convolute(
				idata,
				[	1/9, 1/9, 1/9,
					1/9, 1/9, 1/9,
					1/9, 1/9, 1/9
				], false, newiData);
	},

	SHARPEN : function(idata, newiData)
	{
		return Filters.convolute(
				idata,
				[    0, -1,  0,
					-1,  5, -1,
                     0, -1,  0
                ], false, newiData);
	},

	convolute : function(pixels, weights, opaque, newiData) {
		
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side/2);
		var src = pixels.data;
		var sw = pixels.width;
		var sh = pixels.height;
		// pad output by the convolution matrix
		var w = sw;
		var h = sh;
		var output = newiData;
		var dst = output.data;
		// go through the destination image pixels
		var alphaFac = opaque ? 1 : 0;
		for (var y=0; y<h; y++)
		{
			for (var x=0; x<w; x++)
			{
				var sy = y;
				var sx = x;
				var dstOff = (y*w+x)*4;
				// calculate the weighed sum of the source image pixels that
				// fall under the convolution matrix
				var r=0, g=0, b=0, a=0;
				for (var cy=0; cy<side; cy++)
				{
					for (var cx=0; cx<side; cx++)
					{
						var scy = sy + cy - halfSide;
						var scx = sx + cx - halfSide;
						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw)
						{
							var srcOff = (scy*sw+scx)*4;
							var wt = weights[cy*side+cx];
							r += src[srcOff] * wt;
							g += src[srcOff+1] * wt;
							b += src[srcOff+2] * wt;
							a += src[srcOff+3] * wt;
						}
					}
				}
				dst[dstOff] = r;
				dst[dstOff+1] = g;
				dst[dstOff+2] = b;
				dst[dstOff+3] = a + alphaFac*(255-a);
			}
		}
		
		return output;
	},
	clear : function(idata)
	{
		var w = idata.width;
		var h = idata.height;
		var dst = idata.data;
		for (var y=0; y<h; y++)
		{
			for (var x=0; x<w; x++)
			{
				var sy = y;
				var sx = x;
				var dstOff = (y*w+x)*4;

				var r=255, g=255, b=255, a=255;
				
				dst[dstOff] = r;
				dst[dstOff+1] = g;
				dst[dstOff+2] = b;
				dst[dstOff+3] = a + 1*(255-a);
			}
		}
		return idata;
	},
	applyFilter : function(fn, frames, newiData)
	{
		var pf = [];

		for(var i=0; i!=frames.length; i++)
		{
			var ciData = Filters.clear(newiData);
			pf.push(fn.call(this, frames[i], ciData));
		}
		postMessage(pf);
	}
};
var self = this;
onmessage = function(e){
	if(e.data!== "console")
	{
		Filters.applyFilter(Filters[e.data.filter], e.data.frames, e.data.newiData);
	} else {
		self.console = {
			_port: e.ports[0],           // Remember the port we log to
			log: function log() {        // Define console.log()
				// Copy the arguments into a real array
				var args = Array.prototype.slice.call(arguments);
				// Send the arguments as a message, over our side channel
				console._port.postMessage(args);
			}
		};
	}
};