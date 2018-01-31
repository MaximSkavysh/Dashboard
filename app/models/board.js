/**
 * Created by SkavyshM on 1/24/2018.
 */
var dateFormat = require('dateformat');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BoardSchema = new Schema({
    name:String,
    description:String,
    link:String,
    version:String,
    model:String,
    linkModel: String,
    sbe: String,
    sbeLink: String,
    created_at    : { type: String }
});

BoardSchema.pre('save', function(next){
    var now = new Date();
        this.created_at = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    next();
});

module.exports = mongoose.model('Board',BoardSchema);


