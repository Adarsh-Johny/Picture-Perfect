/*global angular,console,state*/
define(["angular",
    'app/eruditeconfig',
 'app/User/Student/Shared/student-model'], function () {
     'use strict';
     return angular.module('eruditeApp.Student.AttendanceRecordService', ['ngEnter'])
        .service('$$AttendanceRecord', ['$q', '$http', 'ERUDITE_CONFIG', function ($q, $http, ERUDITE_CONFIG) {
            var apiUrl = ERUDITE_CONFIG.baseUrl;
            this.saveStudentAttendanceDetails = function (model) {
                var deferred = $q.defer(),
                  promise = deferred.promise;

                $http.post(apiUrl + 'student/attendance/save-student-attendance-details', model)
                .then(function (resp) {
                    deferred.resolve(resp.data);
                })
                .catch(function (error) {
                    deferred.reject(error.data);
                });
                promise.success = function (callback) {
                    promise.then(callback);
                    return promise;
                };
                promise.error = function (callback) {
                    promise.catch(callback);
                    return promise;
                };
                return promise;
            };     






        }]);
 });