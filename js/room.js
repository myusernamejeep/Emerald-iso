jQuery(function($){
	'use strict';
 
	var htmls = "";
    for (var x = 0; x < 4; ++x) {
      //var r = rooms[x]; 
      var no = x + 1;
      var player_img = 'http://lorempixel.com/150/150/people/'; 
      var player_name = "player_name";
      var player_desc = "player_desc";
      var html = '<li ><img src="'+ player_img+ '?r='+ Math.random() + '">'+
						'<figcaption>'+
							'<h4>#'+ no +' '+ player_name +' </h4>'+
							'<p>'+ player_desc +'</p>'+
						'</figcaption>'+
					'</li>';
 
      htmls += html;
    }
    var $items_grid = $('.frame ul');
    $items_grid.empty();  
    $items_grid.append(htmls);    
	// -------------------------------------------------------------
	//   Non Item Based Navigation
	// -------------------------------------------------------------
	(function () {
		var $frame = $('#nonitembased');
		var $wrap  = $frame.parent();

		// Call Sly on frame
		$frame.sly({
			speed: 300,
			easing: 'easeOutExpo',
			pagesBar: $wrap.find('.pages'),
			activatePageOn: 'click',
			scrollBar: $wrap.find('.scrollbar'),
			scrollBy: 100,
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,

			// Buttons
			forward: $wrap.find('.forward'),
			backward: $wrap.find('.backward'),
			prevPage: $wrap.find('.prevPage'),
			nextPage: $wrap.find('.nextPage')
		});
 
	}());

	// -------------------------------------------------------------
	//   Smart Navigation
	// -------------------------------------------------------------
	(function () {
		var $frame  = $('#smart');
		var $slidee = $frame.children('ul').eq(0);
		var $wrap   = $frame.parent();

		// Call Sly on frame
		$frame.sly({
			itemNav: 'basic',
			smart: 1,
			activateOn: 'click',
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: 1,
			startAt: 3,
			scrollBar: $wrap.find('.scrollbar'),
			scrollBy: 1,
			pagesBar: $wrap.find('.pages'),
			activatePageOn: 'click',
			speed: 300,
			elasticBounds: 1,
			easing: 'easeOutExpo',
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,

			// Buttons
			forward: $wrap.find('.forward'),
			backward: $wrap.find('.backward'),
			prev: $wrap.find('.prev'),
			next: $wrap.find('.next'),
			prevPage: $wrap.find('.prevPage'),
			nextPage: $wrap.find('.nextPage')
		});
 		/*
		// Add item
		$wrap.find('.add').on('click', function () {
			$frame.sly('add', '<li>' + $slidee.children().length + '</li>');
		});

		// Remove item
		$wrap.find('.remove').on('click', function () {
			$frame.sly('remove', -1);
		});*/
	}());
});