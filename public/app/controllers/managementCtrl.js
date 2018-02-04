angular.module('managementController', [])

.controller('managementCtrl', function (User, $timeout) {
   var app =this;
   app.accessDenied = true;
   app.errorMsg = false;
   app.editAccess = false;
   app.deleteAccess = false;

   function getUsers() {
       User.getUsers().then(function (data) {
           if(data.data.success){
               if(data.data.permission === 'admin' || data.data.permission === 'uploader'){
                   app.users = data.data.users;
                   app.accessDenied =false;
                   if(data.data.permission === 'admin'){
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
        if(data.data.success){
            app.successMsg = data.data.message;
            $timeout(function () {
                getUsers();
            },1000);

        }
        else {
            app.errorMsg = data.data.message;
        }
     });

   };
});