$(document).ready(function() {
    $("#new_article_form").validate({
        rules: {
            real_url: {
                required: true,
                url: true
            },
            article_author: "required",
            article_title : "required"
        },

        messages: {
            article_title: "Molimo unesite ime članka!",
            real_url: {
                required: "Molimo unesite link članka!",
                url: "Uneseni link nije valjan!"
            },
            article_author: "Molimo unesite autora članka!"
        },
        submitHandler: function(form) {
            var url = "http://91.121.95.35:5100";
            var article_votes = document.getElementById("article_votes").value;
            var article_post_by = document.getElementById("article_post_by").value;
            var article_title = document.getElementById("article_title").value;
            var real_url = document.getElementById("real_url").value;
            var article_author = document.getElementById("article_author").value;
            var error_msg = document.getElementById("error_alert");
            console.log(error_msg);

            $.ajax({
                url: url + "/index/article/add/",
                method: "post",
                data: $("#new_article_form").serialize(),
                success: function(response) {
                    $(error_msg).css("color", "green");
                    $(error_msg).html(response.message).fadeOut(7000, function() {
                        $(error_msg).empty().fadeIn();
                    });
                },
                error: function(response) {
                        $(error_msg).css("color","red");
                        $(error_msg).html(response.responseJSON.message).fadeOut(7000, function(){
                          $(error_msg).empty().fadeIn();
                        });
                        console.log("error");
                    }
            });
            return false;
        }
    });
});