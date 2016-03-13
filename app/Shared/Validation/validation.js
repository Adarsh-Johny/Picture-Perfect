// var validation = angular.module('eruditeApp.Shared.Validation');
//
// validation.directive("telephone", function () {
//         return {
//             restrict: "A",
//             require: "?ngModel",
//             link: function (scope, element, attributes, ngModel) {
//                 ngModel.$validators.telephone = function (modelValue) {
//                     if (modelValue == "ACME") {
//                         return true;
//                     }
//                     else return false;
//                 };
//             }
//         };
//     });
//
//     app.directive("firstname", function () {
//         return {
//             restrict: "A",
//             require: "?ngModel",
//             link: function (scope, element, attributes, ngModel) {
//                 ngModel.$validators.firstname = function (modelValue) {
//                     if (modelValue == "Tony" || modelValue == "John") {
//                         return true;
//                     }
//                     else return false;
//                 };
//             }
//         };
//     });
//
//
//     app.directive("userexists", function ($q, $timeout) {
//
//         var CheckUserExists = function (name) {
//             if (name == "Tony") {
//                 return true;
//             }
//             else if (name == "John") {
//                 return false;
//             }
//             else {
//                 return false;
//             }
//         };
//
//         return {
//             restrict: "A",
//             require: "ngModel",
//             link: function (scope, element, attributes, ngModel) {
//                 ngModel.$asyncValidators.userexists = function (modelValue) {
//                     var defer = $q.defer();
//                     $timeout(function () {
//                         if (CheckUserExists(modelValue)) {
//                             defer.resolve();
//                         } else {
//                             defer.reject();
//                         }
//                     }, 2000);
//                     return defer.promise;
//                 }
//             }
//         };
//     });
