GameState = function() {

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
      { name: 'event_item', from: 'end_timer_select_position',  to: 'process_item'    },
      { name: 'end_turn', from: 'process_item', to: 'finish_turn'    },
      { name: 'restart_turn',  from: 'finish_turn',    to: 'timer_select_position' },
    ],

    callbacks: {
      onbeforestart: function(event, from, to) { log("STARTING UP"); },
      onstart:       function(event, from, to) { 
        log("READY");  

        GameState.selected_position();     
      },
      
      onbeforeselected_position:  function(event, from, to) { 
        log("START   EVENT: selected_position!",  true);  
         startTimer();
         selectPosition();
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
        GameState.event_item();  
      },
      onevent_item:       function(event, from, to) { 
        log("FINISH  EVENT: event_item!");        

        GameState.end_turn();  
      },
      onend_turn:        function(event, from, to) { 
        log("FINISH  EVENT: end_turn!");         
        GameState.restart_turn();  
      },
      onrestart_turn:       function(event, from, to) { 
        log("FINISH  EVENT: restart_turn!");        
        GameState.selected_position();   
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

  fsm.start();
  return fsm;

}();


