/**
 * Created by SkavyshM on 1/24/2018.
 */
angular.module('boardController', [])

    .controller('boardCtrl', function ($scope, $route, $routeParams, $http) {
        $scope.getNotes = function () {
            $http.get('/api/notes/').then(function (response) {
                $scope.notes = response.data;
            });
        };
        $scope.showNote = function () {
            var id = $routeParams.id;
            $http.get('/api/notes/' + id).then(function (response) {
                $scope.note = response.data;
            });
        };
        $scope.addNote = function () {
            //var id = $routeParams.id;
            $http.post('/api/notes/', $scope.note).then(function (response) {
                window.location.href = '/notes';
            });
        };
        $scope.updateNote = function () {
            var id = $routeParams.id;
            $http.put('/api/notes/' + id, $scope.note).then(function (response) {
                //$scope.employee = response.data;
                window.location.href = '/notes';
            });
        };
        $scope.deleteNote = function (id) {
            var id = id;
            $http.delete('/api/notes/' + id).then(function (response) {
                $route.reload();
            });
        };

        //$scope.sendMail = function(){
        //
        //}

    });