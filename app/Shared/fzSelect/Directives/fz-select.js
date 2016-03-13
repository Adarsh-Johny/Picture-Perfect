
define(["angular",
    'app/Shared/Services/lookup-service'], function () {
        'use strict';
        return angular.module("eruditeApp.Shared.Select", [])

         .directive("fzSelectPatient", ['$$Lookup', function ($$Lookup) {
             return {
                 restrict: "E",
                 controller: function ($scope, $element) {
                     $scope.params = {
                         "Offset": 15,
                         "StartIndex": 1,
                         "Filter": ""
                     }
                     $scope.selectModel = [];
                     $scope.appendSelectData = function () {
                         (function (params) {
                             $$Lookup.getPatientsInfinite(params)
                               .success(function (response) {
                                   $scope.selectModel = $scope.selectModel.concat(response);
                               })
                               .error(function (error) { });
                         })($scope.params);
                     }
                     $scope.getSelectData = function () {
                         (function (params) {
                             $$Lookup.getPatientsInfinite(params)
                               .success(function (response) {
                                   var empty = [{ 'PatientID': null, 'PatientName': 'Select' }];
                                   $scope.selectModel = empty.concat(response);
                               })
                               .error(function (error) { });
                         })($scope.params);
                     }
                 }
             }
         }])
            .directive("fzSelectPayor", ['$$Lookup', function ($$Lookup) {
                return {
                    restrict: "E",
                    controller: function ($scope, $element) {
                        $scope.params = {
                            "Offset": 15,
                            "StartIndex": 1,
                            "Filter": ""
                        }
                        $scope.selectModel = [];
                        $scope.appendSelectData = function () {
                            (function (params) {
                                $$Lookup.getPayors(params)
                                  .success(function (response) {
                                      $scope.selectModel = $scope.selectModel.concat(response);
                                  })
                                  .error(function (error) { });
                            })($scope.params);
                        }
                        $scope.getSelectData = function () {
                            (function (params) {
                                $$Lookup.getPayors(params)
                                  .success(function (response) {
                                      var empty = [];
                                      $scope.selectModel = empty.concat(response);
                                  })
                                  .error(function (error) { });
                            })($scope.params);
                        }
                    }
                }
            }])
         .directive("fzSelect", [function () {
             return {
                 restrict: "E",
                 scope:
                     {
                         params: '=',
                         selectModel: '=',
                         getSelectData: '&',
                         appendSelectData: '&',
                     },
                 link: function (scope, element, attributes, controller) {
                     if (angular.isUndefined(attributes.params)) {
                         scope.params = {
                             "Offset": 15,
                             "StartIndex": 1,
                             "Filter": ""
                         }
                     }
                     scope.getSelectData();
                     scope.refreshModel = function (filter) {
                         if (filter.length > 2) {
                             scope.params.StartIndex = 1;
                             scope.params.Filter = filter;
                             scope.getSelectData();
                         } else {
                             scope.params.StartIndex = 1;
                             scope.params.Filter = "";
                             scope.getSelectData();
                         }
                     }
                     var elem = angular.element(element.find('.ui-select-choices'));
                     elem.bind('scroll', function () {
                         if (elem[0].scrollTop + elem[0].offsetHeight >= elem[0].scrollHeight - 10) {
                             scope.params.StartIndex++;
                             scope.appendSelectData();
                         }
                     });
                 }
             }
         }]);

    });