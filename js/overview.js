function ov_mousedown(event, g, context) {
	context.initializeMouseDown(event, g, context);
	var bottom_left = g.toDomCoords(g.highlight_left, g.highlight_bottom);
	var top_right = g.toDomCoords(g.highlight_right, g.highlight_top);
	if (((context.dragStartX > bottom_left[0]) && (context.dragStartY < bottom_left[1])) && ((context.dragStartX < top_right[0]) && (context.dragStartY > top_right[1]))) {
		ov_startPan(event, g, context);
	}
	else {
		Dygraph.startZoom(event, g, context);
	}
}

function ov_mousemove(event, g, context) {
	if(context.isZooming){
		Dygraph.moveZoom(event, g, context);
	}
	else if (context.isPanning){
		ov_movePan(event, g, context);
	}
}

function ov_mouseup(event, g, context) {
	if(context.isZooming){Dygraph.endZoom(event, g, context)}
	else if (context.isPanning) {
		ov_endPan(event, g, context);
	}
}

function ov_mouseout(event, g, context) {
	if(context.isZooming){context.dragEndX=null;context.dragEndY=null}
}

// function ov_mouseover(event,g,context) {
	// var xRange = g.xAxisRange();
	// var yRange = g.yAxisRange(0);
	// var graph_x = context.px / g.width_ * (xRange[1]-xRange[0]) + xRange[0];
	// var graph_y = context.py / g.height_ * (yRange[1]-yRange[0]) + yRange[0];
	// if (((graph_y > g.highlight_bottom) && (graph_y < g.highlight_top)) && ((graph_x > g.highlight_left) && (graph_x < g.highlight_right))) {
		// this.document.body.style.cursor="move";
	// }
	// else {
		// this.document.body.style.cursor="crosshair";
	// }
// }

ov_startPan = function(event, g, context) {
  context.isPanning = true;
  var xRange = g.xAxisRange();
  var yRange = g.yAxisRange(0);
  context.dateRange = xRange[1] - xRange[0];
  context.valueRange = yRange[1] - yRange[0];

  // Record the range of each y-axis at the start of the drag.
  // If any axis has a valueRange or valueWindow, then we want a 2D pan.
  context.is2DPan = false;
  for (var i = 0; i < g.axes_.length; i++) {
    var axis = g.axes_[i];
    var yRange = g.yAxisRange(i);
    axis.dragValueRange = yRange[1] - yRange[0];
    var r = g.toDataCoords(null, context.dragStartY, i);
    axis.draggingValue = r[1];
    if (axis.valueWindow || axis.valueRange) context.is2DPan = true;
  }

  context.draggingDate = g.highlight_left;
  context.draggingValue = g.highlight_bottom;
};

ov_movePan = function(event, g, context) {
  context.dragEndX = g.dragGetX_(event, context);
  context.dragEndY = g.dragGetY_(event, context);
  highlight_width = g.highlight_right - g.highlight_left;
  highlight_height = g.highlight_top - g.highlight_bottom;

  g.highlight_left = context.draggingDate + ((context.dragEndX - context.dragStartX) / g.width_) * context.dateRange;
  g.highlight_right = g.highlight_left + highlight_width;
  g.highlight_bottom = context.draggingValue - ((context.dragEndY - context.dragStartY) / g.height_) * context.valueRange;
  g.highlight_top = g.highlight_bottom + highlight_height;

  g.zoomGraph.updateOptions({
	  dateWindow: [g.highlight_left, g.highlight_right],
	  valueRange: [g.highlight_bottom, g.highlight_top]});

  // // y-axis scaling is automatic unless this is a full 2D pan.
  // if (context.is2DPan) {
	// // Adjust each axis appropriately.
	// var y_frac = context.dragEndY / g.height_;
	// for (var i = 0; i < g.axes_.length; i++) {
	  // var axis = g.axes_[i];
	  // var maxValue = axis.draggingValue + y_frac * axis.dragValueRange;
	  // var minValue = maxValue - axis.dragValueRange;
	  // axis.valueWindow = [ minValue, maxValue ];
	// }
  // }

  g.drawGraph_();
}

ov_endPan = function(event, g, context) {
  context.isPanning = false;
  context.is2DPan = false;
  context.draggingDate = null;
  context.dateRange = null;
  context.valueRange = null;
}


function ov_dblclick(c,b,a) {
	b.doUnzoom_();
	gz.updateOptions({
		valueRange: go.full_yrange});
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
	me.highlight_left = 0;
	me.highlight_right = 0;
	me.highlight_bottom = 0;
	me.highlight_top = 0;
	}
}

function ov_zoom(minDate,maxDate,yRanges) {
	go.updateOptions({
	dateWindow: gz.full_xrange,
	valueRange: gz.full_yrange});
	gz.updateOptions({
	dateWindow: [minDate,maxDate]});
}

function zoom_mousedown(event,g,context) {
	context.initializeMouseDown(event, g, context);
	if (myXOR((event.altKey || event.shiftKey),drag_mode))  {
	this.document.body.style.cursor="move";
	Dygraph.startPan(event, g, context);
	}
	else {
	this.document.body.style.cursor="crosshair";
	Dygraph.startZoom(event, g, context);
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

function zoom_dblclick(c,b,a) {
	b.doUnzoom_();
	b.updateOptions({
		valueRange: go.full_yrange});
}

function zoom_mouseover(event,g,context) {
	if (drag_mode) {
		this.document.body.style.cursor="move";}
	else{
		this.document.body.style.cursor="crosshair";}
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
		me.last_requested_range = me.xAxisRange();
		me.last_range_width = me.last_requested_range[1] - me.last_requested_range[0];
	}
	go.updateOptions({dateWindow: go.xAxisRange()});
	var new_range = xrange[1]-xrange[0];
	if (((xrange[0] < (me.last_requested_range[0] - me.last_range_width)) || (xrange[1] > (me.last_requested_range[1]+me.last_range_width))) || (new_range < me.last_range_width / 4) )
	{
		me.last_requested_range = me.xAxisRange();
		me.last_range_width = me.last_requested_range[1]-me.last_requested_range[0];
	}
}

function zoom_zoom(minDate,maxDate,yRanges) {
	if (yRanges.length == undefined) {
		gz.updateOptions({
		valueRange: gz.last_y_range});}
	else {gz.last_y_range = gz.yAxisRange();}
}
	

function movePan(event, g, context) {
	context.dragEndX = g.dragGetX_(event, context);
	context.dragEndY = g.dragGetY_(event, context);

	var minDate = context.draggingDate - (context.dragEndX / g.width_) * context.dateRange;
	var maxDate = minDate + context.dateRange;
	g.dateWindow_ = [minDate, maxDate];
	go.highlight_left = minDate;
	go.highlight_right = maxDate;

	// y-axis scaling is automatic unless this is a full 2D pan.
	if (context.is2DPan) {
		// Adjust each axis appropriately.
		var y_frac = context.dragEndY / g.height_;
		for (var i = 0; i < g.axes_.length; i++) {
			var axis = g.axes_[i];
			var maxValue = axis.draggingValue + y_frac * axis.dragValueRange;
			var minValue = maxValue - axis.dragValueRange;
			axis.valueWindow = [ minValue, maxValue ];
			go.highlight_bottom = minValue;
			go.highlight_top = maxValue;
		}
	}
	g.drawGraph_();
}

function restore_view() {
	go.doUnzoom_();
	gz.updateOptions({
		valueRange: go.full_yrange});
}

function myXOR(a,b) {
	return ( a || b ) && !( a && b );
}
