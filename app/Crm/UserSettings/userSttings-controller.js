/*global console,angular*/

define(['angular',
'app/User/UserSettings/userSettings-service',
'app/Shared/Services/DialogService',
'app/Shared/fzSubmit/Directives/fz-submit',
'app/Shared/fzCancel/Directives/fz-cancel',
'ngDialog'], function () {

  return angular.module('eruditeApp.User.UserSettingsController',[
  'eruditeApp.User.UserSettingsService',
  'ngEnter',
  'toaster',
  'ui.router'

]).controller('userSettingsController', ['$scope', '$$UserSettings', 'toaster', '$$DialogConfirm','$$Login','$state',
  function($scope, $$UserSettings, toaster, $$DialogConfirm,$$Login,$state) {

    //initialise

    $scope.isEditable = false;
    $scope.availableProfiles = [];
    $scope.loadUserDetails = function() {
      $$UserSettings.GetUserDetails()
        .success(function(resp) {

          $scope.userSettings = resp;
          $scope.loadUserPrfilesAndLocations();

          $scope.userSettingsMaster = angular.copy($scope.userSettings);

        })
        .error(function(error) {
          toaster.error("Something went wrong");
        });
    }
    $scope.loadUserPrfilesAndLocations = function() {

      $$UserSettings.GetProfiles()
        .success(function(resp) {

          $scope.availableProfiles = resp.filter(function(profile) {
            console.log(profile);
            var selectedprofiles = $scope.userSettings.UserProfile.filter(function(Id) {
              return profile.ProfileID == Id;
            });
            return selectedprofiles.length > 0;
          });
        })
        .error(function(err) {
          toaster.error("Error loading locations.");

        });

      $$UserSettings.GetLoctions()
        .success(function(resp) {

          if (resp.length > 0) {
            if ($scope.userSettings.UserLocation.indexOf(null) > -1) {
              resp.unshift({
                'LocationID': null,
                'LocationName': "All",
                'ShortName': 'All'
              });
              $scope.availableLocations = resp;
            } else {
                if(!$scope.userSettings.UserLocation.contains($scope.userSettings.DefaultLocationID)){ $scope.userSettings.DefaultLocationID = null};
              var locatons = resp.filter(function(location) {
                var selectedlocations = $scope.userSettings.UserLocation.filter(function(Id) {

                  return location.LocationID == Id;

                });
                return selectedlocations.length > 0;
              });
              if (locatons.length > 0) {
                locatons.unshift({
                  'LocationID': null,
                  'LocationName': "All",
                  'ShortName': 'All'
                });
              }
              $scope.availableLocations = locatons;
            }
          }
        }).error(function(err) {
          toaster.error("Error loading locations.");
        });
    }
    $scope.updateUserDetails = function() {
    	
		$$UserSettings.UpdateUserDetails($scope.userSettings)
	    .success(function(resp) {
	      $scope.toggleViewMode(false);
	      $scope.userSettingsMaster = angular.copy($scope.userSettings);
	      toaster.success("User Settings updated succesfully");
		  refreshRootScope();
	    })
	    .error(function(error) {
	      toaster.error("Something went wrong");
	    });

    };
	
	function refreshRootScope(){
		$$Login.GetUserContext();
	}
    $scope.toggleViewMode = function(value) {
      $scope.isEditable = value;
    }
    $scope.resetForm = function() {
      $scope.isEditable = false;
      $scope.userSettings = angular.copy($scope.userSettingsMaster);

    }
    $scope.loadUserDetails();

  }
]);
});
