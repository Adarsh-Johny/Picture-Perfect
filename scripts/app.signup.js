/*global angular,console*/
angular.module('signupApp', ['eruditeApp.Config', 'toaster', 'ui.mask'])
  .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.defaults.withCredentials = true;
  }])
  .service('$$Signup', ['$http', 'ERUDITE_CONFIG', function ($http, ERUDITE_CONFIG) {
      var urlBase = ERUDITE_CONFIG.baseUrl;
      this.Create = function (model) {
          return $http.post(urlBase + 'setup/account/sign-up', model); //need verification
      };
  }])
  .controller('signupController', [
    '$scope', '$$Signup', 'toaster',
    function ($scope, $$Signup, toaster) {

        $scope.submit = function (isvalid) {
            if (isvalid) {
                var model = new SignupModel($scope.Signup);
                $$Signup.Create(model)
                  .success(function (resp) {
                      toaster.success("You have successfully signed up");
                      $scope.Signup = {};
                      $scope.submitted = false;
                      $scope.Signupform.$setPristine();
                      $scope.Signupform.$setUntouched();
                  })
                  .error(function (err) {
                      if (err.ModelState.DuplicateName) {
                          toaster.error("Account Name Already Exists");
                      } else {
                          toaster.error("Something went wrong, please try again.");
                      }
                      console.error(err);
                  });
            }
        };
    }
  ]);

function SignupModel(model) {
    var s = model || {};
    this.AccountName = s.AccountName || "";
    this.NPI = s.NPI || "";
    this.TaxID = s.TaxID || "";
    this.ShortName = s.ShortName || "";
    this.LocationName = s.LocationName || "";
    this.Website = s.Website || "";
    this.AddressLine1 = s.AddressLine1 || "";
    this.AddressLine2 = s.AddressLine2 || "";
    this.City = s.City || "";
    this.State = s.State || "";
    this.ZipCode = s.ZipCode || "";
    this.Phone1 = "";
    this.Phone2 = "";
    this.Phone1ext = s.Phone1ext || "";
    this.Phone2ext = s.Phone2ext || "";
    if (typeof s.Phone1only !== "undefined" && s.Phone1only !== ""){
        this.Phone1 = (s.Phone1only + (this.Phone1ext !== "" ? (this.Phone1ext = " x" + this.Phone1ext) : ""));
    }
    if (typeof s.Phone2only !== "undefined" && s.Phone2only !== ""){
        this.Phone2 = (s.Phone2only + (this.Phone2ext !== "" ? (this.Phone2ext = " x" + this.Phone2ext) : ""));
    }
    this.Fax = s.Fax || "";
    this.Email = s.Email || "";
    this.AdminEmail = s.AdminEmail || "";
    this.AdminLastName = s.AdminLastName || "";
    this.AdminFirstName = s.AdminFirstName || "";
    this.AdminPrefix = s.AdminPrefix || "";
    this.AdminSuffix = s.AdminSuffix || "";
    this.AdminMiddleName = s.AdminMiddleName || "";
}
