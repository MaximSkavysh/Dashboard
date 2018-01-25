/**
 * Created by SkavyshM on 1/24/2018.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BoardSchema = new Schema({
    name:String,
    description:String,
    link:String,
    version:String,
    model:String,
    dateUpload:String
});

module.exports = mongoose.model('Board',BoardSchema);


