var User = require('../models/users'); // Important the database User Model created with Mongoose Schema

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
    // user login route
    router.post('/authenticate',function (req, res) {
        User.findOne({email: req.body.email}).select('email username password').exec(function (err, user) {
            if (err) throw err;
            if(!user){
                res.json({success: false, message : 'Could not authenticate user'});
            }
            else if(user){
                if (req.body.password){
                    var validPassword = user.comparePassword(req.body.password);
                }else {
                    res.json({success:'false', message: 'No password provided'});
                }
                if(validPassword){
                    res.json({success: true, message: 'User authenticated!'});
                }
                else {
                    res.json({success: false, message: 'Could not authenticate password!'});
                }
            }
        });

    });
    return router; // Return router object to server
}
