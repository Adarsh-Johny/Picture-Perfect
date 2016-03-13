/*global angular,console,state*/
define(["angular",
    'app/eruditeconfig',
 'app/User/Student/Shared/student-model'], function () {
     'use strict';
     return angular.module('eruditeApp.Student.AbsentListService', ['ngEnter'])
        .service('$$AbsentList', ['$q', '$http', 'ERUDITE_CONFIG', function ($q, $http, ERUDITE_CONFIG) {
            var apiUrl = ERUDITE_CONFIG.baseUrl;

            this.getStudentAbsentDetailsForDay = function (model) {
                var deferred = $q.defer(),
                  promise = deferred.promise;

                $http.post(apiUrl + 'student/attendance/get-all-student-attendance-details-for-day', model)
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
            this.addAbsentNotificationToQueue = function (model) {
                var deferred = $q.defer(),
                  promise = deferred.promise;

                $http.post(apiUrl + 'student/attendance/add-student-absent-details-to-notification-queue', model)
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