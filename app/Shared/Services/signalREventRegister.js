define(['angular'], function () {

    return angular.module('eruditeApp.Shared.signalREventRegister', [])
        .service('$$SignalREventRegister', [function () {
            this.EventHandlers = this.EventHandlers || [];
            this.Register = function (eventname, handler) {
                this.EventHandlers.push({ eventName: eventname, event: handler });
            }
            this.UnRegister = function (eventname) {
                this.EventHandlers = this.EventHandlers.filter(function (el) {
                    return el.eventName != eventname;
                });
            }
            this.handleEvent = function (eventname, handler) {
                angular.forEach(this.EventHandlers, function (item) {
                    if (item.eventName === eventname) {
                        item.event(handler);
                    }
                });
            }
        }]);
});
