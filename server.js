// JavaScript source code
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan 	= 	require('morgan');
var mongoose 	= 	require('mongoose');
var bodyParser 	= 	require('body-parser');
var router	= 	express.Router();
var appRoutes 	= 	require('./app/routes/api')(router);
var path = require('path');
var ip = require('ip');


var ipAddress = ip.address();

console.log(ipAddress);
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

mongoose.connect('mongodb://localhost:27017/my_database', function(err){
	if(err){
		console.log('Not connected to the DB ' + err);

	}
	else{
		console.log('Successfully connected to mongoDB');
	}
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, ipAddress, function () {
    console.log('Running the server: ' + port + ' ipAddress: ' + ipAddress);
});
