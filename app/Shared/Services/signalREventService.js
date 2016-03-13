define(['angular', 
    'app/Shared/Services/signalREventRegister', 
    'angular-signalr-hub',
    'app/eruditeconfig'], function () {

    angular.module('eruditeApp.Shared.SignalREventService', [])
        .factory('$$SignalREventService', ["$http", "$rootScope", "$location", "Hub", "$timeout", '$$SignalREventRegister', 'ERUDITE_CONFIG',
        function ($http, $rootScope, $location, Hub, $timeout, $$SignalREventRegister, ERUDITE_CONFIG) {
            var Events = this;
            //Hub setup
            var hub = new Hub("eventHub", {
                listeners: {
                    'handleEvent': function (eventname, handler) {
                        $$SignalREventRegister.handleEvent(eventname, handler);
                        $rootScope.$apply();
                    }
                },
                //methods: ['send'],//server methods
                errorHandler: function (error) {
                    console.error(error);
                },
                hubDisconnected: function () {
                    if (hub.connection.lastError) {
                        hub.connection.start();
                    }
                },
                transport: 'webSockets',
                logging: false,
                rootPath: ERUDITE_CONFIG.baseUrl + 'signalr'
            });
            return Events;
        }]);
});