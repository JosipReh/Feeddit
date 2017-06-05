
var url = "http://91.121.95.35:5100";
$(document).on('submit', '.vote_form',function(e){
  e.preventDefault();
  var article_id = $(this).attr("article_id");
  var upvote_value = $(this).find('button.upvote_btn:focus').val();
  var downvote_value = $(this).find('button.downvote_btn:focus').val();



  var upvote_button = $(this).find('button.upvote_btn');
  var downvote_button = $(this).find('button.downvote_btn');
  var vote = ( parseInt(upvote_value ||0) + parseInt(downvote_value || 0));


  var vote_num = $(this).find('p.vote_num').text();
  var vote_paragraph = $(this).find('p');
  console.log(vote_num);

  $.ajax({
    url: url+"/index/article/vote/"+article_id,
    method: "post",
    data :  { upvote: upvote_value,
              downvote: downvote_value
    },
    success : function(response){
      console.log("voted with "+ response.vote);
      console.log($(this).find('p.vote_num'));
      $(vote_paragraph).text(parseInt(vote_num)+parseInt(response.vote));//update vote paragraph

    },
    error : function(response) {
    }
  });
});
