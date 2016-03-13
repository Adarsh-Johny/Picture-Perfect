/*global angular,console,state*/
define(["angular",
    'app/eruditeconfig',
 'app/User/Student/Shared/student-model'], function () {
     'use strict';
     return angular.module('eruditeApp.Student.AttendanceService', ['ngEnter'])
        .service('$$Attendance', ['$q', '$http', 'ERUDITE_CONFIG', function ($q, $http, ERUDITE_CONFIG) {
            var apiUrl = ERUDITE_CONFIG.baseUrl;
            this.getAllStudents = function (gridRequest) {
                var deferred = $q.defer(),
                  promise = deferred.promise;

                $http.post(apiUrl + 'student/get-all', gridRequest)
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
            this.getStudentAttendanceDetails = function (model) {
                var deferred = $q.defer(),
                    promise = deferred.promise;
                $http.post(apiUrl + 'student/attendance/get-student-attendance-details/', model)
                .then(function (resp) {
                    //var student = new Student(resp.data);
                    deferred.resolve(resp.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
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

            this.getClassscheduleDetails = function (model) {
                var deferred = $q.defer(),
                    promise = deferred.promise;
                $http.post(apiUrl + 'student/attendance/get-class-schedule-details/', model)
                .then(function (resp) {
                   // var student = new Student(resp.data);
                    deferred.resolve(resp.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
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