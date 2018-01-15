var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userScheme = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String,required: true},
    email: {type: String, required:true, unique: true}
});

userScheme.pre('save',function(next){
	var user = this;
	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

module.exports = mongoose.model('User',userScheme);