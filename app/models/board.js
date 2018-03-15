/**
 * Created by SkavyshM on 1/24/2018.
 */
var dateFormat = require('dateformat');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardSchema = new Schema({
    name: String,
    description: String,
    link: String,
    version: String,
    model: String,
    linkModel: String,
    sbe: String,
    sbeLink: String,
    created_at: {type: String}
});

function getCurrentDay() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    if (day < 100) {
        day = '0' + day;
    }
    return day;
}

BoardSchema.pre('save', function (next) {
    var now = new Date();
    var currentDay = getCurrentDay();
    var yearForVersion = dateFormat(now, "yy");
    this.version = yearForVersion + currentDay;
    this.created_at = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    next();
});

module.exports = mongoose.model('Board', BoardSchema);


