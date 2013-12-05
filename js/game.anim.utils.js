  
  function renderMenuItemsInfo(){
    var htmls = "";
    for (var x = 0; x < items_database.length; ++x) {
      var item = items_database[x];

      var html = '<li class="flex-item" id="item_'+ item.image +'" color="'+ item.color +'"  >'+
            '<div class="item_pic" >'+
              '<img src="images/icons/"'+ item.image +'.png" />'+
            '</div>'+
            '<div class="info">'+
              '<h4>'+ item.name +'</h4>'+
              '<p class="item_desc">'+ item.desciption +'</p>'+
            '</div>'+
          '</li>';
      htmls += html;
    }
    var $items_grid = $('#items_grid');
    $items_grid.empty();  
    $items_grid.append(htmls);    
    var $frame = $('#frame');
    //$frame.append('<ul class="pages" ></ul>'); 
    var $slidee = $frame.children('ul').eq(0);
    var $wrap = $frame.parent();

    $frame.sly({
            //horizontal: 1,
            itemNav: 'basic',
            smart: 1,
            activateOn: 'click',
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            startAt: 3,
            scrollBar: $('.scrollbar'),
            //scrollBy: 1,
            //pagesBar: $wrap.find('.pages'),
            activatePageOn: 'click',
            speed: 300,
            elasticBounds: 1,
            easing: 'easeOutExpo',
            dragHandle: 1,
            dynamicHandle: 1,
            clickBar: 1,
       
            scrollBy: 200,
  
            // Buttons
            forward: $wrap.find('.forward'),
            backward: $wrap.find('.backward'),
            prev: $wrap.find('.prev'),
            next: $wrap.find('.next'),
            prevPage: $wrap.find('.prevPage'),
            nextPage: $wrap.find('.nextPage')
        });

    // Reload on resize
    $(window).on('resize', function() {
        $frame.reload();
    });
    var $wrap = $('.wrap');
    $wrap.show();
  }

  function updateBlockClass(){
    grid_data.splice(0,1);
    var new_arr = [];
    for (var y = 0; y < api['height']; ++y) {
      new_arr.push(blocks[(Math.random() * (blocks.length - 1)).toFixed(0)]);
    }
    grid_data.push(new_arr);

    console.log( 'updateBlockClass' , grid_data[0] );
  }

  function renderBlockClass(){
    for (var x = 0; x < api['width']; ++x) {
      for (var y = 0; y < api['height']; ++y) {
        var class_of_block = grid_data[x][y];
        var tmp_grid = $('div[x="' + x + '"][y="' + y + '"][l="0"]');
 
        if ((x == 0 && y == 0)||(x == api['width']-1 && y == api['height']-1)) {
          continue;
        } 
        tmp_grid.removeClass( tmp_grid.attr('class') );
        tmp_grid.addClass(  'gid'+tmp_grid.attr('gid') );
        tmp_grid.addClass(  'kiwi' );
        var data_items = tmp_grid.data(  'item' );
        tmp_grid.css('background', "url(images/icons/"+ data_items.image  +".svg) , url(images/"+ data_items.color  +".png) ");
        tmp_grid.css('background-repeat',"no-repeat, no-repeat ");
        tmp_grid.css('background-position',"50% 50%, 50% 10%");
        tmp_grid.css('background-size',"30% ,auto ");
     
         //tmp_grid.addClass( class_of_block );
        console.log( 'gid', tmp_grid.attr('gid') , 'class_of_block', class_of_block , x , y );
 
      }
    }  
  }

  function toScreen(x, y) {
    var X = x * api['hTW'] - y * api['hTH'] + api['xoffset'];
    var Y = x * api['qTW'] + y * api['qTH'] + api['yoffset'];
    return {x:X, y:Y};
  }

  function fromScreen(x, y) {
    var X = x - api['xoffset'];
    var Y = y - api['yoffset'];
    var XT = Math.floor( (X/api['hTH'] + Y/api['qTH']) /
      (api['hTW']/api['hTH'] + api['qTW']/api['qTH']) ) - 1;
    var YT = Math.floor( (Y/api['qTW'] - X/api['hTW']) /
      (api['qTH']/api['qTW'] + api['hTH']/api['hTW']) );
    return {x:XT, y:YT};
  }

  function resetTrial(){
    path_to_walk = [];
  }

  function walkTrial(){
    console.log('path_to_walk', path_to_walk);
  
    if(path_to_walk.length <= 0){
      return false;
    }
    var walk_grid = _.first(path_to_walk);
    path_to_walk = _.rest(path_to_walk);
    var current_y = walk_grid.x;
    var current_x = walk_grid.y;

    //var e = $('div[x="' + current_x + '"][y="' + current_y + '"][l="0"]');
    var state, xv, yv;
    var diffX = current_x - seleted_target.attr('x');// <= 0 ?  -1:1;  // 1 , 0 leftt  // 0 , 1 up
    var diffY = current_y - seleted_target.attr('y');// <= 0 ?  -1:1;
    //console.log( 'diffX', diffX , 'diffY', diffY );
    if(diffX == 0){
      diffX = seleted_target.attr('xv');
    }
    if(diffY == 0){
      diffY = seleted_target.attr('yv');
    }

    if (diffX == -1 && diffY == 1) { // up
      xv = -1;
      yv = 1;
      state = 2;
    } else if (diffX == -1 && diffY == -1) { // left 
      xv = -1;
      yv = -1;
      state = 3;
    } else if (diffX == 1 && diffY == -1) { // down
      xv = 1;
      yv = -1;
      state = 4;
    } else if (diffX == 1 && diffY == 1) { // right
      xv = 1;
      yv = 1;
      state = 1;
    }
    //console.log( 'path_to_walk', path_to_walk, 'state', state, ' xv, yv',  xv, yv, 'walk_grid', walk_grid, 'seleted_target', seleted_target);
    //console.log( 'e', walk_grid , seleted_target.attr('x'),seleted_target.attr('y'),current_x,current_y, "dif x ", seleted_target.attr('x') - current_x , "dif y",seleted_target.attr('y') - current_y );
    var e = $('div[x="' + current_x + '"][y="' + current_y + '"][l="0"]');
    var gid = e.attr('gid');
    var dims = api['gids'][gid];
    var p = toScreen(walk_grid.y, walk_grid.x);
    var X = p.x;
    var Y = p.y - (dims['height'] - api['tH']) - 15;// + dims['yoffset'];
    //console.log( X, Y , p);
    seleted_target.attr('x', current_x ).attr('y', current_y)
    .attr('xv',xv ).attr('yv',yv).spState(state)
    //.animate({top:'+=' + xv * 32 + 'px',left:'+=' + 64 * yv + 'px'}, api['robotSpeed'], 'linear', walkTrial);
    .animate({top:Y  + 'px',left:X + 'px'}, api['robotSpeed'], 'linear', function(){
      // check is stop
      walkTrial();
      var item_unit = $('div[x="' + current_x + '"][y="' + current_y + '"][l="1"]');
      var screenCoor = toScreen(current_x, current_y);
      console.log('item_unit', item_unit);
            
      if(path_to_walk.length == 0){
        /*if (item_unit.hasClass('items')){
          // pick items
        }else */if (item_unit.hasClass('coins')){
          // pick coins
          animPoint(screenCoor.x , screenCoor.y, item_unit.attr('value'), item_unit.attr('color'));  
        }else if (item_unit.hasClass('boxes')){
          // pick boxes
          animPoint(screenCoor.x , screenCoor.y, item_unit.attr('value'), item_unit.attr('color'));
        }
        if(item_unit)
          fadeHideUnit(item_unit);
        
        console.log('path_to_walk.length == 0' );
        current_player_position_turn++;
        change_player_position();
      }
    });
     
  }

  function fadeHideUnit(item_unit){
    item_unit.filter('.items').delay(300).animate({opacity:0}, 500, 'linear', function(){
        $(this).remove();
    });
  }
  
  function animationPlane(cb){
    $('#plane1').show().sprite({fps: 12, no_of_frames: 2}).spRandom({
        top: 5,
        left:$(window).width() ,
        speed: 1500
    }).animate({left:'+=1000px'}, 1500, 'linear', function(){
      $('#plane1').hide().css('left','0px');
      $('#plane1').destroy();
      if (cb != undefined){
        cb();
      }
    });
  }

  function dropBombAnimation(gid, x, y, el) {
      var missile_width = 31;
      var missile_height = 128;
      var X = x + 128/2 - missile_width/4; 
      var Y = - 64; 
      var toY = y - missile_height/2;
      //console.log( 'toY ', toY );
      var canvas_ex = $('<div class="missile" width="30" height="128" style="top:' + Y + 'px; left:' + X + 'px;"  ></div>');
      $('body').append(canvas_ex);
      canvas_ex.css({ 
        'position' : 'absolute',
        'z-index' : 50,
        'opacity' : 1,
        'backgroundPosition' : '0 0  !important;',
        'backgroundRepeat' : 'no-repeat'
      }).sprite({fps: 17, no_of_frames: 17})
      .animate({top:toY +'px'}, 1500, 'linear', function(){
        if(canvas_ex){
          canvas_ex.destroy();
          canvas_ex.remove();
        }
        if (el){
          animExplode(el);
        }


        setTimeout(function(){
          var explode = $('.explode')
          if(explode){
            explode.destroy();
            explode.remove();
          }
        }, 1000);
      });
      return canvas_ex;
  }
   
  function laserRayAnimation(gid, x, y , color) {
         
      var X = x - 300/4;//+ 74/4; 
      var Y = - 64; 
      var toY = y ;
      //console.log( 'toY ', toY );
      var color_class = color == 'red' ? '.redLaserRay': '.greenLaserRay';
      var canvas_ex = $(color_class).clone();
      $('body').append(canvas_ex);
      canvas_ex.css({ 
        'position' : 'absolute',
        'z-index' : 50,
        'opacity' : 1,
        'display' : 'block',
        left : X + 'px', 
        top : Y + 'px'  
      }).animate({top:toY +'px'}, 1000, 'linear', function(){
        $(this).effect("pulsate", { times:3 }, 1000);
      }).delay(1000).animate({opacity:0}, 1000, 'linear', function(){
        if(canvas_ex){
          canvas_ex.delay(1000).remove();
        }
      });
 
      
      return canvas_ex;
  }

  function animPoint(x, y, value, color){
    var x = x + 128/2;
    var toY = y ;
    var _p = $(".points").clone();
    $('body').append(_p);
    _p.css({  
      'display' : 'block',
      left : x + 'px', 
      top : y + 'px'  
    });
    if (value)
      _p.html(value);
    if (color){
      _p.addClass(color);
    }
    var path = {
      start: {
        x: x,
        y: y,
        angle: 270 ,
        length: 1.000
      },
      end: {
        x: x + randomInt(),
        y: y + randomInt(),
        angle: 61,
        length: 0.84
      }
    };

    _p.animate(
      {
        path : new $.path.bezier(path) 
      }, 
      1000
    ).animate({opacity:0}, 1000, 'linear', function(){
       $(this).delay(1000).remove();
    });

    return _p;
  }

  function randomInt(){
    var dir = Math.random() * 10 > 5 ? 1 : -1;
    var rand_number = (Math.random() * 30) ;

    return rand_number;
  }

  function dropItemAnimation(gid, x, y) {
 
      var X = x + 90/4; 
      var Y = - 64; 
      var toY = y;
      //console.log( 'toY ', toY );
      var canvas_ex = $('<div class="drop" width="90" height="90" style="top:' + Y + 'px; left:' + X + 'px;"  ></div>');
      $('body').append(canvas_ex);
      canvas_ex.css({ 
        'position' : 'absolute',
        'z-index' : 50,
        'opacity' : 1,
        'backgroundPosition' : '0 0  !important;',
        'backgroundRepeat' : 'no-repeat'
      }).animate({top:toY +'px'}, 1500, 'linear', function(){
        if(canvas_ex){
          canvas_ex.remove();
        }
      });
      return canvas_ex;
  }

  function animExplode(canvas_ex) {
      canvas_ex.show().sprite({
        fps: 8, 
        no_of_frames: 16, 
        on_first_frame: function(obj) {
        }, 
        on_last_frame: function(obj) {
        },
        on_frame: { // note - on_frame is an object not a function
            4: function(obj) { // called on frame 8
                obj.spState(2); // change to state 2 (row 2) on frame 8
            },
            8: function(obj) { // called on frame 16
                obj.spState(3); // change to state 3 (row 3) on frame 16
            },
            12: function(obj) { // called on frame 16
                obj.spState(4); // change to state 3 (row 3) on frame 16
            }
        }
      });
  } 

  function getStraitLineExplosion(radious, p){
    var target_explosion = [];
    for(var y=0;y<nodes.length ;y++) {
      var node_x = nodes[y];
      for(var x=0;x<node_x.length ;x++) {
        if((Math.abs(p.x-x)>=0 && Math.abs(p.x-x)<=radious) && (Math.abs(p.y-y)>=0 && Math.abs(p.y-y)<=radious)){
          if( p.x == x || p.y == y ){
            if(nodes[y][x] == 1){
              //console.log( x,y , nodes[y][x]);
              target_explosion.push([x,y]);
            }
          }
        }
      }
    }
    //console.log( target_explosion );

    return target_explosion;
  }

  function getAreaRadiousExplosion(radious, p){
    var target_explosion = [];
    for(var y=0;y<nodes.length ;y++) {
      var node_x = nodes[y];
      for(var x=0;x<node_x.length ;x++) {
        //if((x-radious>=0 && x+radious<=nodes.length) && (y-radious>=0 && y+radious<=node_x.length)){
          if((Math.abs(p.x-x)>=0 && Math.abs(p.x-x)<=radious) && (Math.abs(p.y-y)>=0 && Math.abs(p.y-y)<=radious)){
            if(nodes[y][x] == 1){
              //console.log( x,y , nodes[y][x]);
              target_explosion.push([x,y]);
            }
          }
        //}
      }
    }
    console.log( target_explosion, p.x, p.y );

    return target_explosion;
  }