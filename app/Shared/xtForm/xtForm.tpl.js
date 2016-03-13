/*!
 * See LICENSE in this repository for license information
 */
(function () {
    'use strict';
    /*jshint unused:false*/
    var xtForm = angular.module('xtForm', []);
    xtForm.directive('ngModel', ["xtFormConfig", "$rootScope", "$interpolate", "$document", "$timeout", function (xtFormConfig, $rootScope, $interpolate, $document, $timeout) {
        'use strict';

        var UNTOUCHED_CLASS = 'ng-untouched',
            TOUCHED_CLASS = 'ng-touched';

        return {
            require: ['ngModel', '^?xtForm', '^?form'],
            link: function (scope, element, attrs, ctrls) {

                var defaultErrors = xtFormConfig.getErrorMessages(),
                    ngModel = ctrls[0],
                    xtForm = ctrls[1],
                    form = ctrls[2],
                    setTouchedFn,
                    validationStrategyFn;

                /**
                 * Active the directive
                 */
                function activate() {

                    setTouchedFn = ngModel.$setTouched || setTouchedPolyfill;
                    validationStrategyFn = xtForm.getValidationStrategy();
                    ngModel.$untouched = true;

                    // add extensions to ngModel
                    var labelEl = $document[0].querySelectorAll('label[for="' + attrs.id + '"]');
                    angular.extend(ngModel, {
                        $focused: false,
                        $label: labelEl.length > 0 ? labelEl[0].innerText : '',
                        $xtErrors: []
                    });

                    scope.$on('XtForm.ForceErrorUpdate', updateErrors);
                }

                function getErrorMessageForKey(key) {
                    var attrKey = 'msg' + key[0].toUpperCase() + key.substring(1);

                    // use either the provided string as an interpolated attribute, or the default message
                    if (angular.isUndefined(attrs[attrKey]) && angular.isUndefined(defaultErrors[key])) {
                        return "";
                    }
                    return attrs[attrKey] ?
                        attrs[attrKey] :
                        $interpolate(defaultErrors[key])(attrs);
                }

                /**
                 * Sets the $xtErrors collection on validation change
                 */
                function updateErrors() {

                    $timeout(function () {
                        ngModel.$xtErrors = [];

                        if (angular.isDefined(attrs.customValidationFunction)) {
                            var result = scope.$eval(attrs.customValidationFunction);
                            ngModel.$setValidity('customValidationFunction', result);
                        }

                        angular.forEach(ngModel.$error, function (value, key) {
                            var showErrors = value && validationStrategyFn(form, ngModel);
                            if (showErrors) {
                                var error = {
                                    key: key,
                                    message: getErrorMessageForKey(key)
                                };

                                // This is a bit of hack right now to ensure that data type validation errors are shown
                                // in priority over the required message if both fail.
                                // TODO will likely need to introduce priorities of error messages
                                if (key === 'required') {
                                    ngModel.$xtErrors.push(error);
                                } else {
                                    ngModel.$xtErrors.unshift(error);
                                }
                            }
                        });

                        $rootScope.$broadcast('XtForm.ErrorsUpdated', ngModel);
                    });
                }

                // Polyfill for $touched in AngularJS < 1.3
                function setTouchedPolyfill() {
                    ngModel.$touched = true;
                    ngModel.$untouched = false;
                    element.addClass(TOUCHED_CLASS).removeClass(UNTOUCHED_CLASS);
                }

                if (xtForm) {
                    activate();
                }
            }
        };
    }]);
    xtForm
        .directive('xtForm', ["$timeout", function ($timeout) {
            'use strict';

            return {
                require: '',
                priority: -1,
                controller: 'XtFormController',
                controllerAs: 'xtForm',
                link: function (scope, element, attrs, xtForm) {
                    scope.$on('xtreset', function () {
                        $timeout(function () {
                            xtForm.reset();
                        }, 0);

                    })
                }
            };
        }])
        .controller('XtFormController', ["$scope", "$element", "$attrs", "xtFormConfig", "$window", "$timeout", "$q", function ($scope, $element, $attrs, xtFormConfig, $window, $timeout, $q) {
            'use strict';

            var vm = this,
                form = $element.controller('form'),
                validationStrategy = $attrs.strategy ?
                    xtFormConfig.getValidationStrategy($attrs.strategy) :
                    xtFormConfig.getDefaultValidationStrategy();

            //polyfill for setSubmitted pre 1.3
            function setSubmitted() {
                if (angular.isFunction(form.$setSubmitted)) {
                    form.$setSubmitted();
                    return;
                }

                form.$submitted = true;
                $element.addClass('ng-submitted');
            }

            function setUnsubmitted() {
                if (angular.isFunction(form.$setSubmitted)) {
                    return;
                }
                form.$submitted = false;
                $element.removeClass('ng-submitted');
            }

            angular.extend(vm, {

                form: form,

                getValidationStrategy: function () {
                    return validationStrategy;
                },

                tooltipTrigger: $attrs.tooltipTrigger,

                submit: function () {
                    // remove .has error element from all form elements.
                    setSubmitted();
                    var deferred = $q.defer();
                    // focus first error if required
                    if (form.$invalid && $attrs.focusError) {
                        $window.setTimeout(function () {
                            $element.find('.ng-invalid:input:visible:first').focus();
                        });
                    }

                    $scope.$broadcast('XtForm.ForceErrorUpdate', null, 'submit');
                    $scope.$broadcast('XtForm.HideServerError');
                    $timeout(function () {

                        angular.forEach($element.find('input,select,.select2,textarea'), function (value) {
                            if ($(value).hasClass("ng-invalid")) {
                                $(value).addClass("has-error");
                            }

                            if ($(value).hasClass("has-error") && $(value).hasClass("ng-valid")) {
                                $(value).removeClass("has-error");
                            }
                        });
                        deferred.resolve();
                    }, 0);

                    return deferred.promise;
                },

                reset: function () {
                    vm.form.$setPristine();
                    vm.form.$setUntouched();
                    setUnsubmitted();
                    $timeout(function () {

                        angular.forEach($element.find('input,select,.select2,textarea'), function (value) {
                            $(value).removeClass("has-error");
                        });
                    }, 0);

                    $scope.$broadcast('XtForm.ForceErrorUpdate', null, 'reset');
                    $scope.$broadcast('XtForm.HideServerError');
                }

            });
        }]);
    xtForm.provider('xtFormConfig', function () {
        'use strict';

        var self = this,
            _errors = {
                minlength: 'Needs to be at least {{ngMinlength}} characters long',
                maxlength: 'Can be no longer than {{ngMaxlength}} characters long',
                required: 'This field is required',
                number: 'Must be a number',
                min: 'Must be at least {{min}}',
                max: 'Must be no greater than {{max}}',
                email: 'Must be a valid E-mail address',
                pattern: 'Illegal value',
                url: 'Must be a valid URL',
                date: 'Must be a valid date',
                datetimelocal: 'Must be a valid date',
                time: 'Must be a valid time',
                week: 'Must be a valid week',
                month: 'Must be a valid month',
                $$server: 'An error has occurred'
            },
            _validationStrategyFn;

        angular.extend(self, {

            $validationStrategies: {
                invalid: function (form) {
                    return form.$invalid;
                },
                submitted: function (form) {
                    return form.$invalid && form.$submitted;
                },
                dirty: function (form, ngModel) {
                    return ngModel.$invalid && ngModel.$dirty;
                },
                dirtyOrSubmitted: function (form, ngModel) {
                    return ngModel.$invalid && (form.$submitted || ngModel.$dirty);
                },
                focusedAndDirtyOrSubmitted: function (form, ngModel) {
                    return ngModel.$invalid && (ngModel.$focused && (ngModel.$dirty || form.$submitted));
                },
                dirtyAndFocusedOrSubmitted: function (form, ngModel) {
                    return ngModel.$invalid && (form.$submitted || (ngModel.$dirty && ngModel.$focused));
                }
            },

            addValidationStrategy: function (name, fn) {
                self.$validationStrategies[name] = fn;
            },

            setDefaultValidationStrategy: function (strategy) {
                if (!self.$validationStrategies[strategy]) {
                    throw new Error('Could not find validation strategy by name: ' + strategy);
                }
                _validationStrategyFn = self.$validationStrategies[strategy];
            },

            setErrorMessages: function (errors) {
                angular.extend(_errors, errors);
            }

        });

        this.$get = function () {
            return {
                getErrorMessages: function () {
                    return angular.copy(_errors);
                },
                getValidationStrategy: function (name) {
                    if (!self.$validationStrategies[name]) {
                        throw new Error('Could not find validation strategy by name: ' + name);
                    }
                    return self.$validationStrategies[name];
                },
                getDefaultValidationStrategy: function () {
                    return _validationStrategyFn;
                }
            };
        };

        self.setDefaultValidationStrategy('dirtyOrSubmitted');
    });
    xtForm.directive('xtServerValidationSummary', ["$templateCache", "$timeout", function ($templateCache, $timeout) {
        'use strict';

        return {
            require: ['^xtForm', '^form'],
            restrict: 'E',
            replace: true,
            scope: true,
            template: "<div class='server-error error-wrapper ng-hide' ></div>",
            link: function (scope, element, attrs, ctrls) {
            }
        };
    }]);

    xtForm.directive('xtFormServer', ["$templateCache", "$rootScope", "$timeout", function ($templateCache, $rootScope, $timeout) {
        'use strict';
        return {
            require: ['^xtForm', '^form'],
            restrict: 'A',
            replace: false,
            scope: false,
            link: function (scope, element, attrs, ctrls) {
                var serverMessages = '';
                function hideError() {
                    var errDiv = $(element.closest("form")).find('div.server-error');
                    $(errDiv).addClass('ng-hide');
                }

                function showError(event, args) {
                    if (args && args.formName && attrs.name == args.formName) {
                        var errDiv = $(element.closest("form")).find('div.server-error');
                        $(errDiv).removeClass('ng-hide');
                    }
                }
                scope.$on('XtForm.HideServerError', hideError);
                scope.$on('XtForm.ShowServerError', showError);

                attrs.$observe('xtFormServer', function (value) {
                    $timeout(function () {
                        value = scope.$eval(value);
                        if (angular.isDefined(value) && value.length > 0) {
                            var frm = $(element.closest("form"));
                            serverMessages = '';
                            var serverErrodDiv = frm.find('div.server-error');
                            $(serverErrodDiv).html('');
                            angular.forEach(value, function (val) {
                                for (var key in val) {
                                    var elm = frm.find('[server-id="' + key + '"]');
                                    $(elm).addClass('has-error');
                                    serverMessages = serverMessages + "<label class='error'>" + val[key] + "</label>"
                                }
                            });
                            $(serverErrodDiv).html(serverMessages);
                            $rootScope.$broadcast('XtForm.ShowServerError', { formName: attrs.name });
                        }
                    });
                });
            }
        };
    }]);

    xtForm.directive('customValidationFunction', ["$rootScope", "$parse", '$timeout', function ($rootScope, $parse, $timeout) {
        'use strict';

        return {
            require: '?ngModel',
            restrict: 'A',
            replace: false,
            link: function (scope, element, attrs, ctrls) {

                $timeout(function () {
                    var modelGetter = $parse(attrs['ngModel']);
                    var currencyMaskPresent = angular.isDefined(attrs.currencyMask);
                    ctrls.$validators.customValidationFunction = function (modelValue, viewValue) {
                        var modelSetter = modelGetter.assign;
                        //TODO : This needs to be refractored...
                        if (currencyMaskPresent && viewValue) {
                            viewValue = viewValue.replace(/,/g, "");
                        }

                        modelSetter(scope, viewValue);
                        return scope.$eval(attrs.customValidationFunction);
                    };
                })
            }
        };
    }])

    xtForm.directive('xtValidationSummary', ["$templateCache", "$timeout", function ($templateCache, $timeout) {
        'use strict';

        return {
            require: ['^xtForm', '^form'],
            restrict: 'EA',
            replace: true,
            scope: true,
            template: function (element, attrs) {
                return $templateCache.get(attrs.templateUrl || 'xtForm/summary/validationSummary.html');
            },
            link: function (scope, element, attrs, ctrls) {

                var form = ctrls[1];
                scope.showLabel = (attrs.showLabel === 'true') || angular.isUndefined(attrs.showLabel);
                scope.showErrors = false;
                function redrawErrors() {
                    scope.errors = [];
                    angular.forEach(form, function (ngModel, ngModelKey) {
                        if (ngModelKey[0] !== '$') {

                            // can show one error for each input, or multiple
                            var noOfErrors = attrs.multiple ? ngModel.$xtErrors.length : 1, errors=[];
                            if(angular.isDefined(ngModel)&&angular.isDefined(ngModel.$xtErrors)){
                                errors = ngModel.$xtErrors.slice(0, noOfErrors);
                            }

                            angular.forEach(errors, function (value) {
                                scope.errors.push({
                                    key: value.key,
                                    label: ngModel.$label,
                                    message: value.message
                                });
                            });
                        }
                    });

                    scope.showErrors = scope.errors.length > 0;
                }
                scope.$on('XtForm.ErrorsUpdated', redrawErrors);
            }
        };
    }]);
})();
