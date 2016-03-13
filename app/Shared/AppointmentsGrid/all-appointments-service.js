define(['angular',
    'app/eruditeconfig',
], function () {
    return angular.module('eruditeApp.Shared.AppointmentsGridService', [])
.service('$$AppointmentsService', ['$q', '$http', 'ERUDITE_CONFIG', '$filter', function ($q, $http, ERUDITE_CONFIG, $filter) {
    var baseUrl = ERUDITE_CONFIG.baseUrl;
    var self = this;
    self.GetAllAppts = function (gridRequest, patientid) {
        if (angular.isDefined(patientid)) {
            return $http.post(baseUrl + 'appointment/get-all-patient-appointment/' + patientid, gridRequest);
        } else {
            return $http.post(baseUrl + 'appointment/get-all', gridRequest);
        }
    };


    self.GetPastAppt = function (gridRequest, patientid) {
        if (angular.isDefined(patientid)) {
            return $http.post(baseUrl + 'appointment/get-past-patient-appointment/' + patientid, gridRequest);

        } else {
            return $http.post(baseUrl + 'appointment/get-past-appointments', gridRequest);
        }
    };

    self.GetUpcomingAppt = function (gridRequest, patientid) {
        if (angular.isDefined(patientid)) {
            return $http.post(baseUrl + 'appointment/get-upcoming-patient-appointment/' + patientid, gridRequest);

        } else {
            return $http.post(baseUrl + 'appointment/get-upcoming-appointments', gridRequest);
        }
    };
    self.PopulateAppointmentModel = function (model) {
        var AllAppointmentsModel = [];
        for (var i = 0; i < model.length; i++) {
            AllAppointmentsModel.push(AppointmentModel(model[i]));
        }
        return AllAppointmentsModel;
    }


self.GetRescheduledAppointments = function(gridRequest, patientid) {
        if (angular.isDefined(patientid)) {
            return $http.post(baseUrl + 'appointment/get-patient-reschedule-queue?patientID=' + patientid, gridRequest);
        } else {
            return $http.post(baseUrl + 'appointment/get-reschedule-queue',gridRequest)
        }
    };
self.GetMissedAppointments = function(gridRequest, patientid) {
        if (angular.isDefined(patientid)) {
            return $http.post(baseUrl + 'appointment/get-patient-missed-reschedule-queue?patientID=' + patientid, gridRequest);
        } else {
            return $http.post(baseUrl + 'appointment/get-missed-reschedule-queue',gridRequest)
        }
    };
self.GetPendingAppointments = function(gridRequest, patientid) {
        if (angular.isDefined(patientid)) {
            return $http.post(baseUrl + 'appointment/get-patient-pending-reschedule-queue?patientID=' + patientid, gridRequest);
        } else {
            return $http.post(baseUrl + 'appointment/get-pending-reschedule-queue',gridRequest)
        }
    };



    function AppointmentModel(model) {
        var newmodel = {};
        newmodel.AppointmentDate = model.AppointmentDate || "";
        newmodel.AppointmentID = model.AppointmentID || 0;
        newmodel.AppointmentType = model.AppointmentType || "";
        newmodel.AppointmentTime = model.AppointmentTime || '';
        newmodel.Location = model.Location || "";
        newmodel.Operatory = model.Operatory || "";
        newmodel.Patient = model.Patient || "";
        newmodel.Provider = model.Provider || "";
        newmodel.Status = model.Status || "";
        newmodel.RowVersionStamp = model.RowVersionStamp || "";
        return newmodel;
    }

}]);
});