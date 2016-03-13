define(['angular', 'app/Shared/ngIdle/angular-idle', 'ngDialog'], function () {
    return angular.module('fzIdle', ['ngIdle'])
.controller('fzIdleCtrl', ['$scope', 'Idle', 'ngDialog', '$interval', '$$Login', '$state', 'toaster', 'IdleLocalStorage', function ($scope, Idle, ngDialog, $interval, $$Login, $state, toaster, IdleLocalStorage) {
    $scope.started = false;
    
    var idleTimeOut = 300;
    var idleTime = 1800;
    $scope.counter;
    $scope.popup = null;

    function closeModals() {
        if ($scope.popup) {
            $scope.popup.close();
            $scope.popup = null;
        }
    }

    function resetTimer() {
        $scope.displayTimer = '05:00';
        $scope.timer = 299;

        if (angular.isDefined($scope.counter)) {
            $interval.cancel($scope.counter);
            $scope.counter = undefined;
        }
    }

    $scope.$on('IdleStart', function () {
        IdleLocalStorage.set('status', { status:'start'});
        StartCountDown();

        $scope.popup = ngDialog.open({
            template: 'app/Shared/ngIdle/Template/fzIdleTemplate.html',
            className: "medium",
            controller: 'fzIdleCtrl',
            scope: $scope
        });

    });

    $scope.$on('IdleEnd', function () {
    });

    $scope.$on('fzIdle-keepAlive', function () {
        closeModals();
        resetTimer();
    });
   
    $scope.$on('fzIdle-logout', function () {
        $scope.stop();
        closeModals();
        resetTimer();
        logout();
    });
    $scope.$on('IdleTimeout', function () {
        $scope.stop();
        closeModals();
        resetTimer();
        logout();
    });

    $scope.start = function () {
        Idle.setIdle(idleTime);
        Idle.setTimeout(idleTimeOut);
        Idle.watch();
        $scope.started = true;
    };

    $scope.stop = function () {
        Idle.unwatch();
        $scope.started = false;

    };

    $scope.confirm = function (value) {
        closeModals();
        resetTimer();
        if (value == true) {
            // continue the session, update the server that the client is alive.
            keepAlive();
            IdleLocalStorage.set('status', { status: 'keepAlive' });
        }
        else {
            // logout from the current session.
            IdleLocalStorage.set('status', { status: 'logout' });
            logout();
        }
    }

    $scope.$on('$destroy', function () {
        // Make sure that the interval is destroyed too
        if (angular.isDefined($scope.counter)) {
            $interval.cancel($scope.counter);
            $scope.counter = undefined;
        }
    });

    function StartCountDown() {

        resetTimer();

        $scope.counter = $interval(function () {
            $scope.displayTimer = rectime($scope.timer);
            $scope.timer--;

            if ($scope.timer == -1 ) {
                $interval.cancel($scope.counter);
            }

        }, 1000);
    }

    function rectime(sec) {
        var hr = Math.floor(sec / 3600);
        var min = Math.floor((sec - (hr * 3600)) / 60);
        sec -= ((hr * 3600) + (min * 60));
        sec += ''; min += '';
        while (min.length < 2) { min = '0' + min; }
        while (sec.length < 2) { sec = '0' + sec; }
        hr = (hr) ? ':' + hr : '';
        return min + ':' + sec;
    }

    function logout() {
        $$Login.Logout()
              .then(function () {
                  toaster.success("Your session has expired");
              });
        $state.go('login');
    }

    function keepAlive() {
        $$Login.keepAlive();
    }

}]).directive('fzIdle', [function () {

    return {
        restrict: 'A',
        replace: true,
        controller: 'fzIdleCtrl',
        link: function (scope, elm, attrs) {
            scope.start();
        }
    };
}]);

});