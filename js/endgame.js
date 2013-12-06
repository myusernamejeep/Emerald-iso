// -------------------------------------------------------------
//   Force Centered Navigation
// -------------------------------------------------------------
(function () {

 	var by_rank_nemesis = _.shuffle(nemesis);
 	by_rank = [2,1,3,4];
	var htmls = "";
    var $items_grid = $('#goal ul');
    var $wrap = $('#goal').next();
    $items_grid.empty();  

    var count = 1;
    for (var x in by_rank) {
    	//console.log(x, by_rank[x] );
      var color = nemesis[by_rank[x] - 1];
      var rank_no = by_rank[x];
      //console.log(color);
      if(count>3){
      	$items_grid.append(htmls);    
      	console.log(htmls);
      	var html = '<div class="'+ color +' rank'+ rank_no +' nemesis_character last_rank" ><div class="last_rank">#'  + rank_no +' </div></div>';
      	$wrap.append(html);    

      	break;
      }
      var html = '<li class="'+ color +' rank'+ rank_no +' nemesis_character " ><div class="rank">' + rank_no +' </div></li>';
      if(rank_no == 1){
      	htmls += '<div class="rays"></div>';
      }
      htmls += html;

      count ++;
    }
    //$items_grid.append(htmls);    

	//$('.nemesis_character').sprite({fps: 8, no_of_frames: 8});

}());