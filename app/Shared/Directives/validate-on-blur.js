angular.module('validateOnBlur',[])
    .directive("validateOnBlur", [function() {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {},
            link: function(scope, element, attrs, modelCtrl) {
                element.on('blur', function () {
                    modelCtrl.$showValidationMessage = modelCtrl.$dirty;
                    element.addClass("has-visited");
                    scope.$apply();
                });
            }
        };
    }]);
