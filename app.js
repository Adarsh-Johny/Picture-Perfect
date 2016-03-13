/// <reference path="scripts/angular-click-outside/clickoutside.directive.js" />
/*global define,console,angular,require*/
define([
    'angularAMD',
    'angular-ui-router',
    'app/eruditeconfig',
    'xtForm',
    'angular-cookies',
    'app/Shared/Services/login-service',
    'app/Crm/user-config',
    //'app/Setup/setup-config',
    'toaster',
    'ui-select',
    'app/Shared/fzSubmit/Directives/fz-submit',
    'app/Shared/fzCancel/Directives/fz-cancel',
    'app/Shared/fzClose/Directives/fz-close',
    'app/Shared/Directives/loadingIndicator',
    'app/Shared/fzUiTrim/fz-UiTrim',
    'perfectScrollbarJQuery',
    'extensions',
    'app/Shared/Services/forgot-password-modal-service'
], function (angularAMD) {
    var dependencies = [
   // 'pscroll',
  //'eruditeApp.SharedModule',
  //'eruditeApp.SetupModule',
  'eruditeApp.UserModule',
  //'eruditeApp.PatientModule',
  'eruditeApp.Config',
  'ui.router',
  'eruditeApp.Shared.FormSubmitDirective',
  'eruditeApp.Shared.FormCancelDirective',
  'eruditeApp.Shared.ModelCloseDirective',
  'eruditeApp.Shared.UiTrimDirective',
  'eruditeApp.Shared.ForgotPasswordModalService',
  //'ngMessages',
 // 'ngEnter',
  'ui.select',
  //'ui.mask',

  'ngCookies',
 // 'eruditeApp.MockBackend',
  'xtForm',
  'eruditeApp.Shared.LoginService',
  'toaster',
  'loadingIndicator',
    ];

    var app = angular
 .module('eruditeApp', dependencies)
 .config([
  '$compileProvider',
  '$httpProvider',
  '$stateProvider',
  '$urlRouterProvider',
  'xtFormConfigProvider',
  '$provide',
  function ($compileProvider, $httpProvider, $stateProvider, $urlRouterProvider, xtFormConfigProvider, $provide) {
      //Enable following for production...
      //$compileProvider.debugInfoEnabled(false);

      $httpProvider.defaults.withCredentials = true;
      $urlRouterProvider.otherwise('/login');
      // xtForm form validation strategy.
      xtFormConfigProvider.addValidationStrategy('customStrategy', function (form, ngModel) {
          return ngModel.$invalid && form.$submitted;
      });
      xtFormConfigProvider.setDefaultValidationStrategy('customStrategy');
      $stateProvider
                      .state('login', angularAMD.route({
                          url: '/login',
                          title: 'Login',
                          templateUrl: '/app/Shared/Templates/login.html',
                          controllerUrl: 'app/Shared/Controllers/login-controller.js',
                          controller: 'loginController'
                      }))

                      .state('login.forgotpassword', {
                          url: '/forgotpassword',
                          title: 'Forgot Password',
                          onEnter: ['$state', '$$ForgotPasswordModalService',
                              function ($state, $$ForgotPasswordModalService) {
                                  $$ForgotPasswordModalService.open()
                                      .then(function (data) {
                                          $state.go('^', {}, {});
                                      }).catch(function (err) {
                                          $state.go('^', {}, {});
                                      });
                              }]
                      })

                      .state('setpassword', angularAMD.route({
                          url: '/set-password/{token:[0-9A-Za-z=]+\/?}',
                          title: 'Set Password email link',
                          templateUrl: 'app/Shared/Templates/setpassword.html',
                          controller: 'setpasswordController',
                          controllerUrl: 'app/Shared/Services/setpassword-service.js',
                      }))

                      .state('insufficientprivilege', angularAMD.route({
                          url: '/insufficient-privilege',
                          title: 'Insufficient Privilege',
                          templateUrl: 'app/Shared/Templates/insufficientprivilege.html'
                      }))

                      .state('app', angularAMD.route({
                          abstract: true,
                          data: {
                              requireLogin: true
                          },
                          url: '/',
                          templateUrl: '/app/Shared/Templates/app.html'
                      }));

      $httpProvider.interceptors.push(['$timeout', '$q', '$injector', '$rootScope', function ($timeout, $q, $injector, $rootScope) {
          var toaster, state;
          // this trick must be done so that we don't receiev
          // `Uncaught Error: [$injector:cdep] Circular dependency found`
          $timeout(function () {
              toaster = $injector.get('toaster');
              state = $injector.get('$state');
          });
          return {
              request: function (request) {
                  $rootScope.isLoading = true;
                  return request || $q.when(request);
              },
              response: function (response) {
                  $rootScope.isLoading = false;
                  return response || $q.when(response);
              },
              responseError: function (rejection) {
                  $rootScope.isLoading = false;
                  console.log(rejection.status);
                  switch (rejection.status) {
                      case 302:
                          toaster.error("Duplicate login");
                          state.go('login');
                          break;
                      case 401:
                          var UnAuthenticatedUser = rejection.headers()["UnAuthenticatedUser"];
                          if (angular.isDefined(UnAuthenticatedUser) && UnAuthenticatedUser === 'true') {
                              state.go('login');
                          }
                          else {
                              state.go("insufficientprivilege");
                          }
                          //header exist redirect to login else insuf prev
                          //  if()

                          //toaster.error("error 401");
                          break;
                      case 403:
                          //toaster.error("error 403");
                          state.go('login');
                          break;
                      case 400: break;
                      default:
                          toaster.error("Something went wrong. Please try again later.");
                          break;
                  }
                  if (rejection.status !== 0) {
                      return $q.reject(rejection);
                  }
                  var deferred = $q.defer();
                  // toaster.error("WebAPI is down, please contact Administrator");
                  deferred.reject(rejection);
                  return deferred.promise;
              }
          };
      }]);
      $provide.decorator('$exceptionHandler', ['$delegate', '$injector', function ($delegate, $injector) {
          return function (exception, cause) {
              var $toaster = $injector.get('toaster');
              $delegate(exception, cause);
              var appErrorMessage = "An Error Occurred";
              var errorData = { exception: exception, cause: cause };
              $toaster.error(appErrorMessage);
              console.log(exception.message, errorData);
          };
      }]);
  }
 ])

.run(['$rootScope', '$state', '$stateParams', '$cookies', '$$Login', '$templateCache', 'ERUDITE_CONFIG', 'toaster',
  function ($rootScope, $state, $stateParams, $cookies, $$Login, $templateCache, ERUDITE_CONFIG, toaster) {

      // It's very handy to add references to $state and $stateParams to the $rootScope
      // so that you can access them from any scope within your applications.For example,
      // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
      // to active whenever 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;


      // xtForm validation summary template, template can be modified in fuzeconfig.json
      var xtFormValidationSummaryTemplate = ERUDITE_CONFIG.xtForm.validationSummaryTemplate;
      $templateCache.put('xtForm/summary/validationSummary.html', xtFormValidationSummaryTemplate);

      // $stateChangeStart event of ui.router handled, for checking if login required, if required check if already logged in
      // otherwise redirect to the login state.
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
          if (toState.redirectTo) {
              event.preventDefault();
              return $state.go(toState.redirectTo, toParams);
          }


          var requireLogin = false;
          if (toState.data) {
              requireLogin = toState.data.requireLogin;
          }

          if (requireLogin) {
              var userLoggedIn = $cookies.get('userloggedin') == 'true';

              //State requires login

              if (!userLoggedIn) {
                  event.preventDefault();
                  //State change goto login state
                  return $state.go('login');
              }

              if (userLoggedIn && !angular.isUndefined($rootScope.User) && toState.privilegeId && !$$Login.CheckPrivileges(toState.privilegeId, 'VIEW')) {
                  event.preventDefault();
                  return $state.go('insufficientprivilege');
              }
              if (userLoggedIn && typeof $rootScope.User === 'undefined') {
                  event.preventDefault();
                  //userLoggedIn cookie is set, but context is not populated yet...

                  $$Login.GetUserContext()
                    .then(function () {
                        //userLoggedIn cookie is set, user context population completed
                        return $state.go(toState.name, toParams);
                    })
                    .catch(function () {
                        console.log("$rootScope.$on('$stateChangeStart'..., couldn't load user context...");
                        return $state.go('login');
                    });
              }
          }
      });

      var extensions = require('extensions');
      extensions();
  }
]);

    // Bootstrap Angular when DOM is ready
    angularAMD.bootstrap(app);

    return app;

});