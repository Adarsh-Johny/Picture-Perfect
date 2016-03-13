/*global console,angular*/
define(["angular",
    'app/eruditeconfig',
    'toaster',
    'app/Shared/fzSnapshot/fzProviderSnapshot/fz-provider-snapshot-service'], function () {
        'use strict';
        var fzProviderSnapshotController = ['$scope', '$$ProviderSnapshot', '$state', '$timeout', 'toaster',
        function ($scope, $$ProviderSnapshot, $state, $timeout, toaster) {
            $scope.tab = {};
            $scope.tab.active = "PROFILE";
            $scope.getProviderSnapshotDetails = function (providerID) {
                $scope.tab.active = "PROFILE";
                $$ProviderSnapshot.getProviderSnapshotDetails(providerID)
                    .success(function (resp) {
                        $scope.ProviderSnapshot = resp;
                        console.log('ProviderSnapshot', resp);
                    }).error(function (error) {
                        toaster.error("Something went wrong");
                    });
            };


        }];
        return angular.module('eruditeApp.Shared.ProviderSnapshotController', ['eruditeApp.Shared.ProviderSnapshotService'])
            .controller('fzProviderSnapshotController', fzProviderSnapshotController)
            .directive('fzProviderSnapshot', ['$timeout', function ($timeout) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'app/Shared/fzSnapshot/fzProviderSnapshot/fz-provider-snapshot.html',
                    scope: {
                        value: '=',
                        id: '='
                    },
                    controller: 'fzProviderSnapshotController',
                    //link: {
                    //    pre: function (scope, element, attributes) {
                    //        scope.value = attributes.value;
                    //        scope.ID = attributes.id;

                    //    }
                    //}
                };

            }]);
    });
