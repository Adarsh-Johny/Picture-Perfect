define(['angular'], function () {

    return angular.module('eruditeApp.Shared.FooterDirective', [])
    .directive('fuzeFooter', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/app/Shared/Templates/footer.html',
            controller: function () {

            }
        }
    }]);
});
