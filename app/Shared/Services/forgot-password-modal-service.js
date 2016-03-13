define(["angular",
    'toaster',
    'ngDialog',
    'app/Shared/Services/login-service',
    'xtForm',
    //'app/Shared/fzSubmit/Directives/fz-submit',
], function () {
    'use strict';
    return angular.module('eruditeApp.Shared.ForgotPasswordModalService', ['ngDialog'])
      .service('$$ForgotPasswordModalService', ['$q', 'ngDialog', function ($q, ngDialog) {

          this.open = function () {
              var deferred = $q.defer();
              ngDialog.openConfirm({
                  template: '/app/Shared/Templates/forgotpassword.html',
                  className: "medium",
                  showClose: false,
                  controller: ForgotPasswordController,
                  //scope: scope
              }).then(function (value) {
                  deferred.resolve(value);
              }).catch(function () {
                  deferred.resolve(false);
              });
              return deferred.promise;
          }

          var ForgotPasswordController = ['$scope', '$$Login', 'toaster', '$$Lookup', function ($scope, $$Login, toaster, $$Lookup) {
              $scope.invalidEmailMessage = [];
              //Fetch all Accounts from database
              $$Lookup.GetAccounts()
                .success(function (resp) {
                    if (typeof $scope.ForgotPassword == "undefined")
                        $scope.ForgotPassword = {};
                    $scope.ForgotPassword.Accounts = resp;
                })
              $scope.forgotpassword = function (isvalid) {
                  if (isvalid) {
                      if (typeof $scope.ForgotPassword !== "undefined")
                          $scope.invalidEmailMessage = [];
                      $$Login.ForgotPassword($scope.ForgotPassword)
                        .success(function (resp) {
                            toaster.success("A link to initiate password reset has been sent to your mail. Please check your email for further directions to log in to the system.");
                            $scope.closeThisDialog();
                        })
                        .error(function (err) {
                            $scope.invalidEmailMessage = [];
                            if (err.ModelState.UnregisteredEmail) {
                                $scope.invalidEmailMessage.push(err.ModelState);
                            }
                            else if (typeof err.ModelState.InsufficientPrivilege !== "undefined") {
                                $scope.invalidEmailMessage.push(err.ModelState);
                            }
                            else {
                                toaster.error("Something went wrong. Please try again");
                            }
                        })
                  }

              }
          }]
      }]);
});