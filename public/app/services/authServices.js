angular.module('authServices', [])

    .factory('Auth', function($http, AuthToken){
         var authFactory = {};	//user objects
        //User.create(regData):
        authFactory.login = function(loginData){
            return $http.post('/api/authenticate', loginData).then(function(data){
                //console.log(data.data.token);
                AuthToken.setToken(data.data.token);
                return data;
            });
        };

        //Auth.isLoggedIn();
        authFactory.isLoggedIn = function(){
            if(AuthToken.getToken()){
                return true;
            }
            else{
                return false;
            }
        };

        //Auth.getUser();
        authFactory.getUser = function(){
            if(AuthToken.getToken()){
                return $http.post('/api/current_user');
            }
            else{
                $q.reject({message: 'faculty has no token'});
            }
        };
        //Auth.logout()
        authFactory.logout = function(){
            //destroy token
            //no longer sets the token
            AuthToken.setToken();

        };
        return authFactory;
    })

    .factory('AuthToken', function($window){
        var authTokenFactory ={};	//create factory object
        authTokenFactory.setToken = function(token){
            if(token){
                window.localStorage.setItem('token', token);
            }
            else{
                window.localStorage.removeItem('token');
            }
        };

        //AuthToken.getToken();
        authTokenFactory.getToken = function(){
            return $window.localStorage.getItem('token');
        };
        return authTokenFactory;
    })

    //to attach token on every request
    .factory('AuthInterceptors', function (AuthToken) {
        var authInterceptorsFactory = {};
        authInterceptorsFactory.request = function (config) {
            var token = AuthToken.getToken();
            if (token) {
                //if token exists
                //assign to headers
                config.headers['x-access-token'] = token;
            }
            return config;
        };
        return authInterceptorsFactory;
    });

