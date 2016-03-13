define(['angular'], function () {
    return angular.module("eruditeApp.Shared.Inbox", [])

.directive("fzInbox", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            model: "=",
            update: "&"
        },
        templateUrl: "/app/Shared/fzInbox/Templates/fz-inbox.html",
        controller: function ($scope, $http) {
            $scope.inboxUpdate = function () {
                $scope.model.startindex = $scope.model.data.length + 1;
                $scope.update();
            }
            $scope.inboxResetUpdate = function () {
                $scope.model.data = [];
                $scope.model.startindex = 1;
                $scope.update();
            }
            $scope.inboxSortClick = function(option){
              if ($scope.model.sort.sortValue == option.value){
                $scope.model.sort.sortOrder = !$scope.model.sort.sortOrder;
              }
              $scope.model.sort.sortValue = option.value;
              $scope.inboxResetUpdate();
            };
        }
    }
})
  .directive("fzScrollAction", function () {
      return {
          restrict: "A",
          link: function (scope, element, attributes) {
              var raw = element[0];
              element.bind('scroll', function () {
                  if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 10) {
                      scope.$apply(attributes.fzScrollAction);
                  }
              });
          }
      }
  });
});
