angular.module('eruditeApp.Shared.SidebarDirective', [])
.directive('eruditeSidebar', [function () {
    return {
        restrict: 'E',
        templateUrl: '/app/Shared/Templates/sidebar.html'
    }
}]);
