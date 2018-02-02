angular.module('mainController',['authServices', 'userServices'])

.controller('mainCtrl', function (Auth, $timeout, $location, $rootScope, $interval, $window, $route, User, AuthToken) {
        var app = this;
        app.loadme = false; // to increase speed of hiding

        app.checkSession = function () {
            if(Auth.isLoggedIn()){
                app.checkingSession = false;
                var interval = $interval(function () {
                    var token = $window.localStorage.getItem('token');
                    if(token === null){
                        $interval.cancel(interval);
                    }
                    else {
                        // Parse JSON Web Token using AngularJS for timestamp conversion
                        self.parseJwt = function (token) {
                            var base64URL = token.split('.')[1];
                            var base64 = base64URL.replace('-','+').replace('_','/');
                            return JSON.parse($window.atob(base64));
                        }
                        var expireTime = self.parseJwt(token);
                        var timeStamp = Math.floor(Date.now()/1000);
                        var  timeCheck = expireTime.exp - timeStamp;
                        if(timeCheck <= 15){
                            showModal(1);
                            $interval.cancel(interval);
                        }
                    }
                },2000);
            }
        };
        app.checkSession();

        var showModal = function (option) {
            app.choiceMade = false;
            app.modalHeader = undefined;
            app.modalBody = undefined;
            app.hideButtons = false;
            if(option === 1){
                app.modalHeader = 'Timeout warning';
                app.modalBody = 'Your session will expired in 15 seconds. Would you like to renew it?';
                $("#myModal").modal({backdrop: "static"});
                // Give user 10 seconds to make a decision 'yes'/'no'
                $timeout(function() {
                    if (!app.choiceMade) app.endSession(); // If no choice is made after 10 seconds, select 'no' for them
                }, 10000);
            }
            else if(option === 2){
                app.modalHeader = 'Logging out';
                app.hideButtons = true;
                $("#myModal").modal({backdrop: "static"});
                $timeout(function () {
                    Auth.logout();
                    $location.path('/logout');
                    hideModal();
                },2000);

            }
        };
        
        app.renewSession = function () {
            app.choiceMade = true;

            User.renewSession(app.username).then(function (data) {
               if(data.data.success){
                    AuthToken.setToken(data.data.token);
                    app.checkSession();
               }
               else {
                   app.modalBody = data.data.message;
               }
            });
            hideModal();
        };
        
        app.endSession = function () {
            app.choiceMade = true;
            hideModal();
            $timeout(function () {
                showModal(2);
            },1000);
        };

        var hideModal = function () {
            $("#myModal").modal('hide');
        };

        $rootScope.$on('$routeChangeStart', function(){

            if(!app.checkSession) app.checkSession();
            if(Auth.isLoggedIn()){
                //console.log("user is logged in");
                app.isLoggedIn = true;
                Auth.getUser().then(function(data){
                    app.username = data.data.username;
                    app.useremail = data.data.email;
                    app.loadme = true;
                });
            }
            else{
                //console.log("user is not logged in");
                app.isLoggedIn = false;
                app.username='';
                app.loadme = true;
            }
        });

        app.doLogin = function(loginData){
            app.loading = true;
            app.errorMsg= false;

            Auth.login(app.loginData).then(function(data){
                //console.log(data);
                if(data.data.success){
                    app.loading=false;
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        $location.path('/notes');
                        app.loginData = '';
                        app.successMsg = false;
                        app.checkSession();
                    }, 1000);

                }
                else{
                    app.loading=false;
                    app.errorMsg = data.data.message;
                }
            });
        };

        app.logout = function(){
            showModal(2);
        };

});