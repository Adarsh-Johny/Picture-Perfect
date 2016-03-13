/*global angular,define*/

define(['angular',
    'app/Shared/Upload/documents-service',
    'app/Shared/fzClose/Directives/fz-close',
    'app/Shared/Services/lookup-service',
    'app/Shared/fzSubmit/Directives/fz-submit',
    'app/Shared/fzCancel/Directives/fz-cancel',
    'toaster',
    'app/Shared/fzGrid/Directives/fz-grid',
    'app/Shared/fzFile/Directives/fz-file',
    'app/User/Student/Attendance/Shared/attendance-service',
    'app/User/Student/Attendance/record-attendance-service'
], function () {
    return angular.module("eruditeApp.Student.AttendanceRecordController", ['toaster'])
    .controller('AttendanceRecordController', ['$scope', '$element', '$$Attendance', 'toaster', '$rootScope', '$document', '$$Lookup','$$AttendanceRecord',
           function ($scope, $element, $$Attendance, toaster, $rootScope, $document, $$Lookup, $$AttendanceRecord) {
              
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


               //$scope.model = {
               //    title: 'Uploads',
               //    PageIndex: 1,
               //    PageSize: 15,
               //    filters: {},
               //    data: [],
               //    //infiniteScroll: true

               //};

               $scope.attendanceModel = $scope.attendanceModel || {};
               $scope.attendanceModel.Date = new Date();

               //$scope.onLoad = function () {
               //    //$$Documents.UploadGrid({
               //    //    Filter: $scope.model.filters,
               //    //    PageIndex: $scope.model.PageIndex,
               //    //    PageSize: $scope.model.PageSize
               //    //})
               //    //  .success(function (resp) {
               //    //      $scope.model.data = resp.Result;
               //    //      $scope.model.gridTotalRecords = resp.TotalRecords;
               //    //      $scope.$broadcast('reformGrid');
               //    //  })
               //    //  .error(function (error) {

               //    //      toaster.error("Something went wrong while loading the grid");
               //    //  });
               //};
               //$scope.$on('filterChanged', function () {
               //    $scope.model.data = [];
               //    $scope.model.PageIndex = 1;
               //});


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


               $scope.GetClassScheduleDetailsForDay = function () {

                   var model = {
                       BatchID: $scope.attendanceModel.BatchID,
                       CourseID: $scope.attendanceModel.CourseID,
                       Date: $scope.attendanceModel.Date,
                       DivisionID: 1,
                       CollageID: 10001
                   };
                   $$Attendance.getClassscheduleDetails(model)
                      .success(function (resp) {
                          $scope.ClassSchedules = resp;
                      })
                      .error(function (error) {
                          console.log(error);
                          toaster.error("Something went wrong");
                      });                 
                   
               };

               $scope.SaveStudentAttendanceDetails = function () {
                   debugger;

                   console.log($scope.Attendance);
                   $$AttendanceRecord.saveStudentAttendanceDetails($scope.Attendance)
                    .success(function (resp) {
                        toaster.success("Attendance saved successfully");
                    })
                    .error(function (error) {
                        console.log(error);
                        toaster.error("Something went wrong");
                    });                 
               };
           }
   ]);
});
