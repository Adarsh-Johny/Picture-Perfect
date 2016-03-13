define(['angular',
    'app/Shared/Services/login-service',
], function () {
    var LeftPaneController = ['$$Login', "$scope", "$rootScope", function ($$Login, $scope, $rootScope) {
        $scope.parentPrivilegeIDs = function (y) {
            return y.map(function (x) {
                return x.PrivilegeID;
            });
        };
        $scope.CheckPrivilege = function (id, privilege) {
            return $$Login.CheckPrivileges(id, privilege);
        };
    }];
    return angular.module('eruditeApp.Shared.LeftPaneDirective', [])
      .directive('leftPane', [function () {
          return {
              restrict: 'E',
              replace: true,
              templateUrl: '/app/Shared/LeftPane/Templates/leftPane.html',
              controller: LeftPaneController
          }
      }])
      .directive('accordion', ['$document', '$state', function ($document, $state) {
          return {
              restrict: 'E',
              scope: {
                  data: '='
              },
              templateUrl: '/app/Shared/LeftPane/Templates/accordion.html',
              controller: LeftPaneController,
              link: function (scope, element, attributes) {
                  for (var i in scope.data.SubSection) {
                      var route = scope.data.SubSection[i].Link;
                      if ($state.includes('**' + route)) {
                          element.addClass('open');
                      }
                  }
                  scope.accordionClick = function () {
                      if (element.hasClass('open')) {
                          $document.find('accordion .accordion-child').slideUp('fast', function () {
                              $document.find('accordion').removeClass('open');
                          });
                      } else {
                          $document.find('accordion .accordion-child').slideUp('fast', function () {
                              $document.find('accordion').removeClass('open');
                          });
                          element.find('.accordion-child').slideDown('fast', function () {
                              element.addClass('open');
                          });
                      }
                  }
              }
          }
      }])
      .directive('setupPane', [function () {
          return {
              restrict: 'E',
              replace: true,
              templateUrl: '/app/Shared/LeftPane/Templates/setupPane.html',
              controller: LeftPaneController
          }
      }])
      .directive('locationPane', [function () {
          return {
              restrict: 'E',
              replace: true,
              templateUrl: '/app/Shared/LeftPane/Templates/locationPane.html',
              controller: LeftPaneController
          }
      }])
      .directive('userPane', [function () {
          return {
              restrict: 'E',
              replace: true,
              templateUrl: '/app/Shared/LeftPane/Templates/userPane.html',
              controller: LeftPaneController
          }
      }])
      .directive('patientPane', [function () {
          return {
              restrict: 'E',
              replace: true,
              templateUrl: '/app/Shared/LeftPane/Templates/patientPane.html',
              controller: LeftPaneController
          }
      }]);
    
});