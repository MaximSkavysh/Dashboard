angular.module('userControllers',[])

.controller('regCtrl',function(){
	this.regUser = function(regData){
		console.log(this.regData);
	};
	
})
