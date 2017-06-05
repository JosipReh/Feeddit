var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

var VotesSchema = new mongoose.Schema({
    username : String,
    value : Number,
    article_id : String,
 });


var Votes = module.exports = mongoose.model('Vote', VotesSchema);


module.exports.createVote = function(newVote, callback) {
    newVote.save(callback)
}



module.exports.getArticleById = function(id, callback){
    Article.findById(id, callback);
}



module.exports.getArticles = function (callback){
	Article.find(callback);
}



module.exports.getVotesByUsername = function (username,callback) {
    query = {username:username};
    Votes.find(query, callback);
}

module.exports.getUserVoteForArticle = function(username,article_id, callback) {
    var query = {username : username, article_id: article_id};
    Votes.findOne(query,callback);
}

module.exports.addVotetoId = function (id, value, callback) {
	Votes.findByIdAndUpdate (id,{$inc : {value: value}} , { new:true} , callback);
}

