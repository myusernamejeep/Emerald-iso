
  
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
              console.log( x,y , nodes[y][x]);
              target_explosion.push([x,y]);
            }
          }
        //}
      }
    }
    console.log( target_explosion );

    return target_explosion;
  }