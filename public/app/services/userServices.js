angular.module('userServices', [])

    .factory('User', function ($http) {
        var userFactory = {}; // Create the User object

        // User.create(regData)
        userFactory.create = function (regData) {
            return $http.post('/api/users', regData); // Return data from end point to controller
        };
        userFactory.renewSession = function (username) {
            return $http.get('/api/renewToken/' + username);
        };
        userFactory.getPermission = function () {
            return $http.get('/api/permission');
        }
        userFactory.getUsers = function () {
            return $http.get('/api/management');
        };
        userFactory.getUser = function (id) {
            return $http.get('/api/edit/' + id);
        };

        userFactory.deleteUser = function (username) {
            return $http.delete('/api/management/' + username);
        };

        return userFactory;
    });
