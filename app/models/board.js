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
    created_at    : { type: Date }
});

BoardSchema.pre('save', function(next){
    now = new Date();
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model('Board',BoardSchema);


