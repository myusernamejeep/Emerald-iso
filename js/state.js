
var timer;
var timerCurrent;
var timerFinish;
var timerSeconds;
var current_turn = 0;
$('.timer').css('font-size', '80px');

function drawTimer(percent){
  $('div.timer').html('<div class="percent"></div><div id="slice"'+(percent > 50?' class="gt50"':'')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
  var deg = 360/100*percent;
  $('#slice .pie').css({
    '-moz-transform':'rotate('+deg+'deg)',
    '-webkit-transform':'rotate('+deg+'deg)',
    '-o-transform':'rotate('+deg+'deg)',
    'transform':'rotate('+deg+'deg)'
  });
  $('.percent').html(Math.round(percent)+'%');
}
function stopWatch(){
  var seconds = (timerFinish-(new Date().getTime()))/1000;
  if(seconds <= 0){
    drawTimer(100);
    clearInterval(timer);
    //$('input[type=button]#watch').val('Start');
    //console.log('Finished counting down from '+timerSeconds);

    fsm.change_position();

  }else{
    var percent = 100-((seconds/timerSeconds)*100);
    drawTimer(percent);
  }
}

function startTimer(){
  timerSeconds = 3;
  timerCurrent = 0;
  timerFinish = new Date().getTime()+(timerSeconds*1000);
  timer = setInterval( stopWatch ,50);
}

function selectPosition(){
  can_seleted_target = true;
  //seleted_target = null;

  for(player in player_config){
      //console.log('player', player );
      var _list = getWalkableGrid(player);
      //var selected_grid_to_walk = 
      if (player_config[player].isBot){
        var selected_grid_to_walk = _list[ Math.random() *  _list.length ];
        player_config[player].next_walk = selected_grid_to_walk;
      }
      //console.log(player);
  }
}

function getWalkableGrid(player){
  var target = $('.'+player);
  var tmp = $('div[x="' + target.attr('x') + '"][y="' + target.attr('y') + '"][l="0"]');
  var g = {
    x:tmp.attr('x'),
    y:tmp.attr('y')
  }
  var walkable = getAreaRadiousExplosion(2, g);  
  console.log(walkable, target, target.attr('x'), target.attr('y') , g);
  return walkable; //walkable[ Math.random() *  walkable.length ];
}
function processEventItem(){
  log("processEventItem UP"); 
  current_turn = 0;
  change_player_item_turn();
}

function change_player_item_turn(){
  //var player_index_turn = (current_turn + 1) % player_config.length;
  if(current_turn > _.keys(player_config).length){
    fsm.end_turn();
    return ;
  }
  var current_turn = (current_turn) % _.keys(player_config).length;
  var player = 'p' + current_turn;
  console.log(player);
  var current_x = player_config[player].next_walk;

  var item_unit = $('div[x="' + current_x.x + '"][y="' + current_y.y + '"][l="1"]');
  var screenCoor = toScreen(current_x.x, current_y.y);
      
  //if(path_to_walk.length == 0){
    console.log('get' , item_unit , current_turn );
    if (item_unit.hasClass('coins')){
      // pick coins
      animPoint(screenCoor.x , screenCoor.y, item_unit.attr('value'), item_unit.attr('color'));  
    }else if (item_unit.hasClass('boxes')){
      // pick boxes
      animPoint(screenCoor.x , screenCoor.y, item_unit.attr('value'), item_unit.attr('color'));
    }
    if(item_unit)
      fadeHideUnit(item_unit);
  //}  
 
    current_turn++;
    setTimeout(function(){
      change_player_item_turn();
    }, 1000);
    
  
}

function processEndTurn(){
  log("processEndTurn UP"); 
  updateBlockClass();
}
function change_position(){
  log("change_position UP"); 
  current_turn = 0;
  change_player_position();
}

function change_player_position(){
  //
  if(current_turn > _.keys(player_config).length){
    fsm.event_item();
    return ;
  }
  var current_turn = (current_turn) % _.keys(player_config).length;
  var player = 'p' + current_turn;
  resetTrial();
  console.log(player);
  
  var walk_target = player_config[player].next_walk;
  var last_pos = $('.'+player);
  var graph = new Graph(nodes);
  var start = graph.nodes[player.attr('y')][player.attr('x')];
  var end = graph.nodes[walk_target.attr('y')][walk_target.attr('x')];
  path_to_walk = astar.search(graph.nodes, start, end);
  walkTrial();

}
/*
var GameState = function() {
*/
  var output = document.getElementById('output'), 
      demo   = document.getElementById('demo'),
      selected_position  = document.getElementById('selected_position'),
      event_item   = document.getElementById('event_item'),
      end_turn   = document.getElementById('end_turn'),
      restart_turn  = document.getElementById('restart_turn'), 
      count  = 0;

  var log = function(msg, separate) {
    count = count + (separate ? 1 : 0);
    output.value = count + ": " + msg + "\n" + (separate ? "\n" : "") + output.value;
    demo.className = fsm.current;
    selected_position.disabled = fsm.cannot('selected_position');
    event_item.disabled  = fsm.cannot('event_item');
    end_turn.disabled  = fsm.cannot('end_turn');
    restart_turn.disabled = fsm.cannot('restart_turn'); 
  };

  var fsm = StateMachine.create({
    initial: 'none',
    events: [
      { name: 'start', from: 'none',   to: 'timer_select_position'  },
      { name: 'selected_position',  from: 'timer_select_position',  to: 'end_timer_select_position' },
      { name: 'change_position',  from: 'end_timer_select_position',  to: 'goto_position' },
      { name: 'event_item', from: 'goto_position',  to: 'process_item'    },
      { name: 'end_turn', from: 'process_item', to: 'finish_turn'    },
      { name: 'restart_turn',  from: 'finish_turn',    to: 'timer_select_position' },
    ],

    callbacks: {
      onbeforestart: function(event, from, to) { 
        log("STARTING UP"); 
      },
      onstart:       function(event, from, to) { 
        log("READY");  
        setTimeout(function(){
          fsm.selected_position();  
        }, 1500);
           
      },
      
      onbeforeselected_position:  function(event, from, to) { 
        log("START   EVENT: selected_position!",  true);  
         startTimer();
         selectPosition();
      },  
      onbeforechange_position:  function(event, from, to) { 
        log("START   EVENT: change_position!",  true);  
        change_position(); 
      }, 
      onbeforeevent_item: function(event, from, to) { 
        log("START   EVENT: event_item!", true);  
        processEventItem();
      },
      onbeforeend_turn:  function(event, from, to) { 
        log("START   EVENT: end_turn!",  true);  
        processEndTurn();
      },
      onbeforerestart_turn: function(event, from, to) { 
        log("START   EVENT: restart_turn!", true);  
        //processEndTurn();
      },
      
      onselected_position:        function(event, from, to) { 
        log("FINISH  EVENT: selected_position!");         
        //  
      },

      onchange_position:        function(event, from, to) { 
        log("FINISH  EVENT: change_position!");         
        //  
      },
      onevent_item:       function(event, from, to) { 
        log("FINISH  EVENT: event_item!");        

        //fsm.end_turn();  
      },
      onend_turn:        function(event, from, to) { 
        log("FINISH  EVENT: end_turn!");         
        fsm.restart_turn();  
      },
      onrestart_turn:       function(event, from, to) { 
        log("FINISH  EVENT: restart_turn!");        
        fsm.selected_position();   
      },
      /*
      onleavegreen:  function(event, from, to) { log("LEAVE   STATE: green");  },
      onleaveyellow: function(event, from, to) { log("LEAVE   STATE: yellow"); },
      onleavered:    function(event, from, to) { log("LEAVE   STATE: red");    async(to); return false; },
      */
      ontimer_select_position:       function(event, from, to) { log("ENTER   STATE: timer_select_position");  },
      onend_timer_select_position:      function(event, from, to) { log("ENTER   STATE: end_timer_select_position"); },
      onprocess_item:         function(event, from, to) { log("ENTER   STATE: process_item");    },
      onfinish_turn:         function(event, from, to) { log("ENTER   STATE: finish_turn");    },
 
      onchangestate: function(event, from, to) { log("CHANGED STATE: " + from + " to " + to); }
    }
  });

  var async = function(to) {
    pending(to, 3);
    setTimeout(function() {
      pending(to, 2);
      setTimeout(function() {
        pending(to, 1);
        setTimeout(function() {
          fsm.transition(); // trigger deferred state transition
        }, 1000);
      }, 1000);
    }, 1000);
  };

  var pending = function(to, n) { log("PENDING STATE: " + to + " in ..." + n); };

/*  
  return fsm;

}();*/


