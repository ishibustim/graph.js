function Graph(container, width, height)
{
  // Initialize object variables
  this.xArray = [];
  this.yArray = [];
  this.colorArray = [];
  this.plotXAxis = false;
  this.plotYAxis = false;
  // Plot tick marks if plotTickMarks > 0
  this.plotTickMarks = -1;

  // Create canvas
  this.container = container;
  this.container.innerHTML = '<canvas height="' + height + '" width="' + width + '"></canvas>';
  this.canvas = this.container.childNodes[0];
}//end graph default constructor

Graph.prototype.addData = function(xData, yData, color)
{
  if(xData.length == yData.length)
  {
    this.xArray[this.xArray.length] = xData;
    this.yArray[this.yArray.length] = yData;
    this.colorArray[this.colorArray.length] = color;
  }//end if
  else
  {
    console.log("WARNING: Cannot add data. xData.length != yData.length");
  }//end else
};//end addData

Graph.prototype.plot = function()
{
  var PADDING = 10;
  
  var ctx = this.canvas.getContext('2d');
  
  var domainMin = this.xArray[0][0];
  var domainMax = this.xArray[0][0];
  var rangeMin = this.yArray[0][0];
  var rangeMax = this.yArray[0][0];

  // Find the domain and range for all data sets
  for(var dataSet = 0; dataSet < this.xArray.length; dataSet++)
  {
    for(var dataPoint = 0; dataPoint < this.xArray[dataSet].length; dataPoint++)
    {
      if(this.xArray[dataSet][dataPoint] < domainMin)
      {
	domainMin = this.xArray[dataSet][dataPoint];
      }//end if
      else if(this.xArray[dataSet][dataPoint] > domainMax)
      {
	domainMax = this.xArray[dataSet][dataPoint];
      }//end else if

      if(this.yArray[dataSet][dataPoint] < rangeMin)
      {
	rangeMin = this.yArray[dataSet][dataPoint];
      }//end if
      else if(this.yArray[dataSet][dataPoint] > rangeMax)
      {
	rangeMax = this.yArray[dataSet][dataPoint];
      }//end else if
    }//end for
  }//end for

  // Plot each axis, if toggled on
  if(this.plotXAxis)
  {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.moveTo(this.getPoint(domainMin, domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(0, rangeMin, rangeMax, PADDING, this.canvas.height));
    ctx.lineTo(this.getPoint(domainMax, domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(0, rangeMin, rangeMax, PADDING, this.canvas.height));
    ctx.stroke();
  }//end if
  if(this.plotYAxis)
  {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.moveTo(this.getPoint(0, domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(rangeMin, rangeMin, rangeMax, PADDING, this.canvas.height));
    ctx.lineTo(this.getPoint(0, domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(rangeMax, rangeMin, rangeMax, PADDING, this.canvas.height));
    ctx.stroke();
  }//end if

  // Plot tick marks for each axis, if toggled on
  if(this.plotTickMarks > 0)
  {
    // X-axis tick marks where x >= 0
    for(var x = 0; x <= domainMax; x += this.plotTickMarks)
    {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = "#555555";
      ctx.moveTo(this.getPoint(x, domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(0, rangeMin, rangeMax, PADDING, this.canvas.height) - 10);
      ctx.lineTo(this.getPoint(x, domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(0, rangeMin, rangeMax, PADDING, this.canvas.height) + 10);
      ctx.stroke();
    }//end for

    // X-axis tick marks where x <= 0
    for(var x = 0; x >= domainMin; x -= this.plotTickMarks)
    {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = "#555555";
      ctx.moveTo(this.getPoint(x, domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(0, rangeMin, rangeMax, PADDING, this.canvas.height) - 10);
      ctx.lineTo(this.getPoint(x, domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(0, rangeMin, rangeMax, PADDING, this.canvas.height) + 10);
      ctx.stroke();
    }//end for

    // Y-axis tick marks where y >= 0
    for(var y = 0; y <= rangeMax; y += this.plotTickMarks)
    {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = "#555555";
      ctx.moveTo(this.getPoint(0, domainMin, domainMax, PADDING, this.canvas.width) - 10, this.canvas.height - this.getPoint(y, rangeMin, rangeMax, PADDING, this.canvas.height));
      ctx.lineTo(this.getPoint(0, domainMin, domainMax, PADDING, this.canvas.width) + 10, this.canvas.height - this.getPoint(y, rangeMin, rangeMax, PADDING, this.canvas.height));
      ctx.stroke();
    }//end for

    // Y-axis tick marks where y <= 0
    for(var y = 0; y >= rangeMin; y -= this.plotTickMarks)
    {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = "#555555";
      ctx.moveTo(this.getPoint(0, domainMin, domainMax, PADDING, this.canvas.width) - 10, this.canvas.height - this.getPoint(y, rangeMin, rangeMax, PADDING, this.canvas.height));
      ctx.lineTo(this.getPoint(0, domainMin, domainMax, PADDING, this.canvas.width) + 10, this.canvas.height - this.getPoint(y, rangeMin, rangeMax, PADDING, this.canvas.height));
      ctx.stroke();
    }//end for
  }//end if
  
  // Plot each dataset
  for(var i = 0; i < this.xArray.length; i++)
  {
    var xData = this.xArray[i];
    var yData = this.yArray[i];

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.strokeStyle = this.colorArray[i];
    ctx.moveTo(this.getPoint(xData[0], domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(yData[0], rangeMin, rangeMax, PADDING, this.canvas.height));
    for(var j = 1; j < xData.length; j++)
    {
      ctx.lineTo(this.getPoint(xData[j], domainMin, domainMax, PADDING, this.canvas.width), this.canvas.height - this.getPoint(yData[j], rangeMin, rangeMax, PADDING, this.canvas.height));
      ctx.stroke();
    }//end for
  }//end for
};//end plot

Graph.prototype.getPoint = function(value, min, max, padding, graphSize)
{
  return (((value - min) / (max - min)) * (graphSize - (padding * 2))) + padding;
};//end getPoint

Graph.prototype.setXAxis = function(flag)
{
  this.plotXAxis = flag;
};//end setXAxis

Graph.prototype.setYAxis = function(flag)
{
  this.plotYAxis = flag;
};//end setYAxis

Graph.prototype.setTickMarks = function(inc)
{
  if(typeof inc !== 'undefined')
  {
    this.plotTickMarks = inc;
  }//end if
  else
  {
    this.plotTickMarks = -1;
  }//end else
};//end setTickMarks
