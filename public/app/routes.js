var app = angular.module('appRoutes', ['ngRoute'])

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

            .when('/notes', {
                templateUrl:'app/views/pages/template/list.html',
                controller:'boardCtrl',
                authenticated: true
            })
            .when('/notes/create', {
                templateUrl:'app/views/pages/template/add.html',
                controller:'boardCtrl',
                authenticated: true
            })
            .when('/notes/:id/edit', {
                templateUrl:'app/views/pages/template/edit.html',
                controller:'boardCtrl',
                authenticated: true
            })
            .when('/notes/:id/show', {
                templateUrl:'app/views/pages/template/show.html',
                controller:'boardCtrl',
                authenticated: true
            })

            // "catch all" to redirect to home page
            .otherwise({ redirectTo: '/' });

        // Required for no base (remove '#' from address bar)
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    });

app.run(['$rootScope', 'Auth', '$location',  function($rootScope, Auth, $location) {

    // Check each time route changes
    $rootScope.$on('$routeChangeStart', function(event, next, current) {

        // Only perform if user visited a route listed above
        console.log(next.$$route);
        if (next.$$route !== undefined) {
            // Check if authentication is required on route
            if (next.$$route.authenticated === true) {
                // Check if authentication is required, then if permission is required
                if (!Auth.isLoggedIn()) {
                    event.preventDefault(); // If not logged in, prevent accessing route
                    $location.path('/'); // Redirect to home instead
                }
            } else if (next.$$route.authenticated === false) {
                // If authentication is not required, make sure is not logged in
                if (Auth.isLoggedIn()) {
                    event.preventDefault(); // If user is logged in, prevent accessing route
                    $location.path('/profile'); // Redirect to profile instead
                }
            }
        }
    });
}]);
