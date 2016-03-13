define(['angular',
], function () {

return angular.module("eruditeApp.Shared.Utilities", [])

.directive("fzScrollAction", function() {
    return {
      restrict: "A",
      link: function(scope, element, attributes) {
        var raw = element[0];
        element.bind('scroll', function() {
          if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 10) {
            scope.$apply(attributes.fzScrollAction);
          }
        });
      }
    }
  })
  .directive('indeterminateCheckbox', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        return scope.$watch(attributes.indeterminateCheckbox, function(val) {
          return element.prop('indeterminate', !!val);
        });
      }
    };
  });
});
