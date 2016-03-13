/*** Directives and services for responding to idle users in AngularJS
* @author Mike Grabski <me@mikegrabski.com>
* @version v1.1.1
* @link https://github.com/HackedByChinese/ng-idle.git
* @license MIT
*/
define(["angular",
    'app/Shared/ngIdle/ngIdle-keepAlive',
    'app/Shared/ngIdle/ngIdle-idle',
    'app/Shared/ngIdle/ngIdle-localStorage',
], function () {
    'use strict';
    return angular.module('ngIdle', ['ngIdle.keepalive', 'ngIdle.idle', 'ngIdle.localStorage']);


});