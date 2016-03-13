/// <reference path="all-appointments-service.js" />
define(['angular',
    'app/Shared/AppointmentsGrid/all-appointments-service',
    'app/Scheduler/scheduler-service',
    'app/Shared/Services/login-service',
    'app/Shared/fzGrid/Directives/fz-grid',
    'app/Scheduler/Appointment/appointment-viewmodal-service',
    'app/Shared/Services/DialogService', 
  'app/Shared/fzUiTrim/fz-UiTrim',
    ], function () {
        return angular.module('eruditeApp.Shared.AppointmentsGridDirective', [])
        .directive('appointmentGridDirective', function () {
            var appointmentGridController = ['$rootScope', '$scope', '$$AppointmentsService', '$$Scheduler', '$$Login', 'toaster','$$AddAppointmentModal','$$DialogConfirm', function ($rootScope, $scope, $$AppointmentsService, $$Scheduler, $$Login, toaster,$$AddAppointmentModal,$$DialogConfirm) {
                
                $scope.showAllApptsGrid  = true;
                $scope.showMissedAppts = function(){
                    $scope.showAllApptsGrid  = false;
                };
                $scope.showAllAppts = function(){
                    $scope.showAllApptsGrid  = true;
                };

                const FILTER_ALL = 'ALL';
                const FILTER_PAST = 'PAST';
                const FILTER_UPCOMING = 'UPCOMING';
                const SOMETHING_WENT_WRONG = 'Something went wrong!, please try again';

                //Logic for all appointments grid -- Start

                $scope.allapptsmodel = {
                    title: 'Appointments : All',
                    PageIndex: 1,
                    PageSize: 15,
                    filters: {},
                    data: [],
                    colArray: ["AppointmentDate", "AppointmentTime", "Patient", "AppointmentType", "Provider", "Location", "Operatory", "Status"],
                    actionPermission: $$Login.CheckPrivileges(41, 'EDIT')
                };



                $scope.missedapptmodel = {
                    title: 'Missed/Pending Appointments',
                    PageIndex: 1,
                    PageSize: 15,
                    filters: {},
                    data: [],
                    colArray: ["Date", "AppointmentType", "PatientName", "StartTime", "Duration", "ProviderName", "LocationName", "Status"],
                    actionPermission : $$Login.CheckPrivileges(41, 'EDIT')
                };

                if (angular.isDefined($scope.patientid)) {
                    $scope.patientid = parseInt($scope.patientid);
                    $scope.allapptsmodel.colArray = ["AppointmentDate", "AppointmentTime", "AppointmentType", "Provider", "Location", "Operatory", "Status"];
                    $scope.missedapptmodel.colArray = ["Date", "AppointmentType", "StartTime", "Duration", "ProviderName", "LocationName", "Status"];

                }
                $rootScope.$on('AppointmentAdded', function () {
                    if($scope.showAllApptsGrid)
                        $scope.loadAllApptsGrid();
                    else
                        $scope.loadMissedApptsGrid();
                });


                $scope.appliedFilter = FILTER_ALL;
                $scope.loadAllApptsGrid = function () {
                    $scope.filterAllApptsGrid($scope.appliedFilter);
                };
                $scope.filterAllApptsGrid = function (filter) {
                    switch (filter) {
                        case FILTER_ALL:
                        loadAllAppts();
                        break;
                        case FILTER_PAST:
                        loadPastAppts();
                        break;
                        case FILTER_UPCOMING:
                        loadInUpcomingAppts();
                        break;
                    }

                };
                function loadAllAppts() {
                    $$AppointmentsService.GetAllAppts({
                        Filter: $scope.allapptsmodel.filters,
                        PageIndex: $scope.allapptsmodel.PageIndex,
                        PageSize: $scope.allapptsmodel.PageSize
                    }, $scope.patientid).success(function (resp) {
                        $scope.allapptsmodel.title = 'Appointments : All';
                        $scope.allapptsmodel.data = $$AppointmentsService.PopulateAppointmentModel(resp.Result);
                        $scope.allapptsmodel.gridTotalRecords = resp.TotalRecords;
                        $scope.appliedFilter = FILTER_ALL;
                        $scope.$broadcast('reformGrid');
                    }).error(function (error) {
                        toaster.error(SOMETHING_WENT_WRONG);
                        console.error(error);
                    });
                }


                function loadPastAppts() {
                    $$AppointmentsService.GetPastAppt({
                        Filter: $scope.allapptsmodel.filters,
                        PageIndex: $scope.allapptsmodel.PageIndex,
                        PageSize: $scope.allapptsmodel.PageSize
                    }, $scope.patientid).success(function (resp) {
                        $scope.allapptsmodel.title = 'Appointments : Past';
                        $scope.allapptsmodel.data = $$AppointmentsService.PopulateAppointmentModel(resp.Result);
                        $scope.allapptsmodel.gridTotalRecords = resp.TotalRecords;
                        $scope.appliedFilter = FILTER_PAST;
                        $scope.$broadcast('reformGrid');
                    }).error(function (error) {
                        toaster.error(SOMETHING_WENT_WRONG);
                        console.error(error);
                    });
                }


                function loadInUpcomingAppts() {
                    $$AppointmentsService.GetUpcomingAppt({
                        Filter: $scope.allapptsmodel.filters,
                        PageIndex: $scope.allapptsmodel.PageIndex,
                        PageSize: $scope.allapptsmodel.PageSize
                    }, $scope.patientid).success(function (resp) {
                        $scope.allapptsmodel.title = 'Appointments : Upcoming';
                        $scope.allapptsmodel.data = $$AppointmentsService.PopulateAppointmentModel(resp.Result);
                        $scope.allapptsmodel.gridTotalRecords = resp.TotalRecords;
                        $scope.appliedFilter = FILTER_UPCOMING;
                        $scope.$broadcast('reformGrid');
                    }).error(function (error) {
                        toaster.error(SOMETHING_WENT_WRONG);
                        console.error(error);
                    });
                }


                $scope.gridCommand = function (argument) {
                    var Appointments = [];
                    $scope.allapptsmodel.data.filter(function (d) {
                        if (d.selected) {
                            Appointments.push({ "value": d.AppointmentID, "RowVersionStamp": d.RowVersionStamp });
                        }
                    });
                    $$Scheduler.ChangeStatus(argument, Appointments)
                    .then(function () {
                        toaster.success("Appointment status changed successfully");
                        $scope.filterAllApptsGrid(FILTER_ALL);
                    })
                    .catch(function (err) {
                        toaster.error(SOMETHING_WENT_WRONG);
                        console.error(err);
                    })
                };

                //Logic for all appointments grid -- End

                //Logic for Missed/Pending Appointments -- Start
                const FILTER_MISSED_ALL = 'ALL';
                const FILTER_MISSED_MISSED = 'MISSED';
                const FILTER_MISSED_PENDING = 'PENDING';


                $scope.loadMissedApptsGrid = function(){

                    $scope.filterMissedApptsGrid(FILTER_MISSED_ALL);
                };

                function loadAllMissedAppts (){

                    $$AppointmentsService.GetRescheduledAppointments({
                        Filter: $scope.missedapptmodel.filters,
                        PageIndex: $scope.missedapptmodel.PageIndex,
                        PageSize: $scope.missedapptmodel.PageSize
                    }, $scope.patientid).success(function (resp) {
                        $scope.missedapptmodel.title = 'Missed/Pending Appointments : All';
                        $scope.missedapptmodel.data = resp.Result;
                        $scope.missedapptmodel.gridTotalRecords = resp.TotalRecords;
                        $scope.$broadcast('reformGrid');
                    }).error(function (error) {
                        toaster.error(SOMETHING_WENT_WRONG);
                        console.error(error);
                    });

                };


                function loadMissedAppts(){

                    $$AppointmentsService.GetMissedAppointments({
                        Filter: $scope.missedapptmodel.filters,
                        PageIndex: $scope.missedapptmodel.PageIndex,
                        PageSize: $scope.missedapptmodel.PageSize
                    }, $scope.patientid).success(function (resp) {
                        $scope.missedapptmodel.title = 'Missed/Pending Appointments : Missed';
                        $scope.missedapptmodel.data = resp.Result;
                        $scope.missedapptmodel.gridTotalRecords = resp.TotalRecords;
                        $scope.$broadcast('reformGrid');
                    }).error(function (error) {
                        toaster.error(SOMETHING_WENT_WRONG);
                        console.error(error);
                    });
                    
                };

                function loadPendingAppts (){

                    $$AppointmentsService.GetPendingAppointments({
                        Filter: $scope.missedapptmodel.filters,
                        PageIndex: $scope.missedapptmodel.PageIndex,
                        PageSize: $scope.missedapptmodel.PageSize
                    }, $scope.patientid).success(function (resp) {
                        $scope.missedapptmodel.title = 'Missed/Pending Appointments : Pending';
                        $scope.missedapptmodel.data = resp.Result;
                        $scope.missedapptmodel.gridTotalRecords = resp.TotalRecords;
                        $scope.$broadcast('reformGrid');
                    }).error(function (error) {
                        toaster.error(SOMETHING_WENT_WRONG);
                        console.error(error);
                    });
                    
                }



                showNewAppointment = function(selected){

                    if ($$Login.CheckPrivileges(41, "EDIT")) {
                    var data = {
                        "isRescheduled": true,
                        "PatientID": selected.PatientID,
                        "AppointmentID": selected.AppointmentID,
                        "ProviderID": selected.ProviderID,
                        "LocationID": selected.LocationID,
                        "Duration": selected.SlotLength,
                        "RowVersionStamp": selected.RowVersionStamp

                    };
                    $$AddAppointmentModal.open(data);
                    }
                }

                $scope.deleteRescheduledAppt = function(colname,row){

                $$DialogConfirm.open('Remove Appointment', 'This will remove the appointment from the reschedule queue. Do you want to proceed?')
                .then(function (value) {
                    if (value) {
                    var deletemodel = { "value": row.AppointmentID, "RowVersionStamp": row.RowVersionStamp };
                    $$Scheduler.DeleteAppointment(deletemodel)
                    .then(function (resp) {
                        toaster.success("Appointment deleted successfully.");
                        $scope.loadMissedApptsGrid();
                    }), function (err) {
                    toaster.error("Delete failed.");
                    console.error("delete failed", err);
                    };
                    }
                });


                }

                $scope.deletePermission = function(){
                    return $$Login.CheckPrivileges(41, "DELETE");
                };



                $scope.filterMissedApptsGrid = function(filter){
                    switch (filter) {
                        case FILTER_MISSED_ALL:
                        loadAllMissedAppts();
                        break;
                        case FILTER_MISSED_MISSED:
                        loadMissedAppts();
                        break;
                        case FILTER_MISSED_PENDING:
                        loadPendingAppts();
                        break;
                    }

                }
                //Logic for Missed/Pending Appointments -- End



            }];

            return {
                restrict: 'E',
                templateUrl: '/app/Shared/AppointmentsGrid/appointments-grid.html',
                controller: appointmentGridController,
                scope: {
                    patientid: '@'
                }

            }

        });
});