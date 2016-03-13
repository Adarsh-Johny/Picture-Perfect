angular.module("eruditeApp.Shared.Date", [])

.directive("fzDate", ["$timeout", function($timeout) {
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attributes) {
      scope.checkDate = function(dateString) {
        var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
        if (!(date_regex.test(dateString))) {
          return false;
        } else {
          return true;
        }
      }
      var userConf;
      var defaultConf = {
        firstDay: 1,
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy"
      }
      if (attributes.fzDate.length) {
        userConf = scope.$eval(attributes.fzDate);
      } else {
        userConf = {};
      }
      var config = angular.extend({}, defaultConf, userConf);
      element.datepicker(config);
      $timeout(function() {
        element.datepicker("setDate", scope.$eval(attributes.ngModel));
      });
      element.closest('body').on("click", function(e) {
        var elem = $(e.target);
        if (!elem.hasClass("hasDatepicker") &&
          !elem.hasClass("ui-datepicker") &&
          !elem.hasClass("ui-icon") &&
          !elem.hasClass("ui-datepicker-next") &&
          !elem.hasClass("ui-datepicker-prev") &&
          !$(elem).parents(".ui-datepicker").length) {
          $('.hasDatepicker').datepicker('hide');
        }
      });
    }
  }
}])

.directive("fzDateElement", ["$timeout", "$$Utility", function($timeout, $$Utility) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      model: "=ngModel",
      config: "="
    },
    templateUrl: '/app/Shared/fzDate/Templates/fz-date.html',
    link: function(scope, element, attributes) {
      scope.name = $$Utility.getUUID();
      scope.label = attributes.label || Date;
      if (scope.config !== Object(scope.config)) {
        scope.config = scope.$eval(scope.config);
      }
      if (angular.isDefined(attributes.dateRequired)) {
        if (typeof attributes.dateRequired === 'boolean') {
          scope.dateRequired = attributes.dateRequired;
        } else {
          console.log("fz-date", attributes.dateRequired);
          scope.dateRequired = JSON.parse(attributes.dateRequired);
          console.log("fz-date", scope.dateRequired);
        }
      } else {
        scope.dateRequired = false;
      }
      if (angular.isDefined(attributes.readonly)) {
        scope.dateReadonly = scope.$eval(attributes.readonly);
      } else {
        scope.dateReadonly = false;
      }
      if (angular.isDefined(attributes.disabled)) {
        scope.dateDisabled = scope.$eval(attributes.disabled);
      } else {
        scope.dateDisabled = false;
      }
      var defaultConf = {
        firstDay: 1,
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy"
      }
      var config = angular.extend({}, defaultConf, scope.config || {});

      element.find('.fz-date').datepicker(config);
      $timeout(function() {
        scope.placeholder = attributes.placeholder;
        if (scope.model) {
          var formattedDate = formatDate(scope.model);
          scope.model = formattedDate;
          element.find('.fz-date').datepicker("setDate", formattedDate)
        }
      });


      // Hide Hack
      // element.closest('body').on("click", function(e) {
      //   var elem = $(e.target);
      //   if (!elem.hasClass("hasDatepicker") &&
      //     !elem.hasClass("ui-datepicker") &&
      //     !elem.hasClass("ui-icon") &&
      //     !elem.hasClass("ui-datepicker-next") &&
      //     !elem.hasClass("ui-datepicker-prev") &&
      //     !$(elem).parents(".ui-datepicker").length) {
      //     $('.hasDatepicker').datepicker('hide');
      //   }
      // });

      // Formatting Date
      function formatDate(modelDate) {
        var date = new Date(modelDate);
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        var dd = date.getDate().toString();
        return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy;
      };
    }
  }
}])

