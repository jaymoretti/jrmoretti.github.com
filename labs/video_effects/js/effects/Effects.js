Effects = {
	
	ANALOG : function(idata)
	{
		var outputCanvas = document.createElement('canvas');
		var outputContext = outputCanvas.getContext('2d');
		outputCanvas.width = idata.width;
		outputCanvas.height = idata.height;
		outputContext.createImageData(idata.width, idata.height);
		var outputImage = outputContext.getImageData(0,0,idata.width,idata.height);
		var outputData = outputImage.data;
		
		var inputData = idata.data;
		
		var offsetRange = Math.round(Math.random() * 30)
		var lineOffset;
		
		outputContext.beginPath();
		
		
		
		
		for (var y = 0; y < idata.height; y++)
		{
			lineOffset = Math.round((Math.random() * (offsetRange)) - (offsetRange / 2));
			//lineOffset = this.currentFrame;
			
			outputContext.putImageData(idata, lineOffset, 0, 0, y, idata.width, 1);
			
			if (y % 2 == 0)
			{
				outputContext.rect(0, y, idata.width, 1);
			}
		}
		
		outputContext.fillStyle = "rgba(0,0,0," + (0.6 + (Math.random() * 0.4)) + ")";
		outputContext.fill();
		
		return outputContext.getImageData(0,0,idata.width,idata.height);
	},

	clone : function(idata)
	{
		var c = document.createElement('canvas');
		var ctx = c.getContext('2d');
		c.width = idata.width;
		c.height = idata.height;
		ctx.putImageData(idata, 0, 0);
		return ctx.getImageData(0,0,idata.width,idata.height);
	},
	
	createImageData : function(w,h) {
		return this.tmpCtx.createImageData(w,h);
	}
};

Effects.tmpCanvas = document.createElement('canvas');
Effects.tmpCtx = Effects.tmpCanvas.getContext('2d');