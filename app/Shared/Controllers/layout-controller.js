angular.module('eruditeApp.Shared.LayoutController', ['toaster'])
    .controller('layoutController', [
        '$scope',
        'toaster',
        function ($scope, toaster) {
            $scope.toastMessage = function(title, msg){
                toaster.success({title: title, body: msg});
            }
        }
    ]);
