define(['angular'], function () {
    return ﻿angular.module('eruditeApp.Shared.ModelCloseDirective', [])
    .directive('fzClose', ['$parse','$$DialogConfirm', function ($parse,$$DialogConfirm) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/app/Shared/fzClose/Templates/fz-close.html',
            link: function (scope, elm, attrs, ctrl) {
                 scope.closeAction = function() {
	                var pristine = true;
	                angular.forEach(scope, function (value) {
	                    if (angular.isObject(value)) {
	                        if(value.hasOwnProperty('$$parentForm')){
							  if(value.$pristine == false){
							  	pristine = value.$pristine;
							  }
							}
	                    }
	                });
	                if(!pristine){
	                	showDialog();
	                }
	                else{
		               scope.closeThisDialog();
	                }
                };
                function showDialog(){
		        	$$DialogConfirm.open('Warning', 'Are you sure you want to discard the changes?')
		            .then(function (value) {
		                if (value) {
		                	scope.closeThisDialog();
		                }
		            }, function (error) {
		                console.log("fz-close",error);
		            });
		        }

            }
        };

    }]);
});
