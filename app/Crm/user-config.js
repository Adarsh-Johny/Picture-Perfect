define(['angularAMD','app/Shared/Upload/documents-service','angular-ui-router'
], function (angularAMD) {
    return angular.module('eruditeApp.UserModule', [       
        'ui.router',
        //'eruditeApp.Patient.documentsService'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider

             .state('app.user', angularAMD.route(
            {
                url: 'user',
                templateUrl: '/app/Crm/Templates/user-template.html',
                redirectTo: 'app.user.overview',
                controller: 'userTemplateController',
                controllerUrl: '/app/Crm/Templates/user-template-controller.js',
                privilegeId: 6
            }))

            .state('app.user.overview', angularAMD.route(
            {
                url: '/overview',
                templateUrl: '/app/Crm/Templates/overview.html',
                controller: 'userOverviewController',
                controllerUrl: '/app/Crm/Controllers/user-overview-controller.js',
                title: 'Overview'

            }))     
            .state('app.user.students', angularAMD.route(
               {
                   url: '/students',
                   templateUrl: '/app/Crm/Student/BasicInformation/student-grid.html',
                   controller: 'StudentGridController',
                   controllerUrl: '/app/Crm/Student/BasicInformation/student-grid-controller.js',
                   privilegeId: 29,
                   title: 'Students'
               }))
             .state('app.user.attendancerecord', angularAMD.route(
               {
                   url: '/attendance-record',
                   templateUrl: '/app/Crm/Student/Attendance/record-attendance.html',
                   controller: 'AttendanceRecordController',
                   controllerUrl: '/app/Crm/Student/Attendance/record-attendance-controller.js',
                   privilegeId: 29,
                   title: 'Students'
               }))
             .state('app.user.absentlist', angularAMD.route(
               {
                   url: '/absent-list',
                   templateUrl: '/app/Crm/Student/Attendance/absent-list.html',
                   controller: 'AbsentListController',
                   controllerUrl: '/app/Crm/Student/Attendance/absent-list-controller.js',
                   privilegeId: 29,
                   title: 'Students'
               }))

            .state('app.user.documents',angularAMD.route(
            {
                url: '/documents',
                templateUrl: '/app/Shared/Upload/patient-documents-grid-view.html',
                controller: 'documentsController',
                controllerUrl :'/app/Shared/Upload/documents-controller.js',
                privilegeId: 50,
                title: 'Documents'

            })).state('app.user.documents.add',  {
                url: '/add',
                privilegeId: 50,
                title: 'Documents',
                onEnter: ['$stateParams', '$state', '$$Documents',
                    function ($stateParams, $state, $$Documents) {
                        $$Documents.open()
                        .then(function (data) {
                            $state.go('^');
                            $state.loadGrid();
                        }).catch(function (err) {
                            $state.go('^', {}, { reload: true });
                        });
                    }]

            })
           .state('app.user.userSettings',angularAMD.route(
               {
                url: '/usersettings',
                templateUrl: '/app/Crm/UserSettings/userSettings.html',
                controller: 'userSettingsController',
                controllerUrl: '/app/Crm/UserSettings/userSttings-controller.js',
                privilegeId: 50,
                title: 'User Settings'
            }));

    }]);
});
