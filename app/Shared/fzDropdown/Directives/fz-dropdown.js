/*global angular,define*/
define(['angular'], function() {
    return angular.module("eruditeApp.Shared.Dropdown", [])

  .directive("fzDropdown", ['$document', '$rootScope', function($document, $rootScope) {
        return {
            restrict: "A",
            replace: true,
      compile: function(element, attributes) {
                element
                  .addClass('fz-dropdown')
                  .addClass(attributes.fzDropdown)
                  .append('<span class="fz-dropdown-arrow" />')
                  .children('*[fz-dropdown-content]')
                  .addClass('fz-dropdown-content');
                return {
          pre: function(scope, element, attributes, controllers) {

                        // This will handle document click
            var documentHandler = function(e) {
                            if (!e.target.closest('.fz-dropdown')) {
                                if (angular.isUndefined($rootScope.freezeDropdown) || !$rootScope.freezeDropdown) {
                                    $document.find('.fz-dropdown').removeClass('active');
                                }
                            }
                        };

                        // Destroy document click
            scope.$on('$destroy', function() {
                            documentHandler = null;
                        });

                        // Bind Document Click
                        $document.bind('click', documentHandler);

            element.on('click', '> a', function() {
                            if (!$(this).is('[disabled=disabled]')) {
                                if (element.hasClass('active')) {
                                    element.removeClass('active');
                                } else {
                                    $document.find('.fz-dropdown').removeClass('active');
                                    element.parents('.fz-dropdown').addClass('active');
                                    element.addClass('active');
                                }
                            }
                        });
            scope.closeDropdown = function() {
                            $document.find('.fz-dropdown').removeClass('active');
                        };
            scope.$on('closeDropdown', function(event, data) {
                            scope.closeDropdown();
                        });
                    }
                };
            }
        };
    }]);
});
