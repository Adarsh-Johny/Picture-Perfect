define(['angular'], function () {
    return angular.module('fzZipMask', []).directive('fzZipMask', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {
                // Run formatting on keyup
                var formatZip = function (value) {
                    if (value == undefined) return '';
                    value = value.toString();
                    value = value.replace(/[^0-9]/g, '');
                    if (value.length > 9) {
                        value = value.slice(0, 9);
                    }
                    if (value.length > 5) {
                        value = value.slice(0, 5) + "-" + value.slice(5);
                    }

                    return value;
                };
                var applyFormatting = function () {
                    var value = element.val();
                    var original = value;
                    if (!value || value.length == 0) { return }
                    value = formatZip(value);
                    if (value != original) {
                        element.val(value);
                        element.triggerHandler('input')
                    }
                };
                element.bind('keyup', function (e) {
                    var keycode = e.keyCode;
                    var isTextInputKey =
                        (keycode > 47 && keycode < 58) || // number keys
                        keycode == 32 || keycode == 8 || // spacebar or backspace
                        (keycode > 64 && keycode < 91) || // letter keys
                        (keycode > 95 && keycode < 112) || // numpad keys
                        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
                        (keycode > 218 && keycode < 223);   // [\]' (in order)
                    if (isTextInputKey) {
                        applyFormatting();
                    }
                });

                ngModelController.$formatters.push(function (value) {
                    if (!value || value.length == 0) {
                        return value;
                    }
                    value = formatZip(value);
                    return value;
                });
            }
        };
    });
});
