angular.module('mainController',['authServices'])

.controller('mainCtrl', function (Auth, $timeout, $location) {
        var app = this;

        // Function to submit form and register account
        app.doLogin = function (loginData) {
            app.loading = true; // To activate spinning loading icon w/bootstrap
            app.errorMsg = false; // Clear error message each time the user presses submit

            // Initiate service to save the user into the dabase
            Auth.login(app.loginData).then(function (data) {
                if (data.data.success) {
                    app.loading = false; // Once data is retrieved, loading icon should be cleared
                    app.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    // Redirect to home page after 2000 miliseconds
                    $timeout(function () {
                        $location.path('/about');
                        $route.reload();
                    }, 2000);
                } else {
                    app.loading = false; // Once data is retrieved, loading icon should be cleared
                    app.errorMsg = data.data.message; // Create an error message
                }
            });
        };

});