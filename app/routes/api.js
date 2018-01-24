var User = require('../models/users'); // Important the database User Model created with Mongoose Schema
var Board = require('../models/board')
var jwt = require('jsonwebtoken');
var secretPhrase = 'lobster';
// Export routes to the main server.js file
module.exports = function(router) {
    /* ====================
    User Registration Route
    ==================== */
    router.post('/users', function(req, res) {
        var user = new User(); // Create a new User object and save to a variable
        user.username = req.body.username; // Save username sent by request (using bodyParser)
        user.password = req.body.password; // Save password sent by request (using bodyParser)
        user.email = req.body.email; // Save email sent by request (using bodyParser)
        // If statement to ensure request it not empty or null
        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            // If criteria is met, save user to database
            user.save(function(err) {
                if (err) {
                    res.json({ success: false, message: 'Username or Email already exists!' }); // Cannot save if username or email exist in the database
                } else {
                    res.json({ success: true, message: 'user created!' }); // If all criteria met, save user
                }
            });
        }
    });
    router.post('/authenticate', function(req, res){
         User.findOne({email: req.body.email}).select('email password username').exec(function(err, user){
            if(err) throw err;

            if(!user){
                res.json({success: false, message:'could not authenticate user'});
            }
            else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not validate Password' });
                    } else {
                        var token = jwt.sign({username: user.username, email: user.email}, secretPhrase,{ expiresIn: '1h' });
                        res.json({ success: true, message: 'User Authenticate', token: token });
                    }
                } else {
                    res.json({ success: false, message: 'No password provided' });
                }
            }
        });

    });

    //decrypt token - using middleware
    router.use(function(req, res, next){
        //way to get token - request, url, headers
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if(token){
            //verify token
            jwt.verify(token, secretPhrase, function(err, decoded){
                if(err){
                    //when user tries to login after 24hrs with same token
                    res.json({success: false, message:'Token Invalid'});
                }
                else{
                    //decoded sends username
                    req.decoded=decoded;
                    next();	//goes to /current_user
                }
            });
        }
        else{
            res.json({success: false, message: 'No token provided'});
        }
    });
    router.post('/current_user', function(req, res){
        res.send(req.decoded);
    });

    // CRUID operations with dashboard

    router.get('/employees', function(req, res){
        Board.find(function(err, employees){
            if(err)
                res.send(err);
            res.json(employees);
        });
    });

    router.get('/employees/:id', function(req, res){
        Board.findOne({_id:req.params.id}, function(err, employee){
            if(err)
                res.send(err);
            res.json(employee);
        });
    });
    router.post('/employees', function(req, res){
        Board.create( req.body, function(err, employees){
            if(err)
                res.send(err);
            res.json(employees);
        });
    });

    router.delete('/employees/:id', function(req, res){
        Board.findOneAndRemove({_id:req.params.id}, function(err, employee){
            if(err)
                res.send(err);
            res.json(employee);
        });
    });
    router.put('/employees/:id', function(req, res){
        var query = {
            name:req.body.name,
            dept:req.body.dept,
            area:req.body.area,
            status:req.body.status,
            contact:req.body.contact,
            salary:req.body.salary
        };
        Board.findOneAndUpdate({_id:req.params.id}, query, function(err, employee){
            if(err)
                res.send(err);
            res.json(employee);
        });
    });



    return router; // Return router object to server
}