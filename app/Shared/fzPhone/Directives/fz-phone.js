/// <reference path="../../Directives/FzNumber.js" />
/*global angular*/

define(['angular',
'app/Shared/Services/utility.service.js',
'angular-ui-mask',
'app/Shared/Directives/FzNumber'], function () {
    return angular.module('eruditeApp.Shared.PhoneDirective', [])
    .directive('fzPhone', ['$$Utility', function ($$Utility) {
        var phoneController = ['$scope', '$timeout', function ($scope, $timeout) {
            $scope.label = "Phone";
            $scope.name = $$Utility.getUUID();
            $scope.$watch('model', function (value) {
                if (value) {
                    var val = angular.copy($scope.model);
                    val = val.split(' x');
                    $scope.phone = val[0];
                    $scope.phoneExt = val[1];
                }
            });
            $scope.$watch('phone', function (value) {
                if ($scope.phoneExt && value) {
                    $scope.model = value + " x" + $scope.phoneExt;
                }
                else {
                    $scope.model = $scope.phone;
                }
            });
            $scope.$watch('phoneExt', function (value) {
                if (value && $scope.phone) {
                    $scope.model = $scope.phone + " x" + value;
                }
                else {
                    $scope.model = $scope.phone;
                }
            });
        }];

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/app/Shared/fzPhone/Templates/fz-phone.html',
            scope: {
                model: '=',
            },

            controller: phoneController,

            link: function (scope, element, attrs, ctrl) {
                if (angular.isDefined(attrs.label)) {
                    scope.label = attrs.label;
                }

                if (angular.isUndefined(attrs.required)) {
                    scope.required = false;
                }
                else {
                    scope.required = true;
                }

                if (angular.isUndefined(attrs.readonly)) {
                    scope.readonly = false;
                }
                else {
                    scope.readonly = true;
                }

                scope.PopulatePhoneWithExtn = function () {
                    if (scope.phoneExt && scope.phone) {
                        scope.model = scope.phone + " x" + scope.phoneExt;
                    }
                    else {
                        scope.model = scope.phone;
                    }
                };
            }
        };
    }]);
});
