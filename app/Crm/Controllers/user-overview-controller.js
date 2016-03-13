
define(["app",
  'app/Shared/Directives/header-directive',
    'app/Shared/Services/login-service',
  'app/Shared/InfoPane/Directives/infoPane-directive',
  'app/Shared/Services/lookup-service',
  'app/Shared/fzDropdown/Directives/new-dropdown',
    'app/Shared/fzClose/Directives/fz-close',
    'app/Shared/fzSubmit/Directives/fz-submit',
    'app/Shared/fzCancel/Directives/fz-cancel',
    'toaster',
    'app/Shared/fzFile/Directives/fz-file'], function () {
        return angular.module('eruditeApp.User.OverviewController', [
          'eruditeApp.SharedModule',
          'toaster'
        ])
        .controller('userOverviewController', ['$scope','toaster','$$Lookup', '$$Login',
          function ($scope, toaster, $$Lookup, $$Login) {
              var date = new Date();

              $scope.uiState = {};
              $scope.uploadModel = {};           


              $scope.dates = [];
              $scope.dates2 = [];
              $scope.dates.push(date);

              $scope.dateOptions = {
                  dateFormat: "d MMM, yyyy",
              };
          }
        ]);
    });
