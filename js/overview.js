function ov_mousedown(event, g, context) {
	context.initializeMouseDown(event, g, context);
	var bottom_left = g.toDomCoords(g.highlight_left, g.highlight_bottom);
	var top_right = g.toDomCoords(g.highlight_right, g.highlight_top);
	if ((((context.dragStartX > bottom_left[0]) && (context.dragStartY < bottom_left[1])) && ((context.dragStartX < top_right[0]) && (context.dragStartY > top_right[1]))) && !(event.altKey || event.shiftKey)) {
		ov_startPan(event, g, context);
	}
	else {
		ov_startZoom(event, g, context);
	}
}

function ov_mousemove(event, g, context) {
	if(context.isZooming){
		ov_moveZoom(event, g, context);
	}
	else if (context.isPanning){
		ov_movePan(event, g, context);
	}
}

function ov_mouseup(event, g, context) {
	if(context.isZooming){
		ov_endZoom(event, g, context)
	}
	else if (context.isPanning) {
		ov_endPan(event, g, context);
	}
}

function ov_mouseout(event, g, context) {
	context.dragEndX=null;
	context.dragEndY=null;
	// if(context.isZooming){context.dragEndX=null;context.dragEndY=null}
}

ov_startPan = function(event, g, context) {
  context.isPanning = true;
  var xRange = g.xAxisRange();
  var yRange = g.yAxisRange(0);
  context.dateRange = xRange[1] - xRange[0];
  context.valueRange = yRange[1] - yRange[0];

  context.draggingDate = g.highlight_left;
  context.draggingValue = g.highlight_bottom;
};

ov_movePan = function(event, g, context) {
  var highlight_width = g.highlight_right - g.highlight_left;
  var highlight_height = g.highlight_top - g.highlight_bottom;
  context.dragEndX = g.dragGetX_(event, context);
  context.dragEndY = g.dragGetY_(event, context);
  var end = g.toDataCoords(context.dragEndX, context.dragEndY, 0);
  var start =  g.toDataCoords(context.dragStartX, context.dragStartY, 0);
  g.highlight_left = context.draggingDate + end[0] - start[0];
  g.highlight_right = g.highlight_left + highlight_width;
  g.highlight_bottom = context.draggingValue + end[1] - start[1];
  g.highlight_top = g.highlight_bottom + highlight_height;

  g.zoomGraph.updateOptions({
	  dateWindow: [g.highlight_left, g.highlight_right],
	  valueRange: [g.highlight_bottom, g.highlight_top]});

  g.drawGraph_();
}

ov_endPan = function(event, g, context) {
  context.isPanning = false;
  context.draggingDate = null;
  context.dateRange = null;
  context.valueRange = null;
}

ov_startZoom = function(event, g, context) {
  context.isZooming = true;
}

ov_moveZoom = function(event, g, context) {
  context.dragEndX = g.dragGetX_(event, context);
  context.dragEndY = g.dragGetY_(event, context);

  var end = g.toDataCoords(context.dragEndX, context.dragEndY, 0);
  var start =  g.toDataCoords(context.dragStartX, context.dragStartY, 0);

  g.highlight_left = start[0];
  g.highlight_right = end[0];
  g.highlight_bottom = start[1];
  g.highlight_top = end[1];
  var bottom_left = g.toDomCoords(g.highlight_left, g.highlight_bottom);
  var top_right = g.toDomCoords(g.highlight_right, g.highlight_top);
  var ctx = g.canvas_.getContext("2d");
  ctx.fillStyle = "rgba(128,128,128,0.33)";
  ctx.clearRect(0, 0, g.width_, g.height_);
  ctx.fillRect(bottom_left[0],bottom_left[1],top_right[0]-bottom_left[0],top_right[1]-bottom_left[1]);

}

ov_endZoom = function(event, g, context) {
  context.isZooming = false;
  context.dragEndX = g.dragGetX_(event, context);
  context.dragEndY = g.dragGetY_(event, context);
  var end = g.toDataCoords(context.dragEndX, context.dragEndY, 0);
  var start =  g.toDataCoords(context.dragStartX, context.dragStartY, 0);

  g.highlight_left = start[0];
  g.highlight_right = end[0];
  g.highlight_bottom = start[1];
  g.highlight_top = end[1];
  if (g.highlight_top < g.highlight_bottom) {
	  var swap = g.highlight_bottom;
	  g.highlight_bottom = g.highlight_top;
	  g.highlight_top = swap;
  }
  if (g.highlight_right < g.highlight_left) {
	  var swap = g.highlight_left;
	  g.highlight_left = g.highlight_right;
	  g.highlight_right = swap;
  }
  g.zoomGraph.updateOptions({
	  dateWindow: [g.highlight_left, g.highlight_right],
	  valueRange: [g.highlight_bottom, g.highlight_top]});

  context.dragStartX = null;
  context.dragStartY = null;
}

function ov_dblclick(event, g, context) {
	g.zoomGraph.doUnzoom_();
	g.zoomGraph.updateOptions({
		valueRange: g.full_yrange});
}

function ov_underlay(canvas, area, g) {
	var bottom_left = g.toDomCoords(g.highlight_left, g.highlight_bottom);
	var top_right = g.toDomCoords(g.highlight_right, g.highlight_top);
	canvas.fillStyle = "rgba(255,255,102,1.0)";
	canvas.fillRect(bottom_left[0],bottom_left[1],top_right[0]-bottom_left[0],top_right[1]-bottom_left[1]);
}

function ov_draw(me,initial) {
	if (initial){
	me.full_xrange = me.xAxisRange();
	me.full_yrange = me.yAxisRange();
	}
}

function zoom_mousedown(event,g,context) {
	context.initializeMouseDown(event, g, context);
	if (event.altKey || event.shiftKey)  {
	Dygraph.startZoom(event, g, context);
	}
	else {
	Dygraph.startPan(event, g, context);
	}
}

function zoom_mousemove(event,g,context) {
	if (context.isPanning) {
	Dygraph.movePan(event, g, context);
	} else if (context.isZooming) {
	Dygraph.moveZoom(event, g, context);
	}
}

function zoom_mouseup(event,g,context) {
	if (context.isPanning) {
			Dygraph.endPan(event, g, context);
		} else if (context.isZooming) {
			Dygraph.endZoom(event, g, context);
		}
}

function zoom_dblclick(event, g, context) {
	g.doUnzoom_();
	g.updateOptions({
		valueRange: g.overview.full_yrange});
}

function zoom_mouseout(event,g,context) {
	this.document.body.style.cursor="auto";
	if(context.isZooming){context.dragEndX=null;context.dragEndY=null}
}

function zoom_draw(me,initial) {
	var xrange = me.xAxisRange();
	var yrange = me.yAxisRange();
	go.highlight_left = xrange[0];
	go.highlight_right = xrange[1];
	go.highlight_bottom = yrange[0];
	go.highlight_top = yrange[1];
	if (initial) {
		me.last_y_range = yrange;
	}
	go.updateOptions({dateWindow: go.xAxisRange()});
}

function zoom_zoom(minDate,maxDate,yRanges) {
	if (yRanges.length == undefined) {
		gz.updateOptions({
		valueRange: gz.last_y_range});}
	else {gz.last_y_range = gz.yAxisRange();}
}
