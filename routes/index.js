var express = require("express");
var router = express.Router();

var Article = require("../models/article.js");
var Vote = require("../models/vote.js");




/*
ROUTE: /index/user/username/page
	:username -> user profile username
	:page -> number of pagination page
*/
router.get('/user/:username/:page', function (req,res) {
	if (!req.user) return res.redirect("/auth/login"); //user is not logged in! --> redirect
    var page_num = req.params['page']; // get value of curent page
    var username = req.params['username']; //get user profile
    var page_number = Math.abs(req.params["page"]); //convert page to positive number
    if (page_num < 0) return res.redirect("index/user/"+username+"/"+ page_number);
    if (page_number == 0) return res.redirect("/index/" + page_number++);
    console.log(username);


    var display_per_pages = 10;  //number of articles displayed per page
    var skip_pages_num = ((page_number - 1) * 10); // skip pages based on page_number

    Article.getNumerOfArticles(username, function(err,count) {
    	console.log(count);
        var number_of_pages = Math.floor(count / display_per_pages); //number of whole pages

        res.locals.page_count = number_of_pages + 1;  //data for paginator
        res.locals.current_page_num = page_number;   //data for paginator

        res.locals.articleList = []; //array of articles


        Article.getUserProfileArticles(username,skip_pages_num,display_per_pages,function (err,results) {
            for (var i = 0; i < results.length; i++) {
                var articleObject = {
                    article_id: results[i].get("_id"),
                    article_title: results[i].get("article_title"),
                    article_author: results[i].get("article_author"),
                    article_post_by: results[i].get("article_post_by"),
                    article_votes: results[i].get("votes"),
                    real_url: results[i].get("real_url")
                };
                res.locals.articleList.push(articleObject);
                console.log("articles", res.locals.articleList);
            }
            return res.render("pages/profile", {
                layout: "sessionLayout"
            });
        });

    });

});




/*
ROUTE: /index/page
	:page -> number of pagination page
*/
router.get('/:page', function(req, res) {
    var page_num = req.params['page']; // get value of curent page
    var page_number = Math.abs(req.params["page"]); //convert page to positive number
    if (page_num < 0) return res.redirect("/index/" + page_number);
    if (page_number == 0) return res.redirect("/index/" + page_number++);
    if (!req.user) return res.redirect("/auth/login");
    var username = req.user.username;

    //var init
    var display_per_pages = 10;
    var skip_pages_num = ((page_number - 1) * 10);

    Article.count({}, function(err, count) {
        var number_of_pages = Math.floor(count / display_per_pages);

        res.locals.page_count = number_of_pages + 1;
        res.locals.current_page_num = page_number;

        res.locals.articleList = [];
        Article.find({}, {}, {
            skip: skip_pages_num,
            limit: display_per_pages
        }, function(err, results) {

            for (var i = 0; i < results.length; i++) {
                var articleObject = {
                    article_id: results[i].get("_id"),
                    article_title: results[i].get("article_title"),
                    article_author: results[i].get("article_author"),
                    article_post_by: results[i].get("article_post_by"),
                    article_votes: results[i].get("votes"),
                    real_url: results[i].get("real_url")
                };
                res.locals.articleList.push(articleObject);
            }

            var voteList = [];
            Vote.getVotesByUsername(username, function(err, votes) {
                for (var i = 0; i < votes.length; i++) {
                    var votesObject = {
                        username: votes[i].get("username"),
                        vote: votes[i].get("vote"),
                        article_id: votes[i].get("article_id")
                    }
                    voteList.push(votesObject);
                }
            });
            return res.render("pages/index", {
                layout: "sessionLayout"
            });
        });

    });
});

