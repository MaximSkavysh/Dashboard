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
                controllerAs: 'register',
                authenticated: false
            })
            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false

            })

            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html',
                authenticated: true

            })

            .when('/employees', {
                templateUrl:'app/views/pages/template/list.html',
                controller:'boardCtrl'
            })
            .when('/employees/create', {
                templateUrl:'app/views/pages/template/add.html',
                controller:'boardCtrl'
            })
            .when('/employees/:id/edit', {
                templateUrl:'app/views/pages/template/edit.html',
                controller:'boardCtrl'
            })
            .when('/employees/:id/show', {
                templateUrl:'app/views/pages/template/show.html',
                controller:'boardCtrl'
            })

            // "catch all" to redirect to home page
            .otherwise({ redirectTo: '/' });

        // Required for no base (remove '#' from address bar)
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    });
