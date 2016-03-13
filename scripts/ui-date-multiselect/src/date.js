/*global angular */
/*
 jQuery UI Datepicker plugin wrapper

 @note If ≤ IE8 make sure you have a polyfill for Date.toISOString()
 @param [ui-date] {object} Options to pass to $.fn.datepicker() merged onto uiDateConfig
 */

angular.module('ui.date.multiselect', [])

  .constant('uiDateConfig', {
      changeYear: true,
      changeMonth: true,
      firstDay: 1
  })

  .directive('uiDateMultiselect', ['uiDateConfig', '$timeout', function (uiDateConfig, $timeout) {
      'use strict';
      var options;
      options = {};
      angular.extend(options, uiDateConfig);
      return {
          require: 'ngModel',
          link: function (scope, element, attrs, ngModel) {
              // TODO: Check opts.defaultDate
              var now = new Date();
              var currentYear = now.getFullYear();
              var currentMonth = now.getMonth() + 1;
              var selectionStart = null;
              var selectionEnd = null;

              var indexOfDate = function (date) {
                  var timestamp = date.getTime();
                  for (var i = 0; i < ngModel.$modelValue.length; i++) {
                      if (timestamp === ngModel.$modelValue[i].getTime()) {
                          return i;
                      }
                  }

                  return -1;
              };

              var areAllDatesSelected = function (dates) {
                  for (var i = 0; i < dates.length; i++) {
                      if (indexOfDate(dates[i]) === -1) {
                          return false;
                      }
                  }

                  return true;
              };

              var addOrRemoveDate = function (date) {
                  var index = indexOfDate(date);
                  ngModel.$modelValue = ngModel.$modelValue || [];
                  //scope.$dates = scope.$dates || [];
                  if (index >= 0) {
                      ngModel.$modelValue.splice(index, 1);
                      //scope.$dates.splice(index, 1);
                  }
                  else {
                      ngModel.$modelValue.push(date);
                      //scope.$dates.push(date);
                  }
              };

              var getOptions = function () {
                  return angular.extend({}, uiDateConfig, scope.$eval(attrs.uiDate));
              };

              function getDates() {
                  var val = '';
                  for (var index = 0; index < ngModel.$modelValue.length; index++) {
                      if (angular.isDate(ngModel.$modelValue[index])) {
                          val = val + jQuery.datepicker.formatDate('mm/dd/yy', ngModel.$modelValue[index]) + ', ';
                      }
                  }
                  return val;
              }

              ngModel.$viewChangeListeners.push(function () {
                  ngModel.$render();
              });

              ngModel.$parsers.push(function (viewValue) {
                  scope.$dates = [];
                  if (!ngModel.$isEmpty(viewValue)) {
                      var dates = viewValue.split(',');

                      for (var index = 0; index < dates.length; index++) {
                          var date = moment(dates[index].trim(), 'MM/DD/YYYY', true);
                          if (date.isValid()) {
                              scope.$dates.push(date.toDate());
                          }
                      }
                  }
                  return angular.copy(scope.$dates);
              });

              function highlightDates() {
                  $timeout(function () {
                      scope.$apply(function () {
                          $("#ui-datepicker-div").find(".ui-datepicker-current-day a").removeClass("ui-state-active");
                          $("#ui-datepicker-div").find(".ui-datepicker-selected-day a").addClass("ui-state-active");
                      });
                  }, true);
              }

              var initDateWidget = function () {
                  var opts = getOptions();

                  // Set the view value in a $apply block when users selects
                  // (calling directive user's function too if provided)
                  var _onSelect = opts.onSelect || angular.noop;
                  opts.onSelect = function (value, instance) {
                      scope.$apply(function () {
                          var date = instance.input.datepicker('getDate');
                          if (date !== null) {
                              addOrRemoveDate(date);
                              ngModel.$viewValue = getDates();
                              ngModel.$render();
                          }
                          _onSelect(value, instance);
                          element.blur();
                          highlightDates();
                      });
                  };

                  var _beforeShowDay = opts.beforeShowDay || angular.noop;
                  opts.beforeShowDay = function (date) {
                      var result;
                      if (indexOfDate(date) >= 0) {
                          result = [true, 'ui-datepicker-selected-day'];
                      } else {
                          return [true, ''];
                      }

                      var _result = _beforeShowDay(date);
                      // Merge results
                      if (_result) {
                          if (_result === false) {
                              result[0] = false;
                          }
                          if (!result[1] && _result[1]) {
                              result[1] = _result[1];
                          }
                          if (_result[2]) {
                              result[2] = _result[2];
                          }
                      }

                      return result;
                  };

                  opts.beforeShow = function () {
                      highlightDates();
                  }

                  var _onChangeMonthYear = opts.onChangeMonthYear || angular.noop;
                  opts.onChangeMonthYear = function (year, month, inst) {
                      currentYear = year;
                      currentMonth = month;

                      return _onChangeMonthYear(year, month, inst);
                  };

                  // If we don't destroy the old one it doesn't update properly when the config changes
                  element.datepicker('destroy');
                  // Create the new datepicker widget
                  element.datepicker(opts);
                  if (ngModel) {
                      // Force a render to override whatever is in the input text box
                      ngModel.$render();
                  }

                  // Range selection          
                  element
                    .on('mousedown', '.ui-datepicker-calendar tbody td:not(.ui-datepicker-unselectable)', function (e) {
                        console.log('mouse down');
                        selectionStart = parseInt($(this).text(), 10);
                        $('.ui-datepicker-calendar tbody a', element).removeClass('ui-state-active');
                        e.preventDefault();
                    })
                    .on('mouseenter', '.ui-datepicker-calendar tbody td:not(.ui-datepicker-unselectable)', function () {
                        if (selectionStart !== null) {
                            selectionEnd = parseInt($(this).text(), 10);
                            $('.ui-datepicker-calendar tbody td:not(.ui-datepicker-unselectable)', element).each(function () {
                                var $this = $(this);
                                var itemNumber = parseInt($this.text(), 10);
                                if (itemNumber >= Math.min(selectionStart, selectionEnd) &&
                                  itemNumber <= Math.max(selectionStart, selectionEnd)
                                ) {
                                    $this.addClass('ui-state-range-hover');
                                } else {
                                    $this.removeClass('ui-state-range-hover');
                                }
                            });
                        }
                    });

                  $(window).mouseup(function () {
                      if (selectionStart !== null && selectionEnd !== null) {
                          scope.$apply(function () {
                              var fromDay = Math.min(selectionStart, selectionEnd);
                              var toDay = Math.max(selectionStart, selectionEnd);
                              var newDates = [];
                              for (var day = fromDay; day <= toDay; day++) {
                                  newDates.push(new Date(currentYear, currentMonth - 1, day));
                              }

                              if (areAllDatesSelected(newDates)) {
                                  newDates.forEach(function (date) {
                                      ngModel.$modelValue.splice(indexOfDate(date), 1);
                                  });
                              } else {
                                  newDates.forEach(function (date) {
                                      if (indexOfDate(date) === -1) {
                                          ngModel.$modelValue.push(date);
                                      }
                                  });
                              }

                              selectionStart = null;
                              selectionEnd = null;

                              $('.ui-datepicker-calendar tbody td', element).removeClass('ui-state-range-hover');

                              element.datepicker('refresh');
                          });
                      } else {
                          selectionStart = null;
                          selectionEnd = null;
                      }
                  });

              };              

              // Watch for changes to the directives options
              scope.$watch(getOptions, initDateWidget, true);
          }
      };
  }
  ])

  .constant('uiDateFormatConfig', '')

  .directive('uiDateFormat', ['uiDateFormatConfig', function (uiDateFormatConfig) {
      return {
          require: 'ngModel',
          link: function (scope, element, attrs, modelCtrl) {
              var dateFormat = attrs.uiDateFormat || uiDateFormatConfig;
              if (dateFormat) {
                  // Use the datepicker with the attribute value as the dateFormat string to convert to and from a string
                  modelCtrl.$formatters.push(function (value) {
                      if (angular.isString(value)) {
                          return jQuery.datepicker.parseDate(dateFormat, value);
                      }
                      return null;
                  });
                  modelCtrl.$parsers.push(function (value) {
                      if (value) {
                          return jQuery.datepicker.formatDate(dateFormat, value);
                      }
                      return null;
                  });
              } else {
                  // Default to ISO formatting
                  modelCtrl.$formatters.push(function (value) {
                      if (angular.isString(value)) {
                          return new Date(value);
                      }
                      return null;
                  });
                  modelCtrl.$parsers.push(function (value) {
                      if (value) {
                          return value.toISOString();
                      }
                      return null;
                  });
              }
          }
      };
  }]);
