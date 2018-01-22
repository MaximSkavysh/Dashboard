angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {

        $routeProvider // Create routes

        // Home Route
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })

            // Aboute Route            
            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })

            // Register Route            
            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register'
            })
            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html'

            })

        // "catch all" to redirect to home page
            .otherwise({ redirectTo: '/' });

        // Required for no base (remove '#' from address bar)
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    });