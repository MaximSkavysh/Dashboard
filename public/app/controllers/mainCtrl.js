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
                        self.parseJwt = function (token) {
                            var base64URL = token.split('.')[1];
                            var base64 = base64URL.replace('-','+').replace('_','/');
                            return JSON.parse($window.atob(base64));
                        }
                        var expireTime = self.parseJwt(token);
                        var timeStamp = Math.floor(Date.now()/1000);
                        var  timeCheck = expireTime.exp - timeStamp;
                        if(timeCheck <= 25){
                            console.log('token exp');
                            showModal(1);
                            $interval.cancel(interval);
                        }
                        else {
                            console.log('not exp');
                        }
                        console.log(expireTime.exp);
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
                app.modalBody = 'Your session will expired in 30 seconds. Would you like to renew it?';
                $("#myModal").modal({backdrop: "static"});
            }
            else if(option === 2){
                app.modalHeader = 'Logging out';
                app.hideButtons = true;
                $("#myModal").modal({backdrop: "static"});
                $timeout(function () {
                    Auth.logout();
                    $location.path('/');
                    hideModal();
                    $route.reload();
                })
            }
            $timeout(function () {
                if(!app.choiceMade){
                    Auth.logout();
                    $location.path('/');
                    console.log('logged out');
                    hideModal();
                }
            },4000);
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
            console.log('renew');
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
                    //console.log(data.data.username);
                    app.username = data.data.username;
                    app.useremail = data.data.email;
                    app.loadme = true;
                });
            }
            else{
                //console.log("user is not logged in");
                app.isLoggedIn = false;
                app.username=null;
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