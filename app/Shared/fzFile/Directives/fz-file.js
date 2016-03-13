
define(['angular',
    'app/Shared/Services/utility.service',
], function () {

    return angular.module("eruditeApp.Shared.File", ['eruditeApp.Shared.UtilityService'])

.directive("fzFile", ['$$Utility', function($$Utility) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      model: '=ngModel'
    },
    templateUrl: '/app/Shared/fzFile/Templates/fz-file.html',
    link: function(scope, element, attributes) {
      var fileInput = element.find('.fz-file-input');
      var clickable = element.find('.fz-file-display')
      scope.filePlaceholder = attributes.placeholder || "Choose File";
      scope.buttonText = attributes.button || "Browse";
      scope.fileName = "";
      scope.fileLength = 0;
      scope.name = $$Utility.getUUID();
      scope.required = false;
      scope.readonly = false;
      scope.multiple = false;
      scope.maxSize = attributes.maxSize || "5MB";
      scope.label = attributes.label || "Upload File";
      scope.msgMaxSize = attributes.msgMaxSize || scope.label + " should be less than 5 MB";
      if (angular.isDefined(attributes.required)) {
        scope.required = true;
        scope.msgRequired = attributes.msgRequired || scope.label+ " is Mndatory" ;
      }
      if (angular.isDefined(attributes.readonly)) {
        fileInput.attr('readonly', 'readonly');
        scope.readonly = true;
      }
      if (angular.isDefined(attributes.multiple)) {
        fileInput.attr('multiple', 'multiple');
        scope.multiple = true;
      }
      if (angular.isDefined(attributes.filesize)) {
        scope.filesize = attributes.filesize;
      }
      angular.element(clickable).on('click', function() {
        $(this).next('.fz-file-input').trigger('click');
      });
      angular.element(fileInput).on('change', function(evt) {
        var filenamearray = [];
        if (scope.multiple) {
          scope.model = [];
        }
        var file = $(evt.currentTarget).get(0).files;
        var isFileValid = true;
        angular.forEach(file, function(value, key) {
          filenamearray.push(value.name);
          if (!scope.multiple) {
            scope.model = value;
          } else {
            scope.model.push(value);
          }
        });
        scope.$apply(function() {
          if (file) {
            scope.fileName = filenamearray.join(", ");
            scope.fileLength = file.length;
          }
        });
      })
      scope.CheckforError = function() {
        return angular.element(fileInput).hasClass('has-error');
      }
      scope.$watch('model', function() {
        if (scope.model == null) {
          scope.fileName = "";
          scope.fileLength = 0;
          angular.element(fileInput).val('');
        }
      });
    }
  }
}])

.directive("fileSizeValidator", [function() {
  return {
    restrict: "A",
    require: 'ngModel',
    link: function(scope, element, attributes, ctrl) {
      ctrl.$validators.fileSizeValidator = function(modelValue, viewValue) {
        var isFileValid = true;
        if (!scope.multiple) {
          if (modelValue && modelValue.size > scope.translateScalars(scope.maxSize)) {
            isFileValid = false;
          }
        } else {
          angular.forEach(modelValue, function(value, key) {
            if (value.size > scope.translateScalars(scope.maxSize)) {
              isFileValid = false;
              return;
            }
          });
        }
        return isFileValid;
      };
      attributes.$observe('fileSizeValidator', function() {
        ctrl.$validate();
      });
      scope.translateScalars = function(str) {
        if (angular.isString(str)) {
          if (str.search(/kb/i) === str.length - 2) {
            return parseFloat(str.substring(0, str.length - 2) * 1000);
          } else if (str.search(/mb/i) === str.length - 2) {
            return parseFloat(str.substring(0, str.length - 2) * 1000000);
          } else if (str.search(/gb/i) === str.length - 2) {
            return parseFloat(str.substring(0, str.length - 2) * 1000000000);
          } else if (str.search(/b/i) === str.length - 1) {
            return parseFloat(str.substring(0, str.length - 1));
          } else if (str.search(/s/i) === str.length - 1) {
            return parseFloat(str.substring(0, str.length - 1));
          } else if (str.search(/m/i) === str.length - 1) {
            return parseFloat(str.substring(0, str.length - 1) * 60);
          } else if (str.search(/h/i) === str.length - 1) {
            return parseFloat(str.substring(0, str.length - 1) * 3600);
          }
        }
        return str;
      };
    }
  }
}]);
});
