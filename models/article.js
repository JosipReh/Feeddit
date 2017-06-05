var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

var ArticleSchema = new mongoose.Schema({
    article_title : String,
    article_author : String,
    article_post_by : String,
    votes : Number,
    real_url : String,
    created: Date,
 });


var Article = module.exports = mongoose.model('Article', ArticleSchema);


module.exports.getArticleById = function(id, callback){
    Article.findById(id, callback);
}

module.exports.getArticleByUsername = function (username,callback) {
	var query = {username : username};
	Article.find(query, callback);
}

module.exports.getNumerOfArticles = function (username,callback) {
	var query = {article_post_by : username};
	Article.count(query, callback);
}

module.exports.getUserProfileArticles = function (username,skip_pages_num,display_per_pages,callback) {
	var query = {article_post_by :username};
	    Article.find(query, {}, {skip: skip_pages_num,limit: display_per_pages},callback);
}



module.exports.saveArticle = function (newArticle, callback) {  //save object to database
	newArticle.save(callback);
}


module.exports.updateArticleVotes = function (id,vote,callback) {
	Article.findByIdAndUpdate ({_id:id},{$inc : {votes: vote}} , { new:true} , callback);
}


module.exports.getArticles = function (callback){    //gets all articles from database
	Article.find(callback);
}

module.exports.deleteArticle = function (id,callback) {
	query = {_id : id};
	Article.remove(query,callback);
}



module.exports.addVotetoId = function (id, vote, callback) {  //increment vote
	Article.findByIdAndUpdate (id,{$inc : {votes: vote}} , { new:true} , callback);
}


