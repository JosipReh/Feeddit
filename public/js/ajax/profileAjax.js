var url = "http://91.121.95.35:5100";
$(document).ready(function() {
  $("#delete_article_form").submit(function(e) {
  	e.preventDefault()
  		var username = document.getElementById("delete_article_form").getAttribute("username"); //pass username for redirect
		var boxes = $('input[name="delete"]:checked'); //get selected boxes
		var parent = boxes.parent().parent().parent(); //get article parent element
		var article_ids = []; //array for storing 
		var alert_box_error = document.getElementById("alert_box_error"); //get error message
		var alert_box_success = document.getElementById("alert_box_success"); //get success message

		//push article_ids into array
		for (var i=0;i<boxes.length;i++) {
			article_ids.push(boxes[i].value);
		}

		  $.ajax({
		    url: url+"/index/article/delete",
		    method: "post",
		    data : {
		        article_ids : article_ids
		    },
		    success : function(response){
		    	for (var i =0; i<parent.length;i++) { //remove deleted articles
		    		parent[i].remove();
		    	}
		    	//show success message
				$(alert_box_success).css({'display':'inline-block'});
				$(alert_box_success).text("Obrisano je ["+article_ids.length+"] članaka");
				$(alert_box_success).fadeOut(7000);



		    },
		    error : function(response) {
		    	$(alert_box_error).css({'display':'inline-block'});
				$(alert_box_error).text("Niti jedan članak nije označen");
				$(alert_box_error).fadeOut(7000);
		    }
		  });

	});
});
