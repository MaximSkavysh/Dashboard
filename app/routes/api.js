var User = require('../models/users');

module.exports = function(router){
	router.post('/users', function(req,res){
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email = req.body.email;
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' ||
			req.body.emai == null || req.body.emai == ''){
			res.send('Ensure username and password were provided');

		}
		else{
			user.save(function(err){
				if(err){
					res.send('Username already exists!');
				}
				else{
					res.send('User created');
				}
			});
		}
	});
	return router;
}