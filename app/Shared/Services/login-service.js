define(["angular", 
		'app/eruditeconfig',
		'angular-cookies',		
     	'app/Shared/ngIdle/ngIdle-localStorage'], function () {
    return angular.module('eruditeApp.Shared.LoginService', ['ngCookies','ngIdle.localStorage'])
    .service('$$Login', ['$http', 'ERUDITE_CONFIG', '$rootScope', "$q", "$cookies","IdleLocalStorage",
    function ($http, ERUDITE_CONFIG, $rootScope, $q, $cookies,IdleLocalStorage) {
        var baseurl = ERUDITE_CONFIG.baseUrl;
        this.Logout = function () {
            var deferred = $q.defer();
            $http.post(baseurl + 'login/logout', {})
              .then(function () {
                  deferred.resolve();
              })
              .catch(function (err) {
                  console.error("something went wrong while logging out from the web api", err);
                  deferred.reject(err);
              });
            $cookies.put('userloggedin', '');
            IdleLocalStorage.remove('alertOnLoadShowed');
            return deferred.promise;
        };
        this.Validate = function (Login) {
            var deferred = $q.defer();
            $http.post(baseurl + 'login', Login)
              .success(function (resp) {
                  $cookies.put('userloggedin', 'true');
                  deferred.resolve(resp);
              })
              .error(function (err) {
                  $cookies.put('userloggedin', '');
                  deferred.reject(err);
              });

            return deferred.promise;
        };
        this.GetUserContext = function () {

            var deferred = $q.defer();
            $http.post(baseurl + 'setup/user/get-user-login-context')
              .success(function (resp) {
                  $rootScope.User = {};
                  $rootScope.User = resp;
                  if (typeof $rootScope.User != "undefined") {
                      $rootScope.User.ActiveProfileName = $rootScope.User.userProfile.filter(function (profile) {
                          return profile.ProfileID == $rootScope.User.ActiveProfileID;
                      })[0].ProfileName;
                  }
                  deferred.resolve(true);
              })
              .error(function (err) {
                  console.error(err);
                  deferred.reject(false);
              });
            return deferred.promise;
        };
        this.SwitchProfile = function (profileID) {
            return $http.post(baseurl + 'user/switch-profile/' + profileID);
        };

        this.CheckPrivileges = function (privilegeIDs, privilege) {
            if (typeof privilege == "undefined") {
                privilege = 'VIEW';
            }
            privilegeArray = privilege.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/);
            if (typeof $rootScope.User != "undefined") {
                var childProfiles = [];

                if (!angular.isUndefined(privilegeIDs) && privilegeIDs.constructor === Number) {
                    childProfiles = $rootScope.User.ActiveUserProfile.filter(function (child) {
                        return child.ParentID == privilegeIDs;
                    });
                } else if (!angular.isUndefined(privilegeIDs) && privilegeIDs.constructor === Array) {
                    $.each(privilegeIDs, function (i, v) {
                        var tempchildren = $rootScope.User.ActiveUserProfile.filter(function (child) {
                            return child.ParentID == v;
                        });
                        $.merge(childProfiles, tempchildren);
                    });
                }
                if (childProfiles.length > 0) {

                    for (var i = 0; i < childProfiles.length; i++) {
                        var activeProfile = childProfiles[i];

                        if (!angular.isUndefined(privilegeIDs) && privilegeIDs.constructor === Array) {

                            for (var j = 0; j < privilegeArray.length; j++) {
                                if (activeProfile.AllowedPrivileges.indexOf(privilegeArray[j]) > -1) {
                                    return true;
                                }
                            }
                        } else if (!angular.isUndefined(privilegeIDs) && privilegeIDs.constructor === Number) {
                            for (var j = 0; j < privilegeArray.length; j++) {
                                if (activeProfile.AllowedPrivileges.indexOf(privilegeArray[j]) > -1) {
                                    return true;
                                }
                            }
                        }
                    }

                } else {
                    for (var i = 0; i < $rootScope.User.ActiveUserProfile.length; i++) {
                        var activeProfile = $rootScope.User.ActiveUserProfile[i];
                        if (!angular.isUndefined(privilegeIDs) && privilegeIDs.constructor === Array) {

                            for (var j = 0; j < privilegeArray.length; j++) {
                                if (privilegeIDs.indexOf(activeProfile.PrivilegeID) > -1 && activeProfile.AllowedPrivileges.indexOf(privilegeArray[j]) > -1) {
                                    return true;
                                }
                            }
                        } else if (!angular.isUndefined(privilegeIDs) && privilegeIDs.constructor === Number) {
                            for (var j = 0; j < privilegeArray.length; j++) {
                                if (activeProfile.PrivilegeID == privilegeIDs && activeProfile.AllowedPrivileges.indexOf(privilegeArray[j]) > -1) {
                                    return true;
                                }
                            }
                        }
                    }

                }
            }
            return false;
        };

        this.ForgotPassword = function (model) {
            return $http.post(baseurl + 'Login/forgot-password', model);
        };

        this.keepAlive = function () {
            return $http.post(baseurl + 'Login/session-keep-alive', {});
        }
    }
    ]);
});