define(['angular','app/Shared/Services/login-service'], function () {
    return angular.module('eruditeApp.Shared.UiTrimDirective', [])
        .directive("fzUiTrim", ['$state', '$rootScope', '$$Login', function ($state, $rootScope, $$Login) {
            return {
                restrict: "A",
                scope: {},
                link: function (scope, element, attrs, modelCtrl) {
                    var privilege = 'VIEW';
                    var privilageIdAttrs = attrs.privilegeId || '';
                    var privilageIdAttrs = privilageIdAttrs.split(',').map(function (n) {
                        return parseInt(n);
                    });
                    var privilegeId = isNaN(privilageIdAttrs[0]) ? $state.current.privilegeId : privilageIdAttrs;
                    attrs.$observe('fzUiTrim', function (value) {
                        if (value) {
                            privilege = value.toUpperCase();
                            if (!$$Login.CheckPrivileges(privilegeId, privilege)) {
                                element.hide();
                            }
                        }
                    });

                    $rootScope.$on('ProfileSwitched', function () {
                        privilege = angular.isDefined(attrs.fzUiTrim) ? attrs.fzUiTrim.toUpperCase() : "VIEW";
                        if (!$$Login.CheckPrivileges(privilegeId, privilege)) {
                            element.hide();
                        } else {
                            element.show();

                        }
                    });

                }
            };
        }]);
});