/*
ROUTE: /index/article/vote/:article_id
	:article_id -> article id for voting
*/
router.post('/article/vote/:article_id', function(req, res) {
	if (!req.user) return res.redirect("/auth/login");
	var article_id = req.params['article_id'];
    var upvote = req.body.upvote || 0;
    var downvote = req.body.downvote || 0;


    var receivedVote = (parseInt(upvote) + parseInt(downvote));
    var username = req.user.username;


    //select from articles where id wanted id
    Article.getArticleById(article_id, function (err,article) {
    	if (err) {
            return res.status(500).json({ error: true});
        }
    	if (!article) {
    		return res.status(404).send(err);
    	}
    	//select from votes where username = session username and article_id = article_id
    	Vote.getUserVoteForArticle(username,article_id, function (err,vote) {
		    	if (err) {
		            return res.status(500).json({ error: true});
		        }
    		//console.log("Vote for post",vote.value, article_id);
    		//if vote exist
    		if (vote) {
    			var updatedVote;
    			console.log("RV",receivedVote);
    			//upvoted
    			if (vote.value == 1 && receivedVote ==1) { //user wants to upvote again
    				updatedVote = 0;
    				console.log("User wants to upvote again, " +updatedVote);
    			}else if (vote.value == -1 && receivedVote == -1) { //user wants to downvote again
    				updatedVote = 0;
    				console.log("User wants to downvote again, " +updatedVote);
    			}else if (receivedVote == 1 && vote.value == -1){ //user downvoted and wants to change state tu upvote
    				updatedVote = 1;
    				console.log("User downvoted and wants to change state to upvote" + updatedVote);
    			}else if (receivedVote == -1 && vote.value == 1){ //user upvoted and wants to change state to downvote
    				updatedVote = -1;
    				console.log("User upvoted and wants to change state to downvote", updatedVote);
    			}else {
    				updatedVote = receivedVote;
    			}
    			console.log("UPV", updatedVote);

    			Vote.addVotetoId(vote._id,updatedVote, function (err, update) {
				    	if (err) {
				            return res.status(500).json({ error: true});
				        }
	    			Article.updateArticleVotes(article_id, updatedVote, function (err,update) {
				    	if (err) {
				            return res.status(500).json({ error: true});
				        }
	    				return res.status(200).json({message: "Success",article_votes : article.votes,vote: updatedVote, dbvote: vote.value, receivedVote: receivedVote});
	    			});
    			});

    		//vote does not exist
			}else {
				var newVote = new Vote({
				    username : username,
				    value : receivedVote,
				    article_id : article_id
				});
				Vote.createVote(newVote, function (err,vote) {
			    	if (err) {
			            return res.status(500).json({ error: true});
			        }
				//update view
					Article.addVotetoId(article_id, receivedVote, function (err,update) {
						console.log("Vote ne postoji, kreiran je i iznosi:", newVote.value)
						return res.status(200).json({message: "Success",vote: newVote.value});
					});

				});
			}
			
    	});//getUserVoteForArticle
		

    }); // end of getArticleById

});






/*
ROUTE: /index/article/new
*/
router.get('/article/new/', function(req, res) {
    if (!req.user) return res.redirect("/auth/login");



    return res.render('pages/addArticle', {
        layout: "sessionLayout"
    });
});
/*
ROUTE: /index/article/delete
*/
router.post('/article/delete', function(req,res) {
	if (!req.user) return res.redirect("/auth/login");
	var article_ids = req.body.article_ids;
	for (var i =0; i<article_ids.length;i++) {
		Article.deleteArticle(article_ids[i], function (err,article) {
			if (err) {
				return res.status(403).json({message: "Molimo unesite autora članka!"});
			}
		});
	}
	return res.status(200).json({success: true, message: "Uspješno ste objavili članak!"});
});

/*
ROUTE: /index/article/add
*/
router.post('/article/add/', function(req, res) {
    if (req.user) {
        var getTodayDate = new Date();
        var article_title = req.body.article_title || false;
        var article_author = req.body.article_author || false;
        var article_post_by = req.user.username || false;
        var real_url = req.body.real_url || false;

        console.log(article_post_by, article_title, real_url, article_author);

        if (article_title) {
            if (article_author) {
                if (real_url) {

                    var newArticle = new Article({
                        article_title: article_title,
                        article_author: article_author,
                        article_post_by: article_post_by,
                        votes: 0,
                        real_url: real_url,
                        created: getTodayDate
                    })
                    Article.saveArticle(newArticle, function(err, user) {
                        if (err) {
                        	return res.status(500).json({ error: true});
                        }
                        return res.status(200).json({
                            success: true,
                            message: "Uspješno ste objavili članak!"
                        });

                    });

                } else {
                    return res.status(403).json({
                        "status": 401,
                        message: "Molimo unesite link članka!"
                    });
                }

            } else {
                return res.status(403).json({
                    "status": 401,
                    message: "Molimo unesite autora članka!"
                });
            }

        } else {
            return res.status(403).json({
                error: true,
                message: "Molimo popunite sva tražena polja!"
            })
        }
    } else {
        return res.redirect('/auth/login')
    }

});




module.exports = router;