.directive("fzDateNoYear", ["$timeout", "$$Utility", function($timeout, $$Utility) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      model: "=ngModel"
    },
    templateUrl: '/app/Shared/fzDate/Templates/fz-date-no-year.html',
    link: function(scope, element, attributes) {
      scope.name = $$Utility.getUUID();
      scope.label = attributes.label || Date;
      if (angular.isDefined(attributes.required)) {
        if (typeof attributes.required === 'boolean') {
          scope.dateRequired = attributes.required;
        } else {
          scope.dateRequired = JSON.parse(attributes.required);
        }
      } else {
        scope.dateRequired = false;
      }
      if (angular.isDefined(attributes.readonly)) {
        scope.dateReadonly = scope.$eval(attributes.readonly);
      } else {
        scope.dateReadonly = false;
      }
      if (angular.isDefined(attributes.disabled)) {
        scope.dateDisabled = scope.$eval(attributes.disabled);
      } else {
        scope.dateDisabled = false;
      }
      var defaultConf = {
        firstDay: 1,
        changeMonth: true,
        dateFormat: "mm/dd"
      }

      element.find('.fz-date').datepicker(defaultConf);
      $timeout(function() {
        scope.placeholder = attributes.placeholder;
        if (scope.model) {
          var formattedDate = formatDate(scope.model);
          scope.model = formattedDate;
          element.find('.fz-date').datepicker("setDate", formattedDate)
        }
      });

      function formatDate(modelDate) {
        var date = new Date(modelDate);
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        var dd = date.getDate().toString();
        return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy;
      };
    }
  }
}])

.directive('dateTest', [function() {
  return {
    restrict: 'E',
    controller: function($scope) {
      $scope.date_string = 'Sat Nov 14 2015 17:15:25 GMT+0530 (India Standard Time)';
      $scope.date_timestamp = 1447501525637;
      $scope.date_formatted = '09/20/2014' //Target format
      $scope.date_date = new Date("October 13, 2014 11:13:00");


    }
  }
}])




