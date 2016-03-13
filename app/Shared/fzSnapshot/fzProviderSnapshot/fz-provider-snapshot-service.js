/*global angular*/
//(function (angular, undefined) {
define(['angular',
    'app/eruditeconfig'

], function () {
    'use strict';
    return angular.module('eruditeApp.Shared.ProviderSnapshotService', [])
      .service('$$ProviderSnapshot', ['$q', '$http', 'ERUDITE_CONFIG', function ($q, $http, ERUDITE_CONFIG) {
          var apiUrl = ERUDITE_CONFIG.baseUrl;         
          this.getProviderSnapshotDetails = function (providerID) {
              var deferred = $q.defer(),
                  promise = deferred.promise;
              $http.get(apiUrl + 'user/provider-snapshot/' + providerID)
                               .then(function (resp) {                                                                
                                   deferred.resolve( new ProviderSnapshot(resp.data));
                               })
                               .catch(function (error) {
                                   deferred.reject(error.data);
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
      }]);
    function ProviderSnapshot(providerSnapshot) {
        var p = providerSnapshot || {};
        this.ProviderProfile = new ProviderProfile(p.ProviderProfile);
        this.ProductionModel = new ProductionModel(p.Payor);
        this.AppointmentsModel = new AppointmentsModel(p.AppointmentsModel);

    };
    function ProviderProfile(providerProfile) {
        var p = providerProfile || {};
        this.ProviderID = p.ProviderID || "";
        this.Speciality = p.Speciality || "";
        this.ProviderName = p.ProviderName || "";
        this.LinkedLocations = p.LinkedLocations || "";
        this.LinkedPatients = p.LinkedPatients || "";
        this.Phone1 = p.Phone1 || "";
        this.Phone2 = p.Phone2 || "";
        this.Email = p.Email || "";
    };
    function ProductionModel(providerProfile) {
        var p = providerProfile || {};
        this.Surgery = p.Surgery || "";
        this.General = p.General || "";
        this.Emergency = p.Emergency || "";
        this.Unplanned = p.Unplanned || "";
    };
    function AppointmentsModel(providerProfile) {
        var p = providerProfile || {};
        this.TotalAppointmentsToday = p.TotalAppointmentsToday || "";
        this.AvailableTimeToday = p.AvailableTimeToday || "";
        this.Loc = p.Loc;
    };
});