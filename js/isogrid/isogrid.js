var stats = new Stats();
document.getElementById('stats').appendChild( stats.domElement );

setInterval( function () {

    stats.update();

}, 1000 / 60 );

// Please note: dragging and dropping images only works for
// certain browsers when serving this script online:

var raster, group;
var count = 0;
var tiles = new Array();
var isDirty = true;
var isoSize = 80;
var piece = createPiece();
var lastTile;
var lastTileIsSelected = false;
var isDragging = false;

drawGrid();


function createPiece() {
    var group = new Group();
    var hexagon = new Path.RegularPolygon(view.center, 6, isoSize / 2);
    hexagon.fillColor = 'gray';
    group.addChild(hexagon);
    for (var i = 0; i < 2; i++) {
            var path = new Path();
            for (var j = 0; j < 3; j++) {
                var index = (i * 2 + j) % hexagon.segments.length;
                //console.log(index, hexagon.segments.length);
                path.add(hexagon.segments[index].clone());
            }
            path.add(hexagon.bounds.center);
            //console.log(path);
            path.closed = true;
            //	path.selected = true;
            group.addChild(path);
        }
        group.children[1].fillColor = 'white';
     	group.lastChild.fillColor = 'black';
		
		var color = '#FFFFFF';

		//group.children[1].fillColor = color;
		//group.children[0].fillColor = color;
		//group.children[0].fillColor.brightness *= .75;
		//group.children[2].fillColor = color;
		//group.children[2].fillColor.brightness *= .25;

    // Remove the group from the document, so it is not drawn:
    //group.remove();
    return group;
}



function onFrame( event )
{
	
	if (!isDirty) return;
	

	
	isDirty = false;
}

function drawGrid() 
{
	count = 0;
    var size = piece.bounds.size;
	var columns = Math.ceil(view.size.width / size.width) + 1;
	var rows = Math.ceil(view.size.height / size.height / .75) + 1;
	var columnWidth = Math.ceil(view.size.width / columns);
	var rowHeight = Math.ceil(view.size.height / rows);
	var instance;
	
    if (group)
        group.remove();

    group = new Group();
	tiles = new Array();
	return ;

	
	
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            
			instance = piece.clone();
			instance.name = "hex_" + count;
			instance.count = count;

			instance.position = size * [x + (y % 2 ? 0.5 : 0), y * 0.75];

            group.addChild(instance);

			count++;
			tiles.push(instance);
        }
    }

	
}

// Only execute onMouseDrag when the mouse
// has moved at least 10 points:
tool.distanceThreshold = 10;

function onMouseDown(event) {
	
	event.preventDefault();
	event.cancelBubble = true;
	if (event.stopPropagation) event.stopPropagation();
	
	var item = testPoint(event.point);
	isDragging = true;
	
	if (!item) return;
	
	// last tile is now updated - we should set the drawing state based on it's state
	lastTileIsSelected = item._isSelected;

}

function onMouseDrag(event) {
	
	testPoint( event.point );
	
	
}

function onMouseUp(event) {
	lastTileIsSelected = false;
	isDragging = false;
}

function testPoint(point) {
	
	var hitOptions = {
	    segments: false,
	    stroke: false,
	    fill: true,
	    tolerance: 1
	};
	
    var hitResult = project.hitTest(point, hitOptions);

	if (!hitResult || !hitResult.item || !hitResult.item.parent) return;

	var item = hitResult.item.parent;
	if (!item) return;
	
	
	// mouse has moved but not outside current tile.
	if (isDragging && lastTile && item == lastTile) return;
	
	/*
		TODO this inlined function should be prototyped
	*/
	function setState( item, state )
	{
		var color;
		
		if (!state)
		{
			color = new HSBColor(0, 0, 1);
			item.children[1].fillColor = color;
			item.children[0].fillColor = new HSBColor(0, 0, .75);
			item.children[2].fillColor = new HSBColor(0, 0, .25);
		} else {
			color = new HSBColor(item.count % 360, .5, 1);
			item.children[1].fillColor = color;
			item.children[0].fillColor = new HSBColor(item.count % 360, .5, .75);
			item.children[2].fillColor = new HSBColor(item.count % 360, .5, .25);
		}
		
		item._isSelected = state;
	}
	
	
	if (isDragging)
	{
		setState( item, lastTileIsSelected );
	} else {
		setState( item, !item._isSelected );
	}

	lastTile = item;
	
	return item;

}

function onResize() {
	isDirty = true;
    project.activeLayer.position = view.center;
}
document.getElementById('svg').appendChild( project.exportSVG());
var svg = project.exportSVG({asString: true});
var blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
saveAs(blob, 'image.svg');