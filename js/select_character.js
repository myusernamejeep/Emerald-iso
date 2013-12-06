// -------------------------------------------------------------
//   Force Centered Navigation
// -------------------------------------------------------------
(function () {

	var htmls = "";
    for (var x = 0; x < nemesis.length; ++x) {
      var color = nemesis[x];
      var html = '<li class="'+ color +' nemesis_character" ></li>';
      htmls += html;
    }
    var $items_grid = $('#forcecentered ul');
    $items_grid.empty();  
    $items_grid.append(htmls);    

	var $frame = $('#forcecentered');
	var $wrap  = $frame.parent();


	// Call Sly on frame
	$frame.sly({
		horizontal: 1,
		itemNav: 'forceCentered',
		smart: 1,
		activateMiddle: 1,
		activateOn: 'click',
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 1,
		startAt: 2,
		scrollBar: $wrap.find('.scrollbar'),
		scrollBy: 1,
		speed: 300,
		elasticBounds: 1,
		easing: 'easeOutExpo',
		dragHandle: 1,
		dynamicHandle: 1,
		clickBar: 1,

		// Cycling
		//cycleBy: 'items',
		cycleInterval: 3000,
		pauseOnHover: 1,


		// Buttons
		prev: $wrap.find('.prev'),
		next: $wrap.find('.next')
	});

	$('.nemesis_character').sprite({fps: 8, no_of_frames: 8});

}());