angular.module('mainController',['authServices'])

.controller('mainCtrl', function (Auth, $timeout, $location, $rootScope) {
        var app = this;
        app.loadme = false; // to increase speed of hiding
        $rootScope.$on('$routeChangeStart', function(){
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
                    }, 1000);

                }
                else{
                    app.loading=false;
                    app.errorMsg = data.data.message;
                }
            });
        };

        this.logout = function(){
            Auth.logout();
            $location.path('/logout');
            $timeout(function(){
                $location.path('/');
            }, 1000);
        }

});