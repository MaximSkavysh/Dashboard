/**
 * Created by SkavyshM on 1/24/2018.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BoardSchema = new Schema({
    name:String,
    dept:String,
    area:String,
    status:String,
    contact:String,
    salary:String
});

module.exports = mongoose.model('Board',BoardSchema);


