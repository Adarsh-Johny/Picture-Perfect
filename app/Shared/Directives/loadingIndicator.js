
define(['angular'], function() {
  return angular.module('loadingIndicator', [])
    .directive('loadingIndicator', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: "<div  data-ng-class='isLoading?\"active\":\"\"' class='loading-indicator'> Loading...</div>",
        link: function(scope, elm, attrs) {
          scope.$watch(scope.isLoading, function(v) {});
        }
      };
    }]);
});
