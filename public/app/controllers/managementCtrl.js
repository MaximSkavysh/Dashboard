angular.module('managementController', [])

    .controller('managementCtrl', function (User, $timeout) {
        var app = this;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editAccess = false;
        app.deleteAccess = false;

        function getUsers() {
            User.getUsers().then(function (data) {
                if (data.data.success) {
                    if (data.data.permission === 'admin' || data.data.permission === 'uploader') {
                        app.users = data.data.users;
                        app.accessDenied = false;
                        if (data.data.permission === 'admin') {
                            app.editAccess = true;
                            app.deleteAccess = true;
                        }
                    }
                    else {
                        app.errorMsg = 'No permission';
                    }
                }
                else {
                    app.errorMsg = data.data.message;
                }
            });
        }

        getUsers();

        app.deleteUser = function (username) {
            User.deleteUser(username).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        getUsers();
                    }, 1000);

                }
                else {
                    app.errorMsg = data.data.message;
                }
            });

        };
    })

    .controller('editCtrl', function ($scope, $routeParams, User, $timeout) {
        var app = this;
        app.phase1 = true;
        User.getUser($routeParams.id).then(function (data) {
            if (data.data.success) {
                $scope.newUsername = data.data.user.username;
                $scope.newEmail = data.data.user.email;
                $scope.newPermission = data.data.user.permission;
                app.curretUser = data.data.user._id;
            }
            else {
                app.errorMsg = data.data.message;
            }
        });


        $scope.usernameTab = 'active';

        app.usernamePhase = function () {
            $scope.usernameTab = 'active';
            $scope.emaiTab = 'default';
            $scope.permissionTab = 'default';
            app.phase1 = true;
            app.phase2 = false;
            app.phase3 = false;
            app.errorMsg = false;

        };

        app.emailPhase = function () {
            $scope.usernameTab = 'default';
            $scope.emaiTab = 'active';
            $scope.permissionTab = 'default';
            app.phase1 = false;
            app.phase2 = true;
            app.phase3 = false;
            app.errorMsg = false;
        };

        app.permissionPhase = function () {
            $scope.usernameTab = 'default';
            $scope.emaiTab = 'default';
            $scope.permissionTab = 'active';
            app.phase1 = false
            app.phase2 = false;
            app.phase3 = true;
            app.errorMsg = false;
        };

        app.updateUsername = function (newUsername) {
            app.errorMsg = false;
            app.disabled = true;
            var userObject = {};
            userObject._id = app.curretUser;
            userObject.username = $scope.newUsername;
            User.editUser(userObject).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        app.usernameForm.username.$setPristine();
                        app.usernameForm.username.$setUntouched();
                        app.successMsg = false;
                        app.diasabled = false;
                    }, 1000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        };
        app.updateEmail = function (newEmail) {
            app.errorMsg = false;
            app.disabled = true;
            var userObject = {};
            userObject._id = app.curretUser;
            userObject.email = $scope.newEmail;
            User.editUser(userObject).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        app.emailForm.email.$setPristine();
                        app.emailForm.email.$setUntouched();
                        app.successMsg = false;
                        app.diasabled = false;
                    }, 1000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        };

        app.updatePermission = function (newPermission) {
            app.errorMsg = false;
            app.disableUser = true;
            app.disableAdmin = true;
            var userObject = {};
            userObject._id = app.curretUser;
            userObject.permission = newPermission;
            User.editUser(userObject).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        app.successMsg = false;
                        $scope.newPermission = newPermission;
                        if (newPermission === 'user') {
                            app.disableUser = true;
                            app.disableAdmin = false;
                        }
                        if (newPermission === 'admin') {
                            app.disableUser = false;
                            app.disableAdmin = true;
                        }
                        app.successMsg = false;
                        app.diasabled = false;
                    }, 1000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        };

    });