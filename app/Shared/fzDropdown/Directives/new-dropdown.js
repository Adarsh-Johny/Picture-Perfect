/*global angular,define,console*/
define(['angular', 'app/Shared/fzDropdown/Directives/fz-dropdown'], function () {
    return angular.module("eruditeApp.Shared.NewDropdown", [])

    .directive('newDropDown', function ($compile, $document, $rootScope) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                model: '='
            },
            templateUrl: "/app/Shared/fzDropdown/Templates/fz-dropdown-component.html",
            link: function (scope, elem, attr) {
                $document.bind('click', function (e) {
                    if (!e.target.closest('.fz-dropdown')) {
                        if (angular.isUndefined($rootScope.freezeDropdown) || !$rootScope.freezeDropdown) {
                            $document.find('.fz-dropdown').removeClass('active');
                        }
                    }
                });
                $('[name="dropdownContainer"]').bind("click", function () {
                    if ($(this).parent().hasClass('active')) {
                        $document.find('.fz-dropdown').removeClass('active');

                    }
                    else {
                        $(this).parent().addClass('active');
                        scope.ppppp = true;
                        console.log("scope", scope);
                    }
                });
                scope.$on('openNewDropdown', function (event, data) {
                    $document.find('.fz-dropdown').removeClass('active');
                });
                scope.$on('closeNewDropdown', function (event, data) {
                    $document.find('.fz-dropdown').removeClass('active');
                });
            }
        };
    })
    .directive('newDropDownChildren', function ($compile, $document) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                child: '='
            },
            templateUrl: "/app/Shared/fzDropdown/Templates/fz-dropdown-children.html",

            link: function (scope, elem, attr) {
                scope.PositionHorizontal = scope.child.PositionHorizontal || "left";
                scope.PositionVertical = scope.child.PositionVertical || "top";
                scope.HasPermission = scope.child.HasPermission ? scope.child.HasPermission : true;
                scope.childPermission = true;
                if (angular.isDefined(scope.child.Children)) {
                    scope.child.Children.forEach(function (c) {
                        if (angular.isDefined(c.HasPermission) && c.HasPermission === false) {
                            scope.childPermission = false;
                        }
                    });
                }

                //Generate all children
                if (angular.isDefined(scope.child) && angular.isDefined(scope.child.Children)) {
                    elem.append("<div class='fz-dropdown-content' ng-show='{{childPermission}}'><ul class='dropdown-menu'><new-drop-down-children ng-repeat='subchild in child.Children' child = 'subchild'><new-drop-down-children></ul></div>");
                    $compile(elem.contents())(scope);
                }
                //click on an dropdown element
                elem.on('click', '> a', function () {
                    var isactive = false;
                    if (elem.hasClass('active')) {
                        isactive = true;
                        //elem.removeClass('active');
                    }
                    $document.find('.fz-dropdown').removeClass('active');
                    elem.parents('.fz-dropdown').addClass('active');
                    if (isactive) {
                        elem.removeClass('active');

                    } else {
                        elem.addClass('active');
                    }
                    if (elem.children('div').length == 0) {
                        $document.find('.fz-dropdown').removeClass('active');
                    }
                    $document.find('[name="dropdownContainer"]').removeClass('active');
                });

                scope.closeDropdown = function () {
                    scope.$emit("closeNewDropdown");
                };
            }
        };
    });
});

