// Main application configuration file
angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate','mainController', 'authServices'])

.config(function($httpProvider){
    //configuring app to all http requests
    $httpProvider.interceptors.push('AuthInterceptors');
});