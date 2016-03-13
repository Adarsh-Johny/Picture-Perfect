/// <reference path="../../Patient/patient-config.js" />
/*global angular,console,state*/

define(["angular",
    'app/Shared/Directives/header-directive',
    'app/User/Student/BasicInformation/student-basic-info-service',
    'app/Shared/fzGrid/Directives/fz-grid',
    'app/Shared/Directives/ng-enter',
    'app/Patient/patient-config',

], function () {
    'use strict';
    return angular.module('eruditeApp.Student.StudentGridController', ['eruditeApp.Student.StudentBasicInfoService', 'ngEnter'])
        .controller('StudentGridController', ['$scope', '$$StudentBasicInfo', '$state', 'toaster',
            function ($scope, $$StudentBasicInfo, $state, toaster) {
                $scope.model = {
                    title: 'Students',
                    PageIndex: 1,
                    PageSize: 15,
                    filters: {},
                    data: []
                };
                $scope.isEditable = false;
                $scope.onLoad = function () {
                    $$StudentBasicInfo.getAllStudents({
                        Filter: $scope.model.filters,
                        PageIndex: $scope.model.PageIndex,
                        PageSize: $scope.model.PageSize
                    })
                      .success(function (resp) {
                          $scope.model.data = resp.Result;
                          $scope.model.gridTotalRecords = resp.TotalRecords;
                          $scope.$broadcast('reformGrid');
                      })
                      .error(function (error) {
                          console.log(error);
                          toaster.error("Something went wrong");
                      });
                };

                $scope.toggleViewMode = function () {
                    $scope.isEditable = !$scope.isEditable;                  
                };
                $scope.getStudents = function (id) {
                    $scope.isEditable = false;
                    if (id && id.StudentID) {
                        getStudentById(id.StudentID);
                    }
                };
                function getStudentById(studentId) {
                    $$StudentBasicInfo.getStudentById(studentId)
                        .success(function (student) {                            
                            $scope.Student = angular.copy(student);
                            $scope.master = angular.copy($scope.Student);                         
                        })
                        .error(function (err) {
                            toaster.error("Something went wrong, could not find the student for editing");
                        });
                }
            }]);
});
