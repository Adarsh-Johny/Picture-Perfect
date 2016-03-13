define(["angular"], function () {
 return angular.module('eruditeApp.Config', [])
.constant('ERUDITE_CONFIG', {"baseUrl":"http://localhost:46551/","gridPageSize":15,"xtForm":{"validationSummaryTemplate":"<div data-ng-show=\"showErrors\" class=\"error-wrapper\">\n   <label class=\"error\" data-ng-repeat=\"error in errors\" data-key=\"{{error.key}}\">\n       <span data-ng-show=\"showLabel\" data-ng-bind=\"error.message\"></span>\n   </label>\n</div>"}})
.constant('GRID_PAGE_SIZE', 15)
.constant('MOCK_CONFIG', {"ignorePaths":["192.168.2.200:81","localhost:46551"]});
 
});