/*global angular*/
//(function (angular, undefined) {
define(['angular',
    'app/eruditeconfig'

], function () {
    'use strict';
    return angular.module('eruditeApp.Shared.PayorSnapshotService', [])
      .service('$$PayorSnapshot', ['$q', '$http', 'ERUDITE_CONFIG', function ($q, $http, ERUDITE_CONFIG) {
          var apiUrl = ERUDITE_CONFIG.baseUrl;
          this.getPayorSnapshotDetails = function (payorID) {
              var deferred = $q.defer(),
                  promise = deferred.promise;
              $http.get(apiUrl + 'setup/payor/get-payor-snapshot/' + payorID)
                               .then(function (resp) {
                                   deferred.resolve(new PayorSnapshot(resp.data));
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
    function PayorSnapshot(payorSnapshot) {
        var p = payorSnapshot || {};
        this.Plan = new PlanModel(p.Plan);
        this.Payor = new ClaimPayorModel(p.Payor);
        this.Benefits = new BenefitModel(p.Benefits);
        this.Notes = new InsuranceNoteModel(p.Notes);
        this.Heading = new PayorSnapShotHeadingModel(p.Heading);

    };
    function PlanModel(plan) {
        var p = plan || {};
        this.PlanName = p.PlanName || "";
        this.CapitationFee = p.CapitationFee || "";
        this.EmployerName = p.EmployerName || "";
    };
    function ClaimPayorModel(claim) {
        var p = claim || {};
        this.PayorID = p.PayorID || "";
        this.Address = new Address(p.Address);
        this.Website = p.Website || "";
    };
    function BenefitModel(benefit) {
        var p = benefit || {};
        this.FamilyMaximum = p.FamilyMaximum || "";
        this.IndividualMaximum = p.IndividualMaximum || "";
        this.FamilyDeductible = p.FamilyDeductible || "";
        this.IndividualOrthoMaximum = p.IndividualOrthoMaximum || "";
        this.IndividualOrthoDeductible = p.IndividualOrthoDeductible || "";
        this.IndividualOrthoAgeLimit = p.IndividualOrthoAgeLimit || "";

    }
    function InsuranceNoteModel(insurance) {
        var p = insurance || {};
        this.Notes = p.Notes || "";       
    }
    function Address(addr) {
        var a = addr || {};
        this.AddressDetailID = a.AddressDetailID || 0;
        this.AddressLine1 = a.AddressLine1 || "";
        this.AddressLine2 = a.AddressLine2 || "";
        this.City = a.City || "";
        this.State = a.State || "";
        this.ZipCode = a.ZipCode || "";
    }
    function PayorSnapShotHeadingModel(payor) {
        var a = payor || {};
        this.PayorName = a.PayorName || "";
        this.PlanType = a.PlanType || "";
    }
});