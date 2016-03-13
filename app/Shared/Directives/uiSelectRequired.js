
define(['angular'], function () {
    return angular.module('uiSelectRequired', [])
            .directive('uiSelectRequired', function () {
                return {
                    restrict: 'A',
                    require: '?ngModel',
                    link: function (scope, elm, attrs, ctrl) {
                        var required = "false";

                        attrs.$observe('uiSelectRequired', function (value) {
                            required = value;
                            ctrl.$validate();
                        });

                        ctrl.$validators.uiSelectRequired = function (modelValue, viewValue) {
                            var determineVal;
                            if (required == "true") {
                                if (!angular.isUndefined(attrs.multiple)) {
                                    if (angular.isArray(modelValue)) {
                                        determineVal = modelValue;
                                    } else if (angular.isArray(viewValue)) {
                                        determineVal = viewValue;
                                    }
                                    else {
                                        return false;
                                    }
                                }
                                else {
                                    return !ctrl.$isEmpty(modelValue);
                                }
                                return determineVal.length > 0;
                            }
                            else {
                                return true;
                            }

                        };
                    }
                };
            });
});