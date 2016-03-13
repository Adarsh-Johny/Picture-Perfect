define(['angular', 'xtForm'], function () {
    return angular.module('eruditeApp.Shared.FormSubmitDirective', [])
    .directive('fzSubmit', ['$parse', function ($parse) {

        return {
            restrict: 'E',
            require: ['^?form', '^?xtForm'],
            replace: true,
            templateUrl: '/app/Shared/fzSubmit/Templates/fz-submit.html',
            link: function (scope, elm, attrs, ctrl) {
                var form = ctrl[0];
                var xtform = ctrl[1];
                var fn;

                scope.cssClass = attrs.classList || "fz-button fz-button-blue";

                scope.$watch('isLoading', function (newValue, oldValue) {
                    if (newValue) {
                        $(elm).prop('disabled', true)
                    }
                    else
                    {
                        $(elm).prop('disabled', false)
                    }

                })

                elm.bind("click keydown", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    scope.$apply(function () {
                        var keycode = event.keyCode;
                        if (angular.isUndefined(keycode) || keycode == 13) {
                            xtform.submit().then(function () {
                                if (form.$valid) {

                                    if (fn) {
                                        fn(scope, { $event: event });
                                    }
                                }
                            }, function () {

                            });
                        }
                    });
                });

                if (angular.isDefined(attrs.function)) {
                    fn = $parse(attrs['function']);
                }
            }
        };
    }]);
});
