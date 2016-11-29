var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/triviaGame');

// Create a movie schema
var triviaGameSchema = new mongoose.Schema({
    question: String,
    answer: String
});

/*var userSchema = new mongoose.Schema({
	userName : String
});
*/
// Create a database collection model
var triviaGameDB = mongoose.model('triviaGame', triviaGameSchema);
//var userDB = mongoose.model('user', userSchema);

module.exports = triviaGameDB;
//module.exports.userDB = userDB;