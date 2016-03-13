/*global angular,console,state*/
define(["angular",
    'app/eruditeconfig',
 'app/User/Student/Shared/student-model' ], function () {
        'use strict';
        return angular.module('eruditeApp.Student.StudentBasicInfoService', ['ngEnter'])
           .service('$$StudentBasicInfo', ['$q', '$http', 'ERUDITE_CONFIG', function ($q, $http, ERUDITE_CONFIG) {
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
               this.getStudentById = function (id) {
                   var deferred = $q.defer(),
                       promise = deferred.promise;
                   $http.get(apiUrl + 'student/basic-information/get/' + id)
                   .then(function (resp) {
                       var student = new Student(resp.data);
                       deferred.resolve(student);
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
