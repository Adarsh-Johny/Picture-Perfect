/*global define,angular*/

define(["angular",
    'ngDialog', 'app/eruditeconfig'
], function () {
    return angular.module('eruditeApp.Shared.LookupService', [])
       .service('$$Lookup', ['$http', 'ERUDITE_CONFIG', '$q', function ($http, ERUDITE_CONFIG, $q) {
           var apiUrl = ERUDITE_CONFIG.baseUrl;

           this.getProfiles = function () {
               return $http.get(apiUrl + 'lookups/get-profiles');
           };

           this.getAllCourses = function () {
               var deferred = $q.defer();
               var promise = deferred.promise;
               $http.get(apiUrl + 'lookups/get-courses')
               .then(function (resp) {
                   var resp = resp.data;
                   deferred.resolve(resp);
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
           this.getAllBatches = function () {
               var deferred = $q.defer();
               var promise = deferred.promise;
               $http.get(apiUrl + 'lookups/get-batches')
               .then(function (resp) {
                   var resp = resp.data;
                   deferred.resolve(resp);
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
           this.getAllDivisions = function () {
               var deferred = $q.defer();
               var promise = deferred.promise;
               $http.get(apiUrl + 'lookups/get-divisions')
               .then(function (resp) {
                   var resp = resp.data;
                   deferred.resolve(resp);
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

           this.getAssignedUsers = function () {
               return $http.get(apiUrl + 'lookups/get-users');
           };

           this.GetAccounts = function () {
               return $http.get(apiUrl + 'utility/get-account-list');
           };

       }]);
});