// .directive('fzDateE', ['$$Utility', '$timeout', function($$Utility, $timeout) {
//   return {
//     restrict: 'E',
//     replace: true,
//     scope: {
//       model: "=ngModel"
//     },
//     templateUrl: '/app/Shared/fzDate/Templates/fz-date-e.html',
//     link: function(scope, elem, attr) {
//
//       // ADD GLOBAL FUNCTION - Object.toType
//       Object.toType = (function toType(global) {
//         return function(obj) {
//           if (obj === global) {
//             return "global";
//           }
//           return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
//         }
//       })(this);
//
//       // DEFAULT CONFIG FOR DATEPICKER
//       var defaultConf = {
//         firstDay: 1,
//         changeMonth: true,
//         changeYear: true,
//         dateFormat: "mm/dd/yy"
//       }
//
//
//       var dateConfig = {};
//       angular.isDefined(attr.dateConfig) ? dateConfig = scope.$eval(attr.dateConfig) : false;
//       console.log(dateConfig);
//
//
//
//
//
//       //TYPE
//       angular.isDefined(attr.dateType) ? scope.type = attr.dateType : scope.type = 'text';
//
//       angular.isDefined(attr.dateLabel) ? scope.label = attr.dateLabel : scope.label = 'Date';
//
//       angular.isDefined(attr.dateMask) ? scope.mask = attr.dateMask : scope.mask = '99/99/9999';
//
//       angular.isDefined(attr.messageMask) ? scope.messageMask = attr.messageMask : scope.messageMask = scope.label + " is not valid";
//
//
//
//       angular.isDefined(attr.pattern) ? scope.pattern = attr.pattern : scope.pattern = "/^([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0-9]{4}|[0-9]{2})$/";
//
//       angular.isDefined(attr.messagePattern) ? scope.messagePattern = attr.messagePattern : scope.messagePattern = scope.label + " is not valid";
//
//       angular.isDefined(attr.customFunction) ? scope.customFunction = attr.customFunction : false;
//
//       angular.isDefined(attr.messageCustomFunction) ? scope.messageCustomFunction = attr.messageCustomFunction : false;




      // FORMAT DATE TO STRING
    //   function formatDate(date, format) {
    //
    //     var date = new Date(modelDate);
    //     var yyyy = date.getFullYear().toString();
    //     var mm = (date.getMonth() + 1).toString();
    //     var dd = date.getDate().toString();
    //
    //     switch (format) {
    //       case 'mm/dd/yy':
    //         return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy;
    //         break;
    //       case 'mm/dd':
    //         return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]);
    //         break;
    //       default:
    //         return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy;
    //     }
    //   }
    // }





    // compile: function(element, attributes) {
    //   if (angular.isDefined(attributes.mask)) {
    //     element.attr('ui-mask', '99/99/9999');
    //   }
    //   if (angular.isUndefined(attributes.uiMaskPlaceholder)) {
    //     console.log("undefined ui-mask-placeholder");
    //     element.attr('ui-mask-placeholder', '');
    //   }
    //   if (angular.isUndefined(attributes.uiMaskPlaceholderChar)) {
    //     console.log("undefined ui-mask-placeholder");
    //     element.attr('ui-mask-placeholder-char', '_');
    //   }
    //
    //
    //   return {
    //     pre: function(scope, element, attributes) {
    //
    //     },
    //     post: function(scope, element, attributes) {
    //       $compile(element)(scope);
    //     }
    //   }
    // }




    //     compile: function(element, attributes) {
    //
    //       // ADD TOTYPE GLOBALLY
    //       Object.toType = (function toType(global) {
    //         return function(obj) {
    //           if (obj === global) {
    //             return "global";
    //           }
    //           return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    //         }
    //       })(this);
    //
    //       // SOURCE ATTRIBUTE LIST
    //       var sourceAttributeList = [];
    //       angular.forEach(attributes.$attr, function(value) {
    //         if (value != 'attributes') {
    //           sourceAttributeList.push(value)
    //         }
    //       });
    //
    //       // TEMPLATE
    //       var template = $('<input />');
    //       template.attr('type', 'text');
    //      template.attr('name', $$Utility.getUUID());
    //       template.addClass('fz-date-e');
    //
    //       // MOVE ATTRIBUTES TO DESTINATION
    //       angular.forEach(sourceAttributeList, function(value) {
    //         template.attr(value, element.attr(value));
    //       });
    //
    //       // FILL GAPS
    //       if (sourceAttributeList.indexOf('ui-mask') < 0) {
    //         template.attr('ui-mask', '99/99/9999');
    //       }
    //       if (sourceAttributeList.indexOf('ui-mask-placeholder') < 0) {
    //         template.attr('ui-mask-placeholder', '');
    //       }
    //       if (sourceAttributeList.indexOf('ui-mask-placeholder-char') < 0) {
    //         template.attr('ui-mask-placeholder-char', '_');
    //       }
    //
    //       if (sourceAttributeList.indexOf('ui-options') < 0) {
    //         if (sourceAttributeList.indexOf('placeholder') < 0) {
    //           template.attr('ui-options', '{clearOnBlur: false}')
    //         } else {
    //           template.attr('ui-options', '{clearOnBlur: true}')
    //         }
    //       }
    //
    //       // MESSAGES
    //       if (sourceAttributeList.indexOf('msg-parse') < 0) {
    //         template.attr('msg-parse', '{{label}} is not valid');
    //       }
    //       if (sourceAttributeList.indexOf('msg-required') < 0) {
    //         template.attr('msg-required', '{{label}} is required');
    //       }
    //
    // element.replaceWith(template);
    //
    //       return {
    //         post: function(scope, element, attributes, ctrl) {
    //
    //           sourceAttributeList.indexOf('label') < 0 ? scope.label = "Date" : scope.label = attributes.label;
    //           $timeout(function(){
    //             scope.$apply(function() {
    //                element.replaceWith($compile(template)(scope));
    //
    //                ui-mask={{mask}} mask="99/99"  {{attrs}}
    //                attrs='{custtomfunction:abc()}",{msg-custom-function:"hi howare you"},server-id="abc"'
    //           },200);
    //
    //
    //
    //
    //
    //
    //
    //           // // LABEL
    //           // scope.label = destinationElement.attr('label');
    //           //
    //           // // DEFAULT CONFIGURATION - DATEPICKER
    //           // var defaultConfiguration = {
    //           //   firstDay: 1,
    //           //   changeMonth: true,
    //           //   changeYear: true,
    //           //   dateFormat: "mm/dd/yy"
    //           // }
    //           //
    //           // // USER CONFIGURATION - DATEPICKER
    //           // userConfiguration = scope.$eval(destinationElement.attr('config'));
    //           //
    //           // // ALL CONFIGURATION - DATEPICKER
    //           // var configuration = angular.extend({}, defaultConfiguration, userConfiguration || {});
    //           //
    //           // // CALL DATEPICKER
    //           // // destinationElement.datepicker(configuration);
    //
    //         },
    //         // post: function() {
    //         //
    //         // }
    //       }
    //     }
//   }
// }]);
