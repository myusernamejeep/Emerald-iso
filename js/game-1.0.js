/* (C)2012 Adam Latchem All Rights Reserved.
 *
 * If you are interested in using this code please contact me:
 * . adam@intrepiduniverse.com
 */

// TODO make private again
var api = {};

(function(jQuery) {

  "use strict";

  $ = jQuery;

  var NEMESIS_GID = 7;
  var TELEPORT_GID = 6;
  var CAPTION_LENGTH = 5000;

  // Level properties:
  // . robotCount
  // . robotScoreTrigger
  // . robotSpeed
  // . startX
  // . startY
  // . teleportTarget
  //
  // Tileset properties
  // . yoffset
  function loadLevel(url, target)
  {
    $.getJSON(url, function(level) {
      var props = level['properties'];

      api['level'] = level;
      api['numTeleported'] = 0;
      api['xoffset'] = $('#screen').innerWidth() / 2;
      api['yoffset'] = 4;
      api['objectCount'] = 0;
      api['robotScore'] = 0;
      api['score'] = 0;
      api['activeRobots'] = 0;

      api['layers'] = level['layers'];
      api['width'] = level['width'];
      api['height'] = level['height'];
      api['tW'] = level['tilewidth'];
      api['tH'] = level['tileheight'] * 2;
      api['hTW'] = api['tW'] / 2;
      api['hTH'] = api['tH'] / 2;
      api['qTW'] = api['tW'] / 4;
      api['qTH'] = api['tH'] / 4;

      api['robotCount'] = parseInt(props['robotCount']);
      api['robotSpeed'] = parseInt(props['robotSpeed']);
      api['teleportTarget'] = parseInt(props['teleportTarget']);
      api['startX'] = parseInt(props['startX']);
      api['startY'] = parseInt(props['startY']);
      api['robotScoreTrigger'] = parseInt(props['robotScoreTrigger']);

      // Create css class for each tile in the map - help in #style
      $('#style').empty();
      var gid = 0;
      api['gids'] = {};
      var stylesheet = "";
      for (var tset = 0; tset < level['tilesets'].length; ++tset) {
        var tileset = level['tilesets'][tset];
        gid = tileset['firstgid'];
        var imageWidth = tileset['imagewidth'];
        var imageHeight = tileset['imageheight'];
        var tileWidth = tileset['tilewidth'];
        var tileHeight = tileset['tileheight'];
        var x = 0;
        var y = 0;
        var yoffset = 0;
        if (typeof tileset['properties']['yoffset'] != 'undefined') {
          yoffset = parseInt(tileset['properties']['yoffset']);
        }
        while (true) {
          api['gids'][gid] = {'width':tileWidth, 'height':tileHeight,
            'top':y, 'left':x, 'yoffset':yoffset};
          stylesheet += (' .gid' + gid +
            " { background-image: url('" + tileset['image'] +
            "'); width: " + tileWidth +
            "px; height: " + tileHeight +
            "px; background-position: " + (-x) + "px " + (-y) +
            "px; background-repeat: no-repeat; position: absolute; }");
          gid++;
          x += tileWidth;
          if (x >= imageWidth) {
            x = 0;
            y += tileHeight;
          }
          if (y >= imageHeight) {
            break;
          } 
        }
      }
      $('#style').remove();
      $('<style id="style">' + stylesheet + '</style>').appendTo('head');
  
      // Create div element for each map entity
      for (var layer = 0; layer < api['layers'].length; ++layer) {
        var data = api['layers'][layer].data;
        for (var x = 0; x < api['width']; ++x) {
          for (var y = 0; y < api['height']; ++y) {
            var gid = data[y * api['width'] + x];
            addObject(target, layer, x, y, gid);
          }
        }
      }

      // sync GUI
      $('#robotCount').text(api['robotCount']);
      $('#score').text(api['score']);
    });
  }

  // Object attrs
  // . l N layer N
  // . x N x coord N
  // . y N y coord N
  // . xv N xv N
  // . yv N yv N
  // . s N sprite state N
  //
  // Object classes
  // . gidN tileset gid N
  function addObject(target, layer, x, y, gid) {
    // TODO somekind of z ordering sort is required.
    if (0 != gid) {
      var dims = api['gids'][gid];
      var p = toScreen(x, y);
      var X = p.x;
      var Y = p.y - (dims['height'] - api['tH']) + dims['yoffset'];
      var id = 'l' + layer + 'x' + x + 'y' + y + 'o' + api['objectCount'];
      api['objectCount']++;
      target.append("<div id='" + id + "' class='gid" + gid +
        "' style='top:" + Y + "px; left:" + X + "px;'></div>");
      $('#' + id).attr('x', x).attr('y', y).attr('l', layer).attr('s', 1);
      if (NEMESIS_GID == gid) {
	$('#' + id).attr('xv','1').attr('yv','1').sprite(
          {fps: 6, no_of_frames: 6}).animate({top:'+=16px',left:'+=32px'},
          api['robotSpeed'], 'linear', walk1);
      }
      return $('#' + id);
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

  // Handle mouse clicks on game area
  $('#screen').mousedown(function(e) {
    var p = fromScreen(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    var s = $('div[x="' + p.x + '"][y="' + p.y + '"][l="0"]');
    if (s.hasClass('gid2')) {
      s.removeClass('gid2');
      s.addClass('gid3');
    } else if (s.hasClass('gid3')) {
      s.removeClass('gid3');
      s.addClass('gid4');
    } else if (s.hasClass('gid4')) {
      s.removeClass('gid4');
      s.addClass('gid5');
    } else if (s.hasClass('gid5')) {
      s.removeClass('gid5');
      s.addClass('gid2');
    }
  });

  // called when robot at edge of new square
  function walk1() {
    var xv = parseInt($(this).attr('xv'));
    var yv = parseInt($(this).attr('yv'));
    var p = fromScreen(
      this.offsetLeft + 64 + yv * 32,
      this.offsetTop + 100 + xv * 16);
    var b = $('div[x="' + p.x + '"][y="' + p.y + '"][l="0"]');

    // Fall off edge of blocks
    if (0 == b.length) {
      soundManager.play('bing');
      removeRobot($(this));
      return;
    }

    // another robot
    var r = $('div[x="' + p.x + '"][y="' + p.y + '"][l="1"]');
    if (r.length > 0) {
      soundManager.play('crash');
      removeRobot($(this));
      return;
    } else {

      // update location in class attributes
      $(this).attr('x', p.x).attr('y', p.y);
    }

    $(this).animate({top:'+=' + xv * 16 + 'px', left:'+=' + yv * 32 + 'px'},
      api['robotSpeed'], 'linear', walk2);
  }

  // called when robot at center of square
  function walk2() {
    // Calculate where the character is on the isometric grid
    var p = fromScreen(this.offsetLeft + 64, this.offsetTop + 100);
    var e = $('div[x="' + p.x + '"][y="' + p.y + '"][l="0"]');

    // make any dynamic adjustments due to grid location
    var xv = parseInt($(this).attr('xv'));
    var yv = parseInt($(this).attr('yv'));

    // change of direction
    var state = $(this).attr('s');
    if (e.hasClass('gid2')) {
      xv = -1;
      yv = 1;
      state = 2;
    } else if (e.hasClass('gid3')) {
      xv = -1;
      yv = -1;
      state = 3;
    } else if (e.hasClass('gid4')) {
      xv = 1;
      yv = -1;
      state = 4;
    } else if (e.hasClass('gid5')) {
      xv = 1;
      yv = 1;
      state = 1;

    // teleporter
    } else if (e.hasClass('gid' + TELEPORT_GID)) {
      soundManager.play('teleport');
      api['score'] += 100;
      $('#score').text(api['score']);
      api['numTeleported'] += 1;
      removeRobot($(this));
      spinDirection();
      return;
    }

    // update score
    api['score'] += 5;
    $('#score').text(api['score']);
    if (api['score'] > api['robotScore'] + api['robotScoreTrigger']) {
      addNewRobot();
    }

    // setup the next animation sequence
    $(this).animate({top:'+=' + xv * 16 + 'px',left:'+=' + 32 * yv + 'px'},
      api['robotSpeed'], 'linear', walk1);
    $(this).spState(state);
    $(this).attr('xv', xv).attr('yv', yv).attr('s', state);
  }

  function removeRobot(jQRobot) {
    jQRobot.destroy();
    jQRobot.remove();
    api['activeRobots']--;

    // to ensure respawn if all walk off edge
    if (0 == api['activeRobots']) {
      api['robotScore'] = - api['robotScoreTrigger'];
    }
    updateRobotCount();
  }

  function updateRobotCount() {
    if (0 == api['robotCount']) {
      if (api['numTeleported'] >= api['teleportTarget']) {
        nextLevel();
      } else {
        gameOver();
      }
    } else {
      if (api['score'] > api['robotScore'] + api['robotScoreTrigger']) {
        addNewRobot();
      }
    }
  }

  function addNewRobot() {
    if (api['robotCount'] > 0 && api['activeRobots'] < 2) {
      api['robotCount']--;
      $('#robotCount').text(api['robotCount']);
      var robot = addObject(
        $('#level'), 1, api['startX'], api['startY'], NEMESIS_GID);
      api['robotScore'] = api['score'];
      api['activeRobots']++;
    }
  }

  function removePreviousLevel() {

    // remove robots
    $('div[l="1"]').each(function(idx) {
      $(this).destroy();
      $(this).remove();
    });

    // remove all squares
    $('div[l="0"]').each(function(idx) {
      $(this).remove();
    });
  }

  function nextLevel() {
    removePreviousLevel();
    loadLevel('level1.json', $('#level'));

    // use timer to get around the elements not there before rendering.
    safeTimeout(addNewRobot, 1000);
  }

  function gameOver() {
    removePreviousLevel();
    var c = $('#credit');
    c.text('End');
    c.css('color','#00CC00');
    captionAnim(c);
    safeTimeout(function() { introScreen(0); }, CAPTION_LENGTH);
  }

  function spinDirection() {
    $('.gid2, .gid3, .gid4, .gid5').each(function(idx) {
      var gid = Math.floor(Math.random() * 4) + 2;
      for (var i = 2; i < 6; ++i) {
        if (gid == i) {
          $(this).addClass('gid' + gid);
        } else {
          $(this).removeClass('gid' + i);
        }
      }
    });
  }

  function introScreen(stage) {
    var c = $('#credit');
    switch(stage) {
      case 0:
      {
        var s = $('#startButton');
        if (0 == s.length) {
          s = $('<div id="startButton" class="span1 btn btn-success">Start</div>');
          s.appendTo($('#screen'));
          s.click(startGame);
        }
        s.show();
        c.html('From the producer of Neon Starlight');
        c.css('color', 'cyan');
        safeTimeout(function() { introScreen(stage + 1); }, CAPTION_LENGTH);
        break;
      }
      case 1:
      {
        c.css('color', '#00CC00');
        c.text('Emerald Starlight');
        safeTimeout(function() { introScreen(stage + 1); }, CAPTION_LENGTH);
        break;
      }
      case 2:
      {
        c.text('Tap Start to Play');
        safeTimeout(function() { introScreen(0); }, CAPTION_LENGTH);
        break;
      }
    }
    captionAnim(c);
  }

  function captionAnim(caption) {
    caption.fadeIn(2000).delay(2000).fadeOut('fast');
  };

  function startGame() {
    clearTimeout(api['timeout']);
    $('#credit').empty();
    $('#startButton').hide();
    nextLevel();
  }

  function safeTimeout(f, d) {
    if (typeof api['timeout'] != 'undefined') {
      clearTimeout(api['timeout']);
      api['timeout'] = null;
    }
    api['timeout'] = setTimeout(f, d);
  }

  function start() {
    soundManager.url = './'; 
    soundManager.flashVersion = 9; 
    soundManager.useHighPerformance = true;
    soundManager.audioFormats.mp3.required = false;
    soundManager.flashLoadTimeout = 500; 
    soundManager.debugMode = false;
    soundManager.ontimeout(function(status) { 
      soundManager.useHTML5Audio = true; 
      soundManager.preferFlash = false; 
      soundManager.reboot(); 
    }); 
 
    var loader = new PxLoader(), 
      backgroundImg = loader.addImage('back.jpg'), 
      blockImg = loader.addImage('block.png'), 
      nemeisImg = loader.addImage('nemesis.png'), 
      teleportImg = loader.addImage('teleport.png'); 

    loader.addProgressListener(function(e) { 
      var p = $('#progress-bar');
      if (e.completedCount != e.totalCount) {
        var w = 100.0 * e.completedCount / e.totalCount;
        p.css('width', w + '%');
      } else {
        p.css('width', '110%');
        $('#progress').delay(250).fadeOut('fast');
      }
    });

    loader.addCompletionListener(function() { 
      $('#credit').hide();
      soundManager.play('EmeraldStarlight', {loops:9999});
      safeTimeout(function() { introScreen(0); }, 1000);
    }); 

    soundManager.onready(function() { 
      var soundNames = ['bing','crash','teleport','EmeraldStarlight'], 
        i, url; 
 
      for(i=0; i < soundNames.length; i++) { 
        url = './' + soundNames[i] + '.m4a'; 
        if (!soundManager.canPlayURL(url)) {
          url = './' + soundNames[i] + '.ogg';
          if (!soundManager.canPlayURL(url)) {
            console.log('Skipping ' + url);
            continue;
          }
        }
        loader.addSound(soundNames[i], url); 
      }
      loader.start();
    }); 

    $('#screen').pan({fps: 30, speed: 1, dir: 'up'});
  }

  // Start the game once everything is loaded
  $(document).ready(start);

})(jQuery);

