angular.module('eruditeApp.Shared.DialogService', ['ngDialog'])
  .service('$$DialogConfirm', ['ngDialog', '$q', function(ngDialog, $q) {

    this.open = function(main, content) {
      var deferred = $q.defer();
      var template = function() {
        var temp = '';

        if ((!!main) && (main.constructor === String)) {
          temp = '<div class="fz-dialog-header"><h2>' + main + '</h2></div>';
          temp += '<div class="fz-dialog-content-inner"><div class="fz-form-content border">' + content + '</div></div>';
          temp += '<div class="fz-form-alert-footer"><ul class="fz-action flex-row align-end">';
          temp += '<li><button type="button" class="fz-button fz-button-blue" ng-click="confirm(true)">Yes</button></li>';
          temp += '<li><button type="button" class="fz-button fz-button-blue" ng-click="confirm(false)">No</button></li>';
          temp += '</ul></div>';
        } else if ((!!main) && (main.constructor === Array)) {
          temp = '<div class="fz-dialog-header"><h2>' + main[0] + '</h2></div>';
          temp += '<div class="fz-dialog-content-inner"><div class="fz-form-content border">' + main[1] + '</div></div>';
          temp += '<div class="fz-form-alert-footer"><ul class="fz-action flex-row align-end">';
          temp += '<li><button type="button" class="fz-button fz-button-blue" ng-click="confirm(true)">Yes</button></li>';
          temp += '<li><button type="button" class="fz-button fz-button-blue" ng-click="confirm(false)">No</button></li>';
          temp += '</ul></div>';
        } else if ((!!main) && (main.constructor === Object)) {
          temp = '<div class="fz-dialog-header"><h2>' + main.title + '</h2></div>';
          temp += '<div class="fz-dialog-content-inner"><div class="fz-form-content border">' + main.content + '</div></div>';
          temp += '<div class="fz-form-alert-footer"><ul class="fz-action flex-row align-end">';
          main.action.forEach(function(a) {
              temp += '<li><button type="button" class="fz-button fz-button-blue" ng-click="confirm(' + a.value + ')">' + a.label + '</button></li>'
          });
          temp += '</ul></div>';
        }


        return temp;
      }

      ngDialog.openConfirm({
        template: template(),
        plain: true,
        className: "small"
      }).then(function(value) {
        deferred.resolve(value);
      });
      return deferred.promise;
    }

  }]);
