define(['angular', 'xtForm'], function () {
    return ﻿angular.module('eruditeApp.Shared.FormCancelDirective', [])
    .directive('fzCancel', ['$parse', '$timeout', function ($parse, $timeout) {

        return {
            restrict: 'E',
            require: ['^?form', '^?xtForm'],
            replace: true,
            templateUrl: '/app/Shared/fzCancel/Templates/fz-cancel.html',
            link: function (scope, elm, attrs, ctrl) {
                var form = ctrl[0];
                var xtform = ctrl[1];
                var fn;
                elm.bind("click", function (event) {
                    $timeout(function () {
                      xtform.reset();

                            if (fn) {
                                fn(scope, { $event: event });
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
