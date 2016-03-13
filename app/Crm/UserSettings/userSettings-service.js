
define(["angular",
    'ngDialog',
    'app/Shared/Services/lookup-service',
    'app/eruditeconfig'
  ], function () {
   return angular.module('eruditeApp.User.UserSettingsService', [])
  .service('$$UserSettings', ['$q', '$http', 'ERUDITE_CONFIG', function($q, $http, ERUDITE_CONFIG) {
    var apiUrl = ERUDITE_CONFIG.baseUrl;


    this.GetUserDetails = function() {
      return $http.get(apiUrl + 'user/user-settings/get');
    }
    this.UpdateUserDetails = function(userDetails) {

      return $http.post(apiUrl + 'user/user-settings/update', new UserDetails(userDetails));
    }
    this.GetProfiles = function() {
      return $http.get(apiUrl + 'lookups/get-profiles');
    }

    this.GetLoctions = function() {
      return $http.get(apiUrl + 'lookups/get-locations');
    }

    function UserDetails(e) {

      this.Prefix = e.Prefix || "";
      this.FirstName = e.FirstName || "";
      this.MiddleName = e.MiddleName || "";
      this.LastName = e.LastName || "";
      this.Suffix = e.Suffix || "";
      this.AddressDetail = new AddressDetail(e.AddressDetail) || "";
      this.DefaultProfileID= e.DefaultProfileID;
      this.DefaultLocationID= e.DefaultLocationID ||null;
      this.Phone = e.Phone || "";
      this.Mobile = e.Mobile || "";
      this.Email = e.Email || "";
    }

    function AddressDetail(e) {
      this.AddressLine1 = e.AddressLine1 || "";
      this.AddressLine2 = e.AddressLine2 || "";
      this.City = e.City || "";
      this.State = e.State || "";
      this.ZipCode = e.ZipCode || "";
    }

  }]);
});
