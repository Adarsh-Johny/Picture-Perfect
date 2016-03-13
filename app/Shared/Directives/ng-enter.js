angular.module('ngEnter',[])
.directive('ngEnter',[function(){
  return function(scope,element,attrs){
    element.bind("keydown keypress",function(event){
      if(event.which === 13){
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
}])
    .directive("updateModelOnEnter", function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elem, attrs, ngModelCtrl) {
      elem.bind("keyup",function(e) {
        if (e.keyCode === 13) {
          scope.$apply(function() {
            ngModelCtrl.$commitViewValue();
          });
        }
      });
    }
  }
});
