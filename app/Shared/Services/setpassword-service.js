/*global angular,define*/
define(["angular",
    'toaster',
    'ngDialog',
    'xtForm',
    'app/Shared/fzSubmit/Directives/fz-submit',
    'app/eruditeconfig'
], function () {
    'use strict';
    var setpasswordController = ['$scope', '$timeout', '$$setpasswordservice', 'toaster', '$state', '$stateParams',
       function ($scope, $timeout, $$setpasswordservice, toaster, $state, $stateParams) {
           $scope.request = {};
           $scope.PasswordMismatchMsg = [];
           $scope.validUrl = false;
           $$setpasswordservice.validateurl($stateParams.token)
             .success(function (resp) {
                 if (resp === false) {
                     $scope.validUrl = true;
                 } else {
                     $scope.validUrl = false;
                     toaster.error("Link Expired");
                     $state.go('login');
                 }
             })
             .error(function (err) {
                 if (!(angular.isUndefined(err.ModelState.ResetpasswordLink))) {
                     toaster.error(err.ModelState.ResetpasswordLink.toString());
                 } else if (!(angular.isUndefined(err.ModelState.LinkExpired))) {
                     toaster.error(err.ModelState.LinkExpired.toString());
                 } else {
                     toaster.error("Something went wrong. Please try again");
                 }
                 $state.go('login');
             });
           $scope.Submit = function () {
               $timeout(function () {
                   $scope.PasswordMismatchMsg = [];
               });
               var msg = '', pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{5,32}/, doSubmit = true;
               if (!$scope.request.Password) {
                   msg = "The password you entered doesn't meet the above criteria";
                   doSubmit = false;
               }
               else if (!pattern.test($scope.request.Password)) {
                   msg = "The password you entered doesn't meet the above criteria";
                   doSubmit = false;
               }
               else if ($scope.request.Password !== $scope.request.passwordconfirm) {
                   msg = "Password doesn't match";
                   doSubmit = false;
               }
               if (msg && !doSubmit) {
                   $scope.PasswordMismatchMsg = [{ "WrongPassword": msg }];
                   return false;
               }
               $scope.request.Token = $stateParams.token;
               $$setpasswordservice.savepassword($scope.request)
                 .success(function (resp) {
                     toaster.success("Password Changed successfully");
                     $state.go('login');
                 })
                 .error(function (err) {
                     if (!(angular.isUndefined(err.ModelState.WeakPassword))) {
                         toaster.error(err.ModelState.WeakPassword.toString());
                     } else if (!(angular.isUndefined(err.ModelState.LinkExpired))) {
                         toaster.error(err.ModelState.LinkExpired.toString());
                         $state.go('login');
                     } else if (!(angular.isUndefined(err.ModelState.Password))) {
                         toaster.error(err.ModelState.Password.toString());
                     }
                     else {
                         toaster.error("Something went wrong. Please try again");
                         $state.go('login');
                     }
                 });
           };
       }
    ];



    return angular.module('eruditeApp.Shared.setpasswordservice', [])
        .controller('setpasswordController', setpasswordController)
        .service('$$setpasswordservice', ['$http', 'ERUDITE_CONFIG', '$q',
            function ($http, ERUDITE_CONFIG, $q) {
                var baseurl = ERUDITE_CONFIG.baseUrl;

                this.validateurl = function (token) {
                    return $http.post(baseurl + 'Login/is-password-link-expired/' + token);
                };

                this.savepassword = function (request) {
                    return $http.post(baseurl + 'Login/set-password/', request);
                };
            }
        ]);
});