/*global angular,define*/
define(['angular', 'app/Shared/fzDropdown/Directives/fz-dropdown'], function () {
    return angular.module("eruditeApp.Shared.Dropdown", [])

    .directive('fzDropdownComponent', function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                model: '=',
                mainModel: '='
            },
            controller: ['$scope', function ($scope) {
                if (angular.isDefined($scope.model.children))
                    angular.forEach($scope.model.children, function (child) {
                        child.status = false;
                    });

            }],
            templateUrl: "/app/Shared/fzDropdown/Templates/fz-dropdown-component.html",

            //template: "<div fz-dropdown='bottom-right' <a><i class='fa fa-angle-down'> </i></a>	<div ng-if='model.children'><fz-dropdown-children ng-repeat='items in model.children' children='items'></fz-dropdown-children></div><div ng-if='!model.children'><fz-dropdown-children ng-repeat='items in model' children='items'></fz-dropdown-children></div></div>"
        }
    })

    .directive('fzDropdownChildren', function ($compile) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                children: '=',
                mainModel: '='
            },
            controller: ['$scope', function ($scope) {
                //Clicked on value
                $scope.openDropDown = function (value) {
                    $scope.mainModel.count = $scope.mainModel.count || 0;
                    if ($scope.mainModel.count > 1) {

                    }
                    {
                        if (angular.isDefined($scope.mainModel.oldvalue)) {
                            $scope.mainModel.levelStatus = false;
                            angular.forEach($scope.mainModel.oldvalue.children, function (child) {
                                child.status = false;
                            })
                        }
                        angular.forEach(value.children, function (child) {
                            child.status = true;
                            value.levelStatus = true;
                        })
                        $scope.mainModel.activeHash = value.$$hashKey;
                        $scope.mainModel.oldvalue = value;
                    }
                }

                //Clicked on value
                $scope.openDropDown = function (value) {
                    var Activevalue = '';
                    if (angular.isDefined($scope.mainModel.CurrentActivePath) && $scope.mainModel.CurrentActivePath.length > 0) {
                        Activevalue = $scope.mainModel.CurrentActivePath.split(':');
                    }
                    else if (angular.isUndefined($scope.mainModel.CurrentActivePath)) {
                        Activevalue = value.menuColumT;
                    }
                    else {
                        Activevalue = $scope.mainModel.CurrentActivePath;
                    }

                    if (((Object.keys(value.menuColumT).length === Object.keys(Activevalue).length))) {
                        if (Object.keys(Activevalue).length > 1) {
                            switch (Activevalue.length) {
                                case 2: $scope.mainModel.children[Activevalue[0]].children[Activevalue[1]].children.forEach(function (c) {
                                    c.active = false;
                                    c.status = false;
                                    $scope.mainModel.children[Activevalue[0]].children[Activevalue[1]].active = false;
                                    $scope.mainModel.children[Activevalue[0]].levelStatus = false;
                                });
                                    break;

                                case 3: $scope.mainModel.children[Activevalue[0]].children[Activevalue[1]].children.forEach(function (c) {
                                    c.active = false;
                                    c.status = false;
                                    $scope.mainModel.children[Activevalue[0]].children[Activevalue[1]].children[Activevalue[2]].active = false;
                                    $scope.mainModel.children[Activevalue[0]].children[Activevalue[1]].levelStatus = false;

                                });
                                    break;
                            }
                        }
                        else if ($scope.mainModel.CurrentActivePath === value.menuColumT) {
                            $scope.mainModel.children[Activevalue].children.forEach(function (c) {
                                c.status = false;
                                c.active = false;
                            })
                            $scope.allStatus = true;
                            $scope.mainModel.children[Activevalue].children.levelStatus = false;
                        }

                    else {
                            if ($scope.mainModel.children[Activevalue].children && (angular.isUndefined($scope.allStatus) || $scope.allStatus !== true)) {
                            $scope.mainModel.children[Activevalue].children.forEach(function (c) {
                                c.status = false;
                                c.active = false;
                            })
                            $scope.mainModel.children[Activevalue].active = false;
                            // $scope.mainModel.levelStatus = false;
                        }
                        else {
                            $scope.mainModel.children[Activevalue].active = false;
                            // $scope.mainModel.levelStatus = false;
                        }
                    }
                }

                $scope.mainModel.CurrentActivePath = value.menuColumT;
                value.active = true;
                if (angular.isDefined(value.children)) {
                    value.children.levelStatus = true;
                }
                angular.forEach(value.children, function (child) {
                    child.status = true;
                    child.active = true;
                })
                value.active = true;
                //value.children.levelStatus = true;
            }


            }],
            templateUrl: "/app/Shared/fzDropdown/Templates/dropdown-component.html",
            link: function (scope, element, attrs) {
                if (angular.isDefined(scope.children) && angular.isDefined(scope.children.children) && angular.isArray(scope.children.children)) {
                        scope.children.children.currentStatus = false;
                    angular.forEach(scope.children.children, function (child) {
                        child.status = false;
                    })
                        element.append("<fz-dropdown-component main-model='mainModel'  model='children.children'></fz-dropdown-component>");
                    $compile(element.contents())(scope)
                }
            }
        }
    })

});
