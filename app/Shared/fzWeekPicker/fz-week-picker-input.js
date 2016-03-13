define(["angular", 
    'app/Shared/fzWeekPicker/fzWeekPicker', 
    'scripts/ngDropover/dist/ngdropover.min'], function() {
    return angular.module('eruditeApp.Shared.WeekPickerInputDirective', [])
        .directive('fzWeekPickerInput', [function() {
            var weekPickerInputController = ['$scope', '$rootScope', '$document', function($scope, $rootScope, $document) {

                $scope.dropoverOptions = {
                    position: 'bottom',
                    triggerEvent: 'click',
                    closeOnClickOff: true,
                };

                $scope.dateOptions = {
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                };
            }];
            return {
                restrict: 'E',
                replace: true,
                templateUrl: '/app/Shared/fzWeekPicker/Templates/fz-week-picker.html',
                //scope: {
                //    startDate: '=',
                //    endDate: '='
                //},

                controller: weekPickerInputController,

                link: function(scope, element, attrs, ctrl) {
                    var date = scope.$eval(attrs.startDate);
                    scope.date = date || new Date();
                    scope.startDate = scope.date;
                    scope.$watch('date', function() {
                        var todayDate = scope.date,
                            startDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), (todayDate.getDate() - todayDate.getDay()) + 1),
                            endDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - todayDate.getDay() + 7);

                        scope.startDate = startDate;
                        scope.endDate = endDate;

                        scope.filterBar.startDate = startDate; //TODO: Need to remove this, must add as scope element
                        scope.filterBar.endDate = endDate; //TODO: Need to remove this, must add as scope element

                        scope.$emit('ngDropover.close', 'week-picker');
                    });

                    scope.$watch('filterBar.startDate', function() {
                        scope.startDate = scope.filterBar.startDate;
                        scope.endDate = scope.filterBar.endDate;
                    });
                }
            };
        }]);
});
