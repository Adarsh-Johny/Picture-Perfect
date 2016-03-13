angular.module('customHighlighter', [])
    .directive('customHighlighter', ['$timeout',function ($timeout) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var highlight = false;
                attrs.$observe('customHighlighter', function (value) {
                    highlight = scope.$eval(value);

                       $timeout(function() {
                           if(highlight) {
                               $(elm).addClass('has-error');
                           }
                           else{
                               $(elm).removeClass('has-error');
                           }
                       }, 0);
                });
            }
        };
    }]);
