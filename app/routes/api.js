var User = require('../models/users'); // Important the database User Model created with Mongoose Schema
var Board = require('../models/board')
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package
var dateFormat = require('dateformat');
var mongoose = require('mongoose');
var secretPhrase = 'lobster';
// Export routes to the main server.js file
module.exports = function (router) {

    // Start Sendgrid Configuration Settings
    var options = {
        auth: {
            api_user: 'Maksim.Skavysh', // Sendgrid username
            api_key: '!lobster23' // Sendgrid password
        }
    }
    var mailer = nodemailer.createTransport(sgTransport(options));
    // End Sendgrid Configuration Settings
    /* ====================
     User Registration Route
     ==================== */
    router.post('/users', function (req, res) {
        var user = new User(); // Create a new User object and save to a variable
        user.username = req.body.username; // Save username sent by request (using bodyParser)
        user.password = req.body.password; // Save password sent by request (using bodyParser)
        user.email = req.body.email; // Save email sent by request (using bodyParser)
        // If statement to ensure request it not empty or null
        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
            res.json({success: false, message: 'Ensure username, email and password were provided'});
        } else {
            // If criteria is met, save user to database
            user.save(function (err) {
                if (err) {
                    res.json({success: false, message: 'Username or Email already exists!'}); // Cannot save if username or email exist in the database
                } else {
                    res.json({success: true, message: 'User created!'}); // If all criteria met, save user
                }
            });
        }
    });
    router.post('/authenticate', function (req, res) {
        var loginUserEmail = req.body.email;
        User.findOne({email: loginUserEmail}).select('email password username').exec(function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({success: false, message: 'Could not authenticate user'});
            }
            else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({success: false, message: 'Could not validate Password'});
                    } else {
                        var token = jwt.sign({
                            username: user.username,
                            email: user.email
                        }, secretPhrase, {expiresIn: '24h'});
                        res.json({success: true, message: 'User Authenticate', token: token});
                    }
                } else {
                    res.json({success: false, message: 'No password provided'});
                }
            }
        });

    });

    //decrypt token - using middleware
    router.use(function (req, res, next) {
        //way to get token - request, url, headers
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            //verify token
            jwt.verify(token, secretPhrase, function (err, decoded) {
                if (err) {
                    //when user tries to login after 24hrs with same token
                    res.json({success: false, message: 'Token Invalid'});
                }
                else {
                    //decoded sends username
                    req.decoded = decoded;
                    next();	//goes to /current_user
                }
            });
        }
        else {
            res.json({success: false, message: 'No token provided'});
        }
    });
    router.post('/current_user', function (req, res) {
        res.send(req.decoded);
    });

    router.get('/renewToken/:username', function (req, res) {
        User.findOne({username: req.params.username}).select().exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({success: false, message: 'No user was found'});
            }
            else {
                var newToken = jwt.sign({username: user.username, email: user.email}, secretPhrase, {expiresIn: '1h'});
                res.json({success: true, message: 'User Authenticate', token: newToken});
            }
        });
    });

    router.get('/permission', function (req, res) {
        User.findOne({username: req.decoded.username}, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({success: false, message: 'No user was found'});
            }
            else {
                res.json({success: true, permission: user.permission});
            }
        });
    });

    router.get('/management', function (req, res) {
        User.find({}, function (err, users) {
            if (err) throw err;
            User.findOne({username: req.decoded.username}, function (err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({success: false, message: 'No user was found'})
                }
                else {
                    if (mainUser.permission === 'admin') {
                        if (!users) {
                            res.json({success: false, message: 'Users not found'});
                        }
                        else {
                            res.json({success: true, users: users, permission: mainUser.permission});
                        }
                    }
                    else {
                        res.json({success: false, message: 'No permission'})
                    }
                }
            });
        });
    });

    router.delete('/management/:username', function (req, res) {
        var deletedUser = req.params.username;
        User.findOne({username: req.decoded.username}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({success: false, message: 'No user found'});
            }
            else {
                if (mainUser.permission !== 'admin') {
                    res.json({success: false, message: 'No permission'});
                }
                else {
                    User.findOneAndRemove({username: deletedUser}, function (err, user) {
                        if (err) throw err;
                        res.json({success: true, message: 'User was delete successfully'});
                    })
                }
            }
        })
    });

    router.get('/edit/:id', function (req, res) {
        var editUser = req.params.id;
        User.findOne({username: req.decoded.username}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({success: false, message: 'No user found'});
            }
            else {
                if (mainUser.permission === 'admin') {
                    User.findOne({_id: editUser}, function (err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({success: false, message: 'No user found'});
                        }
                        else {
                            res.json({success: true, user: user});
                        }
                    });
                }
                else {
                    res.json({success: false, message: 'No permission'});
                }
            }
        });
    });

    router.put('/edit', function (req, res) {
        var editUser = req.body._id;
        if (req.body.username) var newUsername = req.body.username;
        if (req.body.email) var newEmail = req.body.email;
        if (req.body.permission) var newPermission = req.body.permission;
        User.findOne({username: req.decoded.username}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({success: false, message: "No user found"});
            }
            if (newUsername) {
                if (mainUser.permission === 'admin') {
                    User.findOne({_id: editUser}, function (err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({success: false, message: 'No user was found'});
                        }
                        else {
                            user.username = newUsername;
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    res.json({success: true, message: 'Username has been updated'})
                                }
                            });
                        }
                    });
                }
                else {
                    res.json({success: false, message: 'No permission'});
                }
            }
            if (newEmail) {
                if (mainUser.permission === 'admin') {
                    User.findOne({_id: editUser}, function (err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({success: false, message: 'No user was found'});
                        }
                        else {
                            user.email = newEmail;
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    res.json({success: true, message: 'Email has been updated'})
                                }
                            });
                        }
                    });
                }
                else {
                    res.json({success: false, message: 'No permission'});
                }
            }
            if (newPermission) {
                if (mainUser.permission === 'admin') {
                    User.findOne({_id: editUser}, function (err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({success: false, message: 'No user was found'});
                        }
                        else {
                            // Check if attempting to set the 'user' permission
                            if (newPermission === 'user') {
                                // Check the current permission is an admin
                                if (user.permission === 'admin') {
                                    // Check if user making changes has access
                                    if (mainUser.permission !== 'admin') {
                                        res.json({
                                            success: false,
                                            message: 'Insufficient Permissions. You must be an admin to downgrade an admin.'
                                        }); // Return error
                                    } else {
                                        user.permission = newPermission; // Assign new permission to user
                                        // Save changes
                                        user.save(function (err) {
                                            if (err) {
                                                console.log(err); // Long error to console
                                            } else {
                                                res.json({success: true, message: 'Permissions have been updated!'}); // Return success
                                            }
                                        });
                                    }
                                } else {
                                    user.permission = newPermission; // Assign new permission to user
                                    // Save changes
                                    user.save(function (err) {
                                        if (err) {
                                            console.log(err); // Log error to console
                                        } else {
                                            res.json({success: true, message: 'Permission have been updated!'}); // Return success
                                        }
                                    });
                                }
                            }
                            // Check if attempting to set the 'moderator' permission
                            if (newPermission === 'uploader') {
                                // Check if the current permission is 'admin'
                                if (user.permission === 'admin') {
                                    // Check if user making changes has access
                                    if (mainUser.permission !== 'admin') {
                                        res.json({
                                            success: false,
                                            message: 'Insufficient Permission. You must be an admin to downgrade another admin'
                                        }); // Return error
                                    } else {
                                        user.permission = newPermission; // Assign new permission
                                        // Save changes
                                        user.save(function (err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({success: true, message: 'Permission have been updated!'}); // Return success
                                            }
                                        });
                                    }
                                } else {
                                    user.permission = newPermission; // Assign new permssion
                                    // Save changes
                                    user.save(function (err) {
                                        if (err) {
                                            console.log(err); // Log error to console
                                        } else {
                                            res.json({success: true, message: 'Permission have been updated!'}); // Return success
                                        }
                                    });
                                }
                            }

                            // Check if assigning the 'admin' permission
                            if (newPermission === 'admin') {
                                // Check if logged in user has access
                                if (mainUser.permission === 'admin') {
                                    user.permission = newPermission; // Assign new permission
                                    // Save changes
                                    user.save(function (err) {
                                        if (err) {
                                            console.log(err); // Log error to console
                                        } else {
                                            res.json({success: true, message: 'Permissions have been updated!'}); // Return success
                                        }
                                    });
                                } else {
                                    res.json({
                                        success: false,
                                        message: 'Insufficient Permissions. You must be an admin to upgrade someone to the admin level'
                                    }); // Return error
                                }
                            }
                        }


                    });
                }
                else {
                    res.json({success: false, message: 'No permission'});
                }
            }
        });
    });

    // CRUID operations with dashboard
    router.get('/notes', function (req, res) {
        Board.find(function (err, notes) {
            if (err)
                res.send(err);
            res.json(notes);
        });
    });

    router.get('/notes/:id', function (req, res) {
        Board.findOne({_id: req.params.id}, function (err, note) {
            if (err)
                res.send(err);
            res.json(note);
        });
    });
    Board.aggregate([
        {$match: {created_at: "Wednesday, January 31st, 2018, 9:10:00 PM"}},
        {$group: {_id: '$created_at', total_builds: {$sum: 1}}}
    ], function (err, res) {
        if (err) return handleError(err);
        console.log(res);
    });

    Board.aggregate(
        {
            $group:
                {_id: '$created_at', total_builds: {$sum: 1}}
        },
        function (err, res) {
            if (err) return handleError(err);
            console.log(res);
        }
    );


    router.post('/notes', function (req, res) {
        var newEmail = false;
        var note = req.body.name;
        var description = req.body.description;
        var linkToNote = req.body.link;
        var model = req.body.model;
        var linkModel = req.body.linkModel;
        var sbe = req.body.sbe;
        var sbeLink = req.body.sbeLink;
        if (req.body.sendEmail) newEmail = true;
        Board.create(req.body, function (err, notes) {
            if (err)
                res.send(err);
            res.json(notes);
            if (newEmail == true) {
                var email = {
                    to: ['Maksim.Skavysh@ibm.com', 'Ikram Khan/Dallas/IBM@IBMUS', 'Rob Morgan/Endicott/IBM@IBMUS', 'Erica Wilson/Dallas/IBM@IBMUS', 'Ed Cordell/Fishkill/IBM@IBMUS', 'Satyendra Kumar/Austin/IBM@IBMUS', 'Doug C Ewing/Austin/IBM@IBMUS', 'Egor Titovich/Rochester/Contr/IBM@IBMUS', 'jorge.hernandez.rojas@ibm.com', 'natalia@mx1.ibm.com', 'zcarlos@mx1.ibm.com', 'lmrodrig@mx1.ibm.com', 'Ritu Machavarapu/Austin/IBM@IBMUS', 'mcasarez@mx1.ibm.com'],
                    from: 'Maksim.Skavysh@ibm.com',
                    cc: ['Alexander Pokataev/Austin/Contr/IBM@IBMUS', 'Uladimir Zmachynski/Poughkeepsie/Contr/IBM@IBMUS'],
                    subject: 'New build: ' + model,
                    text: 'Hello new build ',
                    html: 'Hello new build:<strong> ' + model + '</strong> is avaliable in box: <a href="' + linkModel + '"> ' + linkModel + '</a>' +
                    '<br>Release notes:<strong> ' + note + '</strong> <a href="' + linkToNote + '"> ' + linkToNote + '</a>' +
                    '<br>SBE Version:<strong> ' + sbe + '</strong> <a href="' + sbeLink + '"> ' + sbeLink + '</a>' +
                    '<br><strong>Also this has been uploaded to GSA</strong><ul><li>/gsa/ausgsa/projects/e/ecfgcloud/prod-power</li><li>/gsa/ausgsa/projects/e/ecfgcloud/prod-storage</li><li>/gsa/ausgsa/projects/e/ecfgcloud/prod-z</li></ul>' +
                    '<br>For more details visit demo "Dashboard for release notes": <a href="http://9.53.68.17:8080/">http://9.53.68.17:8080/</a>.<strong> after registration.</strong>'
                };

                mailer.sendMail(email, function (err, res) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(res);
                });
                newEmail = false;
            }

        });
    });

    router.delete('/notes/:id', function (req, res) {
        Board.findOneAndRemove({_id: req.params.id}, function (err, notes) {
            if (err)
                res.send(err);
            res.json(notes);
        });
    });
    router.put('/notes/:id', function (req, res) {
        var query = {
            name: req.body.name,
            description: req.body.description,
            link: req.body.link,
            model: req.body.model,
            linkModel: req.body.linkModel,
            sbe: req.body.sbe,
            sbeLink: req.body.sbeLink
            // dateUpload:req.body.dateUpload
        };
        Board.findOneAndUpdate({_id: req.params.id}, query, function (err, note) {
            if (err)
                res.send(err);
            res.json(note);
        });
    });

    return router; // Return router object to server
}