define(["angular", ], function() {
    return angular.module('eruditeApp.Shared.WeekPickerDirective', [])
        .directive('fzWeekPicker', ['$timeout', 'uiDateConverter', '$parse', function($timeout, uiDateConverter, $parse) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;
                    var getOptions = function() {
                        return angular.extend({
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: 'd M, yy',
                            firstDay: 1,
                            defaultDate: scope.$eval(attrs.startDate)
                        }, scope.$eval(attrs.fzWeekPicker));
                    };
                    var initDateWidget = function() {
                        var optionsObj = getOptions();
                        var selectCurrentWeek = function() {
                            scope.$apply(function() {
                                $("#ui-datepicker-div").find(".ui-datepicker-current-day a").addClass("ui-state-active");
                            });
                        };

                        var updateModel = function(date, dateFormat, dateTxt) {
                            scope.$apply(function() {
                                ngModel.$setViewValue(element.datepicker('getDate'));
                            });
                            var modelAccessor = $parse(attrs.ngModel);
                            scope.$apply(function(scope) {
                                modelAccessor.assign(scope, date);
                            });
                        };

                        optionsObj.onSelect = function(dateTxt, picker) {
                            var date = $(element).datepicker('getDate');
                            $timeout(function() {
                                selectCurrentWeek();
                            }, true);
                            updateModel(date, optionsObj.dateFormat, dateTxt);
                        };

                        optionsObj.beforeShow = function(dateTxt, inst) {
                            $timeout(function() {
                                selectCurrentWeek();
                            }, true);
                        }

                        optionsObj.beforeShowDay = function(date) {
                            var cssClass = '';
                            var todayDate = $(element).datepicker('getDate');
                            if (todayDate) {
                                var startDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), (todayDate.getDate() - todayDate.getDay()) + 1);
                                var endDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - todayDate.getDay() + 7);
                                if (date >= startDate && date <= endDate)
                                    cssClass = 'week-active';
                                return [true, cssClass];
                            }
                        };

                        optionsObj.onChangeMonthYear = function(year, month, inst) {
                            $timeout(function() {
                                selectCurrentWeek();
                            }, true);
                        };

                        ngModel.$render = function() {
                            //var date = ngModel.$modelValue;
                            var date = scope.$eval(attrs.startDate);
                            if (angular.isUndefined(date) || date === null || !angular.isDate(date)) {
                                if (angular.isString(ngModel.$viewValue)) {
                                    date = uiDateConverter.stringToDate(attrs.uiDateFormat, ngModel.$viewValue);
                                } else {
                                    throw new Error('ng-Model value must be a Date, or a String object with a date formatter - currently it is a ' + typeof date + ' - use ui-date-format to convert it from a string');
                                }
                            }
                            element.datepicker('setDate', date);
                        };

                        if (element.data('datepicker')) {
                            // Updates the datepicker options
                            element.datepicker('option', optionsObj);
                            element.datepicker('refresh');
                        } else {
                            // Creates the new datepicker widget
                            element.datepicker(optionsObj);

                            //Cleanup on destroy, prevent memory leaking
                            element.on('$destroy', function() {
                                element.datepicker('destroy');
                            });
                        }

                        ngModel.$render();
                    }
                    scope.$watch(getOptions, initDateWidget, true);
                }
            };
        }])
        .factory('uiDateConverter', ['uiDateFormatConfig', function(uiDateFormatConfig) {

            function dateToString(dateFormat, value) {
                dateFormat = dateFormat || uiDateFormatConfig;
                if (value) {
                    if (dateFormat) {
                        return jQuery.datepicker.formatDate(dateFormat, value);
                    }

                    if (value.toISOString) {
                        return value.toISOString();
                    }
                }
                return null;
            }

            function stringToDate(dateFormat, value) {
                dateFormat = dateFormat || uiDateFormatConfig;
                if (angular.isString(value)) {
                    if (dateFormat) {
                        return jQuery.datepicker.parseDate(dateFormat, value);
                    }

                    var isoDate = new Date(value);
                    return isNaN(isoDate.getTime()) ? null : isoDate;
                }
                return null;
            }

            return {
                stringToDate: stringToDate,
                dateToString: dateToString
            };

        }])
        .constant('uiDateFormatConfig', '');
});
