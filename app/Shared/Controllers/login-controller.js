define([
    'app',
    'app/Shared/Services/login-service',
    'toaster',
    'app/Shared/Services/lookup-service',
    //'app/Shared/fzSubmit/Directives/fz-submit'
], function () {
        return angular.module('eruditeApp.Shared.LoginController', ['ui.router', 'toaster', 'ngCookies'])
        .controller('loginController', [
        '$scope', '$$Login', '$rootScope', '$state', 'toaster', '$cookies', '$$Lookup',
        function ($scope, $$Login, $rootScope, $state, toaster, $cookies, $$Lookup) {
            $scope.Login = {};
            $scope.loginErrorMessage = [];
            //Fetch all Accounts from database
            $$Lookup.GetAccounts()
              .success(function (resp) {
                  $scope.Login.Accounts = resp;
              });
            $cookies.put('userloggedin', '');
            $scope.Submit = function (isvalid) {
                if (isvalid) {
                    $scope.loginErrorMessage = [];
                    var loginRequest = {};
                    loginRequest.Email = $scope.Login.Email;
                    loginRequest.Password = $scope.Login.Password;
                    loginRequest.CollageID = $scope.Login.CollageID;
                    $$Login.Validate(loginRequest)
                      .then(function (resp) {
                          if (resp) {
                              $$Login.GetUserContext()
                                .then(function () {
                                    $state.go('app.user');
                                });
                          }
                      })
                      .catch(function (err) {
                          if (err && err.ModelState) {
                              var modelState = err.ModelState;
                              $scope.HandleServerErrors(modelState);
                              if ($scope.loginErrorMessage.length == 0) {
                                  if (modelState.LoginDisabled) {
                                      toaster.error("You do not have sufficient privilege to log in. Please consult your administrator");
                                  } else if (modelState.AccountLocked) {
                                      toaster.error("Account Locked. Please contact administrator");
                                  }
                              }
                          }
                      });
                }
            };
            $scope.HandleServerErrors = function (modelState) {
                $scope.loginErrorMessage = [];
                if (modelState.AccountLocked || modelState.LoginDisabled || modelState.IncorrectEmailPassword || modelState.NoLoginAccess) {
                    $scope.loginErrorMessage.push(modelState);
                }

            };
        }
        ]);
    });