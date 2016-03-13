/*global console,angular*/
define(["angular",
    'app/eruditeconfig',
    'toaster',
    'app/Shared/fzSnapshot/fzPayorSnapshot/fz-payor-snapshot-service'], function () {
        'use strict';
        var fzPayorSnapshotController = ['$scope', '$$PayorSnapshot', '$state', '$timeout', 'toaster',
        function ($scope, $$PayorSnapshot, $state, $timeout, toaster) {
            $scope.tab = {};
            $scope.tab.active = "PLAN";
            $scope.getPayorSnapshotDetails = function (payorID) {
                $scope.tab.active = "PLAN";
                $$PayorSnapshot.getPayorSnapshotDetails(payorID)
                    .success(function (resp) {
                        $scope.PayorSnapshot = resp;
                        console.log('PayorSnapshot', resp);
                    }).error(function (error) {
                        toaster.error("Something went wrong");
                    });
            };


        }];
        return angular.module('eruditeApp.Shared.PayorSnapshotController', ['eruditeApp.Shared.PayorSnapshotService'])
            .controller('fzPayorSnapshotController', fzPayorSnapshotController)
            .directive('fzPayorSnapshot', ['$timeout', function ($timeout) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'app/Shared/fzSnapshot/fzPayorSnapshot/fz-payor-snapshot.html',
                    scope: {
                        value: '=',
                        id:'='
                    },

                    controller: 'fzPayorSnapshotController',
                    //link: {
                    //    pre: function (scope, element, attributes) {
                    //        scope.value = attributes.value;
                    //        scope.ID = attributes.id;

                    //    }
                    //}
                };

            }]);
    });
