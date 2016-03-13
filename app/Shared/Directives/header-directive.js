/// <reference path="../fzDropdown/Directives/fz-dropdown.js" />
define(["angular",
     'ngDialog',
     'app/Shared/fzDropdown/Directives/fz-dropdown',
     'app/Shared/Services/signalREventRegister',
     'app/Shared/Services/signalREventService',
     'app/Shared/fzUiTrim/fz-UiTrim',
     'app/Shared/ngIdle/fz-idle',
     'app/Shared/ngIdle/ngIdle-localStorage'

], function () {

    return angular.module('eruditeApp.Shared.HeaderDirective',
        [           
            'ngIdle.localStorage'
        ])
  //.directive('fuzeHeader', ['$$PatientAddModal', '$$AddAppointmentModal', '$$Alert', '$$Documents', '$$PrescriptionModalService', '$$AddNoteModalService', function ($$PatientAddModal, $$AddAppointmentModal, $$Alert, $$Documents, $$PrescriptionModalService, $$AddNoteModalService) {
  //    var headerController = ['$scope', '$rootScope', '$state', '$$PrescriptionContext', '$$SignalREventRegister', '$$SignalREventService', 'toaster', function ($scope, $rootScope, $state, $$PrescriptionContext, $$SignalREventRegister, $$SignalREventService, toaster) {

  .directive('fuzeHeader', [
      function () {
          var headerController = ['$scope', '$rootScope', '$state', 'toaster', '$$SignalREventRegister', '$$SignalREventService', '$$DialogConfirm', '$$Login', 'IdleLocalStorage',
          function ($scope, $rootScope, $state, toaster, $$SignalREventRegister, $$SignalREventService, $$DialogConfirm, $$Login, $$PaymentModalService, IdleLocalStorage) {






              $scope.showUserMenu = false;
              $scope.toggleUserMenu = function () {
                  $scope.showUserMenu = !$scope.showUserMenu;
                  $scope.userMenuStyle = {
                      'display': $scope.showUserMenu ? 'block' : 'none'
                  };
              };

              //signal r
              var updateAlertCount = function (alert) {
                  if (alert.Type == "Profiles") {
                      $rootScope.AlertCount = alert.Count;
                      if (alert.Alert != null) {
                          var alertModel = [];
                          alertModel.push(alert.Alert);
                          $$Alert.openAlert(alertModel, "Profile");
                      }
                  }
                  else if (alert.Type == "Patients") {
                      if (alert.Alert != null) {
                          var alertModel = [];
                          alertModel.push(alert.Alert);
                          $$Alert.openAlert(alertModel, "Patients");
                      }
                  }
                  console.log('alert', alert);
              };




              $rootScope.$on('ProfileSwitched', updateprofilealertcountAndDialog);
              $scope.$on('$destroy', function iVeBeenDismissed() {
                  // say goodbye to your controller here
                  // release resources, cancel request...
                  $$SignalREventRegister.UnRegister('updateAlertCount');
                  $$SignalREventRegister.UnRegister('updatedUserDetails');
              });
              //signalr sample end
          }];
          return {
              restrict: 'E',
              replace: true,
              controller: headerController,
              templateUrl: '/app/Shared/Templates/header.html'
          };
      }]);
//.directive('fuzeDropdown', ['$document', function ($document) {
//    return {
//        restrict: 'E',
//        scope: {},
//        transclude: true,
//        replace: true,
//        templateUrl: '/app/Shared/Templates/profileDropDown.html',
//        controller: ['$rootScope', '$scope', '$element', '$$Login', 'toaster', '$state', function ($rootScope, $scope, $element, $$Login, toaster, $state) {
//            $scope.toggleUserMenu = function () {
//                $scope.showUserMenu = !$scope.showUserMenu;
//                $scope.userMenuStyle = {
//                    'display': $scope.showUserMenu ? 'block' : 'none'
//                };
//            };
//            if (typeof $rootScope.User != "undefined") {
//                $scope.AvailableProfiles = $rootScope.User.userProfile;
//                $scope.CurrentProfileID = $rootScope.User.ActiveProfileID;
//            }
//            $scope.SwitchProfile = function (profileID, profileName) {
//                $$Login.SwitchProfile(profileID)
//                  .success(function (resp) {
//                      $rootScope.User.ActiveProfileID = profileID;
//                      $rootScope.User.ActiveProfileName = profileName;
//                      $rootScope.User.ActiveUserProfile = resp;
//                      $rootScope.$broadcast('ProfileSwitched');
//                      $scope.CurrentProfileID = profileID;
//                      $scope.showUserMenu = !$scope.showUserMenu;
//                      $state.go('app.user.overview');
//                  })
//                  .error(function (err) {
//                      toaster.error("Profile switching failed.Please try again");
//                  });
//            };
//            $scope.Logout = function () {
//                $$Login.Logout()
//                  .then(function () {
//                      toaster.success("You have been successfully logged out");
//                  });
//                $state.go('login');
//            };
//        }],
//        link: function (scope, element, attr, ctrl) {
//            element.find('li > a').bind('click', function () {
//                scope.$apply(function () {
//                    scope.showUserMenu = false;
//                    scope.userMenuStyle = {
//                        'display': 'none'
//                    };
//                });
//            });
//            $document.bind('click', function (event) {
//                var isClickedElementChildOfPopup = element
//                  .find(event.target)
//                  .length > 0;

//                if (isClickedElementChildOfPopup) {
//                    return;
//                }

//                scope.$apply(function () {
//                    scope.showUserMenu = false;
//                    scope.userMenuStyle = {
//                        'display': 'none'
//                    };
//                });
//            });
//        }
//    };
//}]);
});
