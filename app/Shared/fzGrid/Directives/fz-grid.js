define(['angular'], function () {
    return angular.module("eruditeApp.Shared.Grid", [])
  .directive("fzGrid", ['$timeout', '$compile', 'GRID_PAGE_SIZE', function ($timeout, $compile, GRID_PAGE_SIZE) {
      return {
          restrict: "E",
          scope: {
              model: '=',
              ongridload: '&',
              onrowclick: '&',
              onradiobtnclick: '&',
              onfilter: '&',
              oncommand: '&',
              onaction: '&',
              onlinkclick: '&'
          },
          controller: ['$scope', '$element', 'filterFilter', function ($scope, $element, filterFilter) {
              if (angular.isDefined($scope.model)&& angular.isUndefined($scope.model.actionPermission)) {
                  $scope.model.actionPermission = true;
              }
              if (angular.isDefined($scope.model) && angular.isUndefined($scope.model.infiniteScroll)) {
                  $scope.model.infiniteScroll = false;
              }

              if (angular.isDefined($scope.model) && !$scope.model.PageSize) {
                  $scope.model.PageSize = GRID_PAGE_SIZE;
              }

              this.setColumns = function (cols) {
                  $scope.model.cols = cols;
              };

              this.setSelect = function (select) {
                  if ($scope.model.actionPermission) {
                      $scope.gridrowselection = true;
                      $scope.model.cols.unshift({
                          title: "Select",
                          field: "selectionFeature",
                          filter: false,
                          disable: false,
                          permission: true
                      });
                  }
              };


              this.setRadioBtn = function (select) {
                  if ($scope.model.actionPermission) {
                      $scope.gridrowradiobtn = true;
                      $scope.model.cols.unshift({
                          title: "Select",
                          field: "radioBtnFeature",
                          filter: false,
                          disable: false,
                          permission: true
                      });
                  }
              };
              this.setActions = function (actions) {
                  $scope.actions = actions;
              }

              this.updatepagination = function () {
                  $scope.model.pagination = true;
              };
              $scope.$watch('model.colArray', function () {
                  angular.forEach($scope.model.cols, function (value) {
                      if (value.field != "Delete" && value.field != "selectionFeature" && angular.isDefined($scope.model.colArray) && $scope.model.colArray.indexOf(value.field) < 0) {
                          value.disable = true;
                      } else {
                          value.disable = false;
                      }
                  });
              })
              $scope.$watch('model.data', function () {
                  angular.forEach($scope.model.data, function (value, key) {
                      if (!("disableSelection" in value)) {
                          value.disableSelection = false;
                      }
                  });
                  $scope.updatePagination();
                  $scope.allRowsCount = filterFilter($scope.model.data, {
                      "disableSelection": false
                  }).length;
                  $scope.selectedRowsFunc();
              })
              $scope.gridLoad = function (isInfiniteScroll) {
                  if (isInfiniteScroll) {
                      $scope.ongridload({ isinfinitescroll: true });
                  } else {
                      $scope.ongridload();
                  }
              }
              $scope.rowClick = function (row) {
                  $scope.onrowclick({
                      row: row
                  });
              }
              $scope.radioButtonClick = function (row) {
                  $scope.onradiobtnclick({
                      row: row
                  });
              }


              $scope.filterClick = function (filter) {
                  $scope.model.PageIndex = 1;
                  $scope.onfilter({
                      filter: filter
                  })
              }
              $scope.commandClick = function (command) {
                  $scope.oncommand({
                      command: command
                  })
              }
              $scope.actionClick = function (action) {
                  if ($scope.model.selectedRowsCount > 0) {
                      $scope.onaction({
                          action: action
                      })
                  }
              }
              $scope.model.gridPrevDisabled = true;
              $scope.model.gridNextDisabled = true;
              $scope.updatePagination = function () {
                  if ($scope.model.PageIndex == 1) {
                      $scope.model.gridPrevDisabled = true;
                      $scope.model.gridFromRecord = 1;
                      if ($scope.model.PageSize >= $scope.model.gridTotalRecords) {
                          $scope.model.gridNextDisabled = true;
                          $scope.model.gridToRecord = $scope.model.gridTotalRecords;
                      } else {
                          $scope.model.gridNextDisabled = false;
                          $scope.model.gridToRecord = $scope.model.PageSize;
                      }
                  } else if ($scope.model.PageIndex > 1) {
                      $scope.model.gridPrevDisabled = false;
                      $scope.model.gridFromRecord = ($scope.model.PageSize * ($scope.model.PageIndex - 1)) + 1;
                      if ($scope.model.PageSize * $scope.model.PageIndex >= $scope.model.gridTotalRecords) {
                          $scope.model.gridNextDisabled = true;
                          $scope.model.gridToRecord = $scope.model.gridTotalRecords;
                      } else {
                          $scope.model.gridNextDisabled = false;
                          $scope.model.gridToRecord = $scope.model.PageSize * $scope.model.PageIndex;
                      }
                  }
              }
              $scope.nextPage = function () {
                  if (!$scope.model.gridNextDisabled) {
                      $scope.model.PageIndex++;
                      $scope.gridLoad();

                  }
              }
              $scope.prevPage = function () {
                  if (!$scope.model.gridPrevDisabled) {
                      $scope.model.PageIndex--;
                      if ($scope.model.gridToRecord != $scope.model.gridTotalRecords) {
                          $scope.model.gridToRecord = $scope.model.gridToRecord - ($scope.model.PageSize * 2);
                      }
                      $scope.gridLoad();
                  }
              }
              $scope.filterChange = function () {
                  for (var k in $scope.model.filters) {
                      if ($scope.model.filters[k] == "") {
                          delete $scope.model.filters[k];
                      }
                  }

                  $scope.$emit('filterChanged');
                  if ($scope.model.PageIndex > 1) {
                      $scope.model.PageIndex = 1;
                      $scope.gridLoad();
                  } else {
                      $scope.gridLoad();
                  }
              }
              $scope.selectedRowsFunc = function () {
                  var selectedRows = $scope.model.data.filter(function (select) {
                      return select.selected;
                  });
                  $scope.model.selectedRowsCount = selectedRows.length || 0;
              };
              $scope.selectedRowsFunc();
              $scope.rowCheckboxClickFunction = function (row) {
                  $scope.selectedRowsFunc();
              }
              $scope.selectAll = function () {
                  if ($scope.allRowsCount > $scope.model.selectedRowsCount) {
                      angular.forEach(filterFilter($scope.model.data, {
                          "disableSelection": false
                      }), function (value, key) {
                          value.selected = true;
                      });
                  } else if ($scope.allRowsCount == $scope.model.selectedRowsCount) {
                      angular.forEach(filterFilter($scope.model.data, {
                          "disableSelection": false
                      }), function (value, key) {
                          value.selected = false;
                      });
                  }
                  $scope.selectedRowsFunc();
              }

              $scope.infiniteUpdate = function () {
                  $scope.gridLoad(true);
              }

              $scope.execlinkClick = function (colname, row) {
                  $scope.onlinkclick({
                      colname: colname,
                      row: row
                  });
              };

          }],
          link: function (scope, element, attributes) {
              var dynamicGrid = $compile("<dynamic-grid />")(scope);
              element.append(dynamicGrid);
              scope.ongridload();
          }
      }
  }])
  .directive("gridTitle", function () {
      return {
          restrict: "E",
          link: function (scope, element, attributes) {
              if (attributes.value.length) {
                  scope.model.title = attributes.value;
              }
          }
      }
  })
  .directive("gridPagination", function () {
      return {
          restrict: "E",
          require: "^fzGrid",
          link: function (scope, element, attributes, controller) {
              controller.updatepagination();
          }
      }
  })
  .directive("gridActions", function () {
      return {
          restrict: "E",
          template: "",
          require: "^fzGrid",
          compile: function (element, attributes) {
              var template = element.html();
              element.empty();
              return {
                  pre: function (scope, element, attributes, controllers) {
                      controllers.setActions(template);
                  }
              }
          }
      }
  })
  .directive("grid", function () {
      return {
          restrict: "E",
          require: ["^fzGrid", "grid"],
          controller: function () {
              var columns = [];
              this.addColumn = function (col) {
                  columns.push(col);
              };
              this.getColumns = function () {
                  return columns;
              };
          },
          link: function (scope, element, attributes, controllers) {
              var fzGridController = controllers[0];
              var gridColumnsController = controllers[1];
              fzGridController.setColumns(gridColumnsController.getColumns());
          }
      }
  })
  .directive("gridColumn", function () {
      return {
          restrict: "E",
          require: "^grid",
          link: {
              pre: function (scope, element, attributes, gridController) {

                  gridController.addColumn({
                      title: attributes.title || "Grid Title",
                      field: attributes.field || "gridfield",
                      filter: scope.$eval(attributes.filter) || false,
                      disable: scope.$eval(attributes.disable) || false,
                      permission: (attributes.permission == "false") ? false : true
                  });
              }
          }
      }
  })
  .directive("gridRowSelection", function () {
      return {
          restrict: 'E',
          require: '^fzGrid',
          link: function (scope, element, attributes, fzGridController) {
              fzGridController.setSelect();
          }
      };
  })

  .directive("gridRowRadioButton", function () {
      return {
          restrict: 'E',
          require: '^fzGrid',
          link: function (scope, element, attributes, fzGridController) {
              fzGridController.setRadioBtn();
          }
      };
  })




  .directive("dynamicGrid", ['$compile', function ($compile) {
      return {
          restrict: "E",
          templateUrl: "/app/Shared/fzGrid/Templates/fz-grid.html",
          link: function (scope, element, attributes, controller) {
              var actions = $compile(scope.actions)(scope);
              element.find(".fz-action").append(actions);
          }
      }
  }])
  .directive("dropdownFilter", function () {
      return {
          restrict: 'E',
          replace: true,
          transclude: true,
          templateUrl: '/app/Shared/fzGrid/Templates/fz-dropdown-filter.html'
      }
  })
  .directive("dropdownFilterOption", function () {
      return {
          restrict: 'E',
          scope: true,
          replace: true,
          transclude: true,
          template: '<li><a ng-click="closeDropdown(); filterClick(value)">{{title}}</a></li>',
          link: function (scope, element, attributes) {
              scope.title = attributes.title;
              scope.value = attributes.value;
              scope.closeDropdown = function () {
                  scope.$emit('closeDropdown');
              }
          }
      }
  })
  .directive("dropdownAction", function () {
      return {
          restrict: 'E',
          replace: true,
          transclude: true,
          templateUrl: '/app/Shared/fzGrid/Templates/fz-dropdown-action.html',
          link: function (scope, element, attributes) {
              scope.fzUiTrim = attributes.uiTrim;
          }
      }
  })
  .directive("dropdownActionOption", function () {
      return {
          restrict: 'E',
          scope: true,
          replace: true,
          transclude: true,
          template: '<li><a ng-click="closeDropdown(); actionClick(value)" ng-class="!model.selectedRowsCount > 0 ? \'disabled\': \'\'"  fz-ui-trim=\'{{fzUiTrim}}\'>{{title}}</a></li>',
          link: function (scope, element, attributes) {
              scope.title = attributes.title;
              scope.value = attributes.value;
              scope.fzUiTrim = attributes.uiTrim;
              scope.closeDropdown = function () {
                  scope.$emit('closeDropdown');
              }
          }
      }
  });
});
