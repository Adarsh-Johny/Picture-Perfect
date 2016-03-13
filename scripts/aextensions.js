define(function () {
    'use strict';

    return function () {
        //Array.contains('x') => boolean
        if (!Array.prototype.contains) {
            Array.prototype.contains = function (x) {
                var c = !1;
                return this.forEach(function (a) {
                    c = c || a == x;
                }), c;
            };
        }

        //String.format("obj1","20",...) => string
        if (!String.prototype.format) {
            String.prototype.format = function () {
                var args = arguments;
                if (args.length === 1 && typeof args[0] == 'object') {
                    args = args[0];
                    return this.replace(/{(\w+)}/g, function (match, p1) {
                        return typeof args[p1] != 'undefined' ? (args[p1] != null ? args[p1].toString() : '') : match;
                    });
                } else {
                    return this.replace(/{(\d+)}/g, function (match, i) {
                        return typeof args[i] != 'undefined' ? args[i] : match;
                    });
                }
            };
        }
    }
});