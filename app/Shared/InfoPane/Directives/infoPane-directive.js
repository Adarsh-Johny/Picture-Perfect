//define(["angular", 'app/Patient/Shared/patient-service', 'app/Patient/Shared/patient-context-service' ], function () {
//    'use strict';

//    var patientInfoPaneController = ['$scope', '$$Patient', '$$PatientContext', 'toaster',
//        function ($scope, $$Patient, $$PatientContext, toaster) {
//            getpatientInfoPane($$PatientContext.$PatientID);
//            function getpatientInfoPane(patientID) {
//                $$Patient.getPatientInfoPane(patientID)
//                   .success(function (resp) {                     
//                       $scope.PatientInfoPane = resp;
//                   })
//                   .error(function (err) {
//                   });
//            }

//            $scope.$on('context-patient-edited', function () {
//                getpatientInfoPane($$PatientContext.$PatientID);
//            });
//        }];

//    return angular.module('eruditeApp.Shared.InfoPaneDirective', ['ui.router'])
//          .controller('patientInfoPaneController', patientInfoPaneController)
//      .directive('userInfoPane', [function () {
//          return {
//              restrict: 'E',
//              replace: true,
//              templateUrl: '/app/Shared/InfoPane/Templates/user-info-pane.html'
//          }
//      }])
//      .directive('patientInfoPane', [function () {
//          return {
//              restrict: 'E',
//              replace: true,
//              templateUrl: '/app/Shared/InfoPane/Templates/patient-info-pane.html',
//              controller: 'patientInfoPaneController'
//          }
//      }])
//      .directive('setupInfoPane', [function () {
//          return {
//              restrict: 'E',
//              replace: true,
//              templateUrl: '/app/Shared/InfoPane/Templates/setup-info-pane.html'
//          }
//      }]);
//});