
var timer;
var timerCurrent;
var timerFinish;
var timerSeconds;
var current_turn = 0;
var current_player_position_turn = 0;
var current_player_item_turn = 0;

$('.timer').css('font-size', '80px');

// timer round count from 0 - 360 degree
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
 
    fsm.change_position();

  }else{
    var percent = 100-((seconds/timerSeconds)*100);
    drawTimer(percent);
  }
}

function startTimer(){
  current_turn = 0;
  current_player_position_turn = 0;
  current_player_item_turn = 0;

  timerSeconds = 3;
  timerCurrent = 0;
  console.log('startTimer', timerSeconds);
  timerFinish = new Date().getTime()+(timerSeconds*1000);
  timer = setInterval( stopWatch ,50);
}

function selectPosition(){
  can_seleted_target = true;
 
  for(player in player_config){
    var _list = getWalkableGrid(player);
    if (player_config[player].isBot){
      var selected_grid_to_walk = _list[(Math.random() * (_list.length-1)).toFixed(0)];
      player_config[player].next_walk = { x : selected_grid_to_walk[0], y : selected_grid_to_walk[1] };
      console.log('next_walk', player_config[player].next_walk , 'player', player); 
    }
  }
}

function getWalkableGrid(player){
  var target = $('.'+player);
  var tmp = $('div[x="' + target.attr('x') + '"][y="' + target.attr('y') + '"][l="0"]');
  var walk_grid = {
    x : tmp.attr('x'),
    y : tmp.attr('y')
  }
  var walkable = getAreaRadiousExplosion( player_config[player].walk_radious || 2, walk_grid);  
  //console.log('getWalkableGrid', walkable, target, target.attr('x'), target.attr('y') , g);

  return walkable; 
}

function processEventItem(){
  console.log("processEventItem UP"); 
  current_player_item_turn = 0;
  change_player_item_turn();
}

function change_player_item_turn(){
  console.log('state', fsm.current, 'current_player_item_turn', current_player_item_turn);
  // current_turn count from 0
  if(current_player_item_turn == _.keys(player_config).length ){
    fsm.end_turn();
    current_player_item_turn += 5;
    return false;
  }

  current_player_item_turn = (current_player_item_turn) % _.keys(player_config).length;
  var player = 'p' + (current_player_item_turn+1);
  console.log('change_player_item_turn', player);
  var current_pos = player_config[player].next_walk;

  var item_unit = $('div[x="' + current_pos.x + '"][y="' + current_pos.y + '"][l="1"]');
  var screenCoor = toScreen(current_pos.x, current_pos.y);
 
  console.log('get item_unit' , item_unit , 'current_player_item_turn', current_player_item_turn );
  if (item_unit.hasClass('coins')){
    // pick coins
    animPoint(screenCoor.x , screenCoor.y, item_unit.attr('value'), item_unit.attr('color'));  
  }else if (item_unit.hasClass('boxes')){
    // pick boxes
    animPoint(screenCoor.x , screenCoor.y, item_unit.attr('value'), item_unit.attr('color'));
  }
  if(item_unit)
    fadeHideUnit(item_unit);
 
  console.log('before setTimeout' );
  setTimeout(function(){
    current_player_item_turn++;
    console.log('setTimeout', current_player_item_turn);
    change_player_item_turn();
  }, 1000);
}

function processEndTurn(){
  console.log("processEndTurn UP"); 
  //updateBlockClass();
}

function change_position(){
  console.log("change_position UP"); 
  current_player_position_turn = 0;
  change_player_position();
}

function change_player_position(){
  // 2
  console.log('state', fsm.current, current_player_position_turn);
  
  if(current_player_position_turn == _.keys(player_config).length ){
    fsm.event_item();
    current_player_position_turn += 5;
    return false;
  }

  current_player_position_turn = (current_player_position_turn) % _.keys(player_config).length;
  var player_key = 'p' + (current_player_position_turn+1);
  resetTrial();
  console.log('change_player_position', player_key, current_player_position_turn);
  
  var walk_target = player_config[player_key].next_walk;
  var player = $('.'+player_key);
  // set current target player is (active player) seleted_target
  seleted_target = player;
  var graph = new Graph(nodes);
  var start = graph.nodes[player.attr('y')][player.attr('x')];
  var end = graph.nodes[walk_target.y][walk_target.x];
  path_to_walk = astar.search(graph.nodes, start, end);
  walkTrial();

}
 /*
var output = document.getElementById('output'), 
    demo   = document.getElementById('demo'),
    selected_position  = document.getElementById('selected_position'),
    event_item   = document.getElementById('event_item'),
    end_turn   = document.getElementById('end_turn'),
    */
    var count  = 0;

var log = function(msg, separate) {
  count = count + (separate ? 1 : 0);
  output.value = count + ": " + msg + "\n" + (separate ? "\n" : "") + output.value;
  /*demo.className = fsm.current;
  selected_position.disabled = fsm.cannot('selected_position');
  event_item.disabled  = fsm.cannot('event_item');
  end_turn.disabled  = fsm.cannot('end_turn');*/
 };

var fsm = StateMachine.create({
  initial: 'finish_turn',
  events: [
    { name: 'start', from: 'finish_turn',   to: 'timer_select_position'  },
    { name: 'selected_position',  from: 'timer_select_position',  to: 'end_timer_select_position' },
    { name: 'change_position',  from: 'end_timer_select_position',  to: 'goto_position' },
    { name: 'event_item', from: 'goto_position',  to: 'process_item'    },
    //{ name: 'to_end_turn',  from: 'goto_position',  to: 'finish_turn' },
    { name: 'end_turn', from: 'process_item', to: 'finish_turn'    },
   ],

  callbacks: {
    onbeforestart: function(event, from, to) { 
      log("STARTING UP"); 

      updateBlockClass();
    },
    onstart:       function(event, from, to) { 
      log("READY");  
      renderBlockClass();
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
      fsm.start();  
    } ,
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


