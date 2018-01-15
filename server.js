// JavaScript source code
var express = require('express');
var app = express();
var port = process.env.PORT || 8090;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRouter = require('./app/routes/api')(router);
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +'/public'));
app.use('api',appRouter);

mongoose.connect('mongodb://localhost:27017/my_database', function(err){
	if(err){
		console.log('Not connected to the DB ' + err);

	}
	else{
		console.log('Successfuly connected to mongoDB');
	}
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function () {
    console.log('Running the server: ' + port);
});