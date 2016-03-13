define(['angular', 'jquery-ui', 'xtForm', 'app/Shared/Services/utility.service'], function () {
    return angular.module("eruditeApp.Shared.DateElement", ['eruditeApp.Shared.UtilityService'])
      .directive('fzDateE', ['$$Utility', '$timeout', function ($$Utility, $timeout) {
          return {
              restrict: 'E',
              require: '^?ngModel',
              replace: true,
              scope: {
                  model: "=dateModel",
                  datechange: "&"
              },
              templateUrl: '/app/Shared/fzDate/Templates/fz-date-e.html',
              compile: function (elem, attr) {

                  // ADD GLOBAL FUNCTION - Object.toType
                  Object.toType = (function toType(global) {
                      return function (obj) {
                          if (obj === global) {
                              return "global";
                          }
                          return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
                      }
                  })(this);

                  // FORMAT DATE TO STRING
                  function formatDate(modelDate, format) {
                      if (!modelDate) {
                          return "";
                      }
                      var date = new Date(modelDate);
                      var yyyy = date.getFullYear().toString();
                      var mm = (date.getMonth() + 1).toString();
                      var dd = date.getDate().toString();
                      switch (format) {
                          case 'mm/dd/yy':
                              return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy;
                              break;
                          case 'mm/dd':
                              return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]);
                              break;
                      }
                  };
                  function checkValidations(scope, ctrl) {
                      var elmDate = scope.model, validDate = false, checkMinMax = true, checkOtherValidations = true;
                      if (scope.dateRequired) {
                          if (elmDate == "") {
                              ctrl.$setValidity("required", scope.dateRequired);
                              checkOtherValidations = false;
                          }
                      } else {
                          if (elmDate == "") {
                              checkOtherValidations = false;
                          }
                      }
                      if (checkOtherValidations) {
                          if (scope.datePattern.test(elmDate)) {
                              scope.model = formatDate(new Date(elmDate), scope.config.dateFormat);
                              validDate = true;
                          }
                          if (scope.config.dateFormat.toLowerCase() == 'mm/dd') {
                              checkMinMax = false;
                          }
                          if (checkMinMax) {
                              if (validDate && new Date(scope.model) < new Date(scope.config.minDate)) {
                                  scope.dateMinDate = false;
                              } else {
                                  scope.dateMinDate = true;
                              }
                              if (validDate && new Date(scope.model) > new Date(scope.config.maxDate)) {
                                  scope.dateMaxDate = false;
                              } else {
                                  scope.dateMaxDate = true;
                              }
                              ctrl.$setValidity("minDate", scope.dateMinDate);
                              ctrl.$setValidity("maxDate", scope.dateMaxDate);
                          }
                          ctrl.$setValidity("customPattern", validDate);
                      }
                      else {
                          ctrl.$setValidity("customPattern", true);
                      }
                  };

                  return {
                      pre: function (scope, elem, attr, ctrl) {
                          // if (!ctrl) {
                          //   return;
                          // }
                          var now = new Date(),
                            defaultMinDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()),
                            defaultMaxDate = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());
                          var defaultConfig = {
                              firstDay: 1,
                              changeMonth: true,
                              changeYear: true,
                              dateFormat: "mm/dd/yy",
                              minDate: defaultMinDate,
                              maxDate: defaultMaxDate
                          }
                          var dateConfig = {};
                          angular.isDefined(attr.dateConfig) ? dateConfig = checkObjectAttribute(attr.dateConfig) : false;

                          // MERGE DEFAULT & CUSTOM CONFIGURATIONS
                          scope.config = angular.extend({}, defaultConfig, dateConfig || {});

                          scope.config.minDate = new Date(scope.config.minDate);
                          scope.config.maxDate = new Date(scope.config.maxDate);


                          scope.model = formatDate(scope.model, scope.config.dateFormat);
                          scope.config.onClose = function (value, picker) {
                              scope.model = value;
                          }
                          angular.isDefined(attr.dateClass) ? scope.dateClass = attr.dateClass : scope.dateClass = '';
                          angular.isDefined(attr.dateType) ? scope.dateType = attr.dateType : scope.dateType = 'text';
                          angular.isDefined(attr.dateName) ? scope.dateName = attr.dateName : scope.dateName = 'date-' + $$Utility.getUUID();
                          angular.isDefined(attr.dateLabel) ? scope.dateLabel = attr.dateLabel : scope.dateLabel = 'Date';
                          angular.isDefined(attr.dateRequired) ? scope.dateRequired = checkBooleanAttribute(attr.dateRequired) : scope.dateRequired = false;
                          angular.isDefined(attr.messageRequired) ? scope.messageRequired = attr.messageRequired : scope.messageRequired = scope.dateLabel + " is required";
                          angular.isDefined(attr.dateReadonly) ? scope.dateReadonly = checkBooleanAttribute(attr.dateReadonly) : scope.dateReadonly = false;
                          angular.isDefined(attr.dateDisabled) ? scope.dateDisabled = checkBooleanAttribute(attr.dateDisabled) : scope.dateDisabled = false;
                          angular.isDefined(attr.dateMask) ? scope.dateMask = attr.dateMask : scope.dateMask = "?99/99/9999";
                          angular.isDefined(attr.dateMaskPlaceholder) ? scope.dateMaskPlaceholder = attr.dateMaskPlaceholder : scope.dateMaskPlaceholder = "_";
                          angular.isDefined(attr.datePlaceholder) ? scope.datePlaceholder = attr.datePlaceholder : false;
                          angular.isDefined(attr.dateMaskOptions) ? scope.dateMaskOptions = attr.dateMaskOptions : scope.dateMaskOptions = "{'clearOnBlur': false}";
                          angular.isDefined(attr.datePattern) ? scope.datePattern = new RegExp(attr.datePattern) : scope.datePattern = new RegExp(/((0[13578]|1[02])[\/.]31[\/.](\d{2})[0-9]{2})|((01|0[3-9]|1[1-2])[\/.](29|30)[\/.](\d{2})[0-9]{2})|((0[1-9]|1[0-2])[\/.](0[1-9]|1[0-9]|2[0-8])[\/.](\d{2})[0-9]{2})|((02)[\/.]29[\/.](((\d{2})(04|08|[2468][048]|[13579][26]))|2000))/);
                          angular.isDefined(attr.messagePattern) ? scope.messagePattern = attr.messagePattern : scope.messagePattern = scope.dateLabel + " is not valid";
                          angular.isDefined(attr.dateCustom) ? scope.dateCustom = checkBooleanAttribute(attr.dateCustom) : scope.dateCustom = true;
                          angular.isDefined(attr.messageCustom) ? scope.messageCustom = attr.messageCustom : scope.messageCustom = scope.dateLabel + " is not valid";
                          angular.isDefined(attr.messageMinDate) ? scope.messageMinDate = attr.messageMinDate : scope.messageMinDate = scope.dateLabel + " should be after " + formatDate(scope.config.minDate, scope.config.dateFormat);
                          angular.isDefined(attr.messageMaxDate) ? scope.messageMaxDate = attr.messageMaxDate : scope.messageMaxDate = scope.dateLabel + " should be before " + formatDate(scope.config.maxDate, scope.config.dateFormat);
                          //FIRST TIME VALIDATION CHECK
                          checkValidations(scope, ctrl);
                          ctrl.$setValidity("dateCustom", scope.dateCustom);

                          attr.$observe('dateConfig', function (newValue) {
                              checkValidations(scope, ctrl);
                          });

                          attr.$observe('dateDisabled', function (newValue) {
                              if (checkBooleanAttribute(newValue) == true) {
                                  scope.dateDisabled = true;
                                  scope.dateRequired = false;
                              } else {
                                  scope.dateDisabled = false;
                                  angular.isDefined(attr.dateRequired) ? scope.dateRequired = checkBooleanAttribute(attr.dateRequired) : false;
                              }
                          });

                          attr.$observe('dateCustom', function (newValue, oldValue) {
                              if (checkBooleanAttribute(newValue) == true) {
                                  scope.dateCustom = true;
                              } else {
                                  scope.dateCustom = false;
                              }
                              ctrl.$setValidity("dateCustom", scope.dateCustom);
                          });

                          attr.$observe('dateRequired', function (newValue) {
                              if (checkBooleanAttribute(newValue) == true) {
                                  scope.dateRequired = true;
                                  scope.dateDisabled = false;
                              } else {
                                  scope.dateRequired = false;
                                  angular.isDefined(attr.dateDisabled) ? scope.dateDisabled = checkBooleanAttribute(attr.dateDisabled) : false;
                              }
                              checkValidations(scope, ctrl);
                          });

                          function checkBooleanAttribute(value) {
                              switch (Object.toType(value)) {
                                  case 'boolean':
                                      return value;
                                      break;
                                  default:
                                      value = scope.$eval(value);
                                      return value;
                              }
                          }
                          function checkObjectAttribute(value) {
                              switch (Object.toType(value)) {
                                  case 'object':
                                      return value;
                                      break;
                                  default:
                                      value = scope.$eval(value);
                                      return value;
                              }
                          }
                      },
                      post: function (scope, elem, attr, ctrl) {
                          callDatepicker(scope.config, 'start');
                          scope.customDateChange = function () {
                              checkValidations(scope, ctrl);
                          }
                          function callDatepicker(config, action) {
                              if (action == 'start') {
                                  elem.datepicker(config);
                              } else if (action == 'stop') {
                                  elem.datepicker("destroy");
                              }
                          }
                      }
                  }
              }
          }
      }]);
});
