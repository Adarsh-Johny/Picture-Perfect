define(["angular", ], function() {

    function totimeFilter() {
        return function(input) {
            if (!angular.isUndefined(input) && input !== null) {
                var s = String(parseFloat(input).toFixed(2)).split('.');
                var trail = ' AM';
                var hour = parseInt(s[0]);
                if (input >= 13) {
                    hour = hour - 12;
                    s[0] = hour;
                }

                if (input >= 12 && input < 24) {
                    trail = ' PM';
                }

                if (s[0] < 10) {
                    s[0] = "0" + s[0];
                }

                if (s[0] == 0)
                    s[0] = 12;
                return s[0] + ':' + s[1] + trail;
            } else {
                return '';
            }
        };
    }
    return angular
        .module('totime', [])
        .filter('totime', totimeFilter);

});
