/*global angular,define*/

define(['angular',
  
    'app/Shared/fzClose/Directives/fz-close',
    'app/Shared/Services/lookup-service',
    'app/Shared/fzSubmit/Directives/fz-submit',
    'app/Shared/fzCancel/Directives/fz-cancel',
    'toaster',
    'app/Shared/fzGrid/Directives/fz-grid',
    'app/Shared/fzFile/Directives/fz-file',
    'app/User/Student/Attendance/Shared/attendance-service',
    'app/User/Student/Attendance/absent-list-service'
], function () {
    return angular.module("eruditeApp.Student.AbsentListController", ['toaster'])
    .controller('AbsentListController', ['$scope', '$element', '$$Attendance', 'toaster', '$rootScope', '$document', '$$Lookup', '$$AbsentList',
           function ($scope, $element, $$Attendance, toaster, $rootScope, $document, $$Lookup, $$AbsentList) {

               $scope.uiState = {};
               $scope.uploadModel = {};
               $scope.uiState.Divisions = [{ DivisionID: null, DivisionName: 'Select' }];
               $scope.uiState.Batches = [{ BatchID: null, BatchStartYear: 'Select' }];
               $scope.uiState.Courses = [{ CourseID: null, CourseName: 'Select' }];


               //Get All Divisions
               function getAllDivisions() {
                   $$Lookup.getAllDivisions()
                   .success(function (resp) {
                       //$scope.uiState.Divisions={DivisionID:null,DivisionName:'Select'}
                       $scope.uiState.Divisions.push.apply($scope.uiState.Divisions, resp);
                   })
                   .error(function () {
                       console.log("Could't get all divisions")
                   })
               }
               //Get all Batches
               function getAllBatches() {
                   $$Lookup.getAllBatches()
                   .success(function (resp) {
                       $scope.uiState.Batches.push.apply($scope.uiState.Batches, resp);
                   })
                   .error(function () {
                       console.log("Could't get all Batches")
                   })
               }
               //Get all Courses
               function getAllCourses() {
                   $$Lookup.getAllCourses()
                   .success(function (resp) {
                       $scope.uiState.Courses.push.apply($scope.uiState.Courses, resp);
                   })
                   .error(function () {
                       console.log("Could't get all Courses")
                   })
               }
               getAllDivisions();
               getAllBatches();
               getAllCourses();


               $scope.attendanceModel = $scope.attendanceModel || {};
               $scope.attendanceModel.Date = new Date();

               $scope.ClassScheduleChange = function (classScheduleID) {
                   $scope.attendanceModel.ClassScheduleID = classScheduleID;
                   $scope.GetStudentAttendanceDetails();
               }

               $scope.GetStudentAttendanceDetails = function () {

                   var model = {
                       BatchID: $scope.attendanceModel.BatchID,
                       CourseID: $scope.attendanceModel.CourseID,
                       ClassScheduleID: $scope.attendanceModel.ClassScheduleID,
                       DivisionID: 1,
                       CollageID: 10001
                   };
                   if (model.ClassScheduleID > 0) {

                       $$Attendance.getStudentAttendanceDetails(model)
                     .success(function (result) {
                         var isNeW = true;
                         result.Attendance.forEach(function (attend) {
                             if (attend.AttendanceID > 0) {
                                 isNeW = false;
                             }
                         });
                         if (isNeW) {
                             result.Attendance.forEach(function (attend) {
                                 if (attend.AttendanceID == 0) {
                                     attend.IsStudentAttended = true;

                                 }
                             });
                         }
                         $scope.Attendance = result.Attendance;
                         console.log(result);
                     })


                     .error(function (error) {
                         console.log(error);
                         toaster.error("Something went wrong");
                     });
                   }
                   else {
                       $scope.Attendance = null;

                   }
               };





               $scope.GetClassScheduleDetailsForDay = function ( model) {

                
                   $$Attendance.getClassscheduleDetails(model)
                      .success(function (resp) {
                          $scope.ClassSchedules = resp;
                         
                      })
                      .error(function (error) {
                         
                          console.log(error);
                          toaster.error("Something went wrong");
                      });                

               };



               $scope.GetStudentAbsentDetailsForDay = function () {
                   var model = {
                       BatchID: $scope.attendanceModel.BatchID,
                       CourseID: $scope.attendanceModel.CourseID,
                       Date: $scope.attendanceModel.Date,
                       DivisionID: 1,
                       CollageID: 10001
                   };
                   $scope.GetClassScheduleDetailsForDay(model);
                   $$AbsentList.getStudentAbsentDetailsForDay(model)
                      .success(function (resp) {
                          $scope.Attendance = resp;                        
                      })
                      .error(function (error) {                          
                          console.log(error);
                          toaster.error("Something went wrong");
                      });

               }

               $scope.AddAbsentNotificationToQueue = function () {                   
                   console.log($scope.Attendance);
                   $$AbsentList.addAbsentNotificationToQueue($scope.Attendance)
                    .success(function (resp) {
                        toaster.success("Attendance Notification saved successfully");
                    })
                    .error(function (error) {
                        console.log(error);
                        toaster.error("Something went wrong");
                    });
               };
           }
    ]);
});
