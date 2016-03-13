/*global angular,define*/

define(['angular',
    'app/Shared/Upload/documents-service',
    'app/Shared/fzClose/Directives/fz-close',
    'app/Shared/Services/lookup-service',
    'app/Shared/fzSubmit/Directives/fz-submit',
    'app/Shared/fzCancel/Directives/fz-cancel',
    'toaster',
    'app/Shared/fzGrid/Directives/fz-grid',
    'app/Shared/fzFile/Directives/fz-file'
], function () {
    return angular.module("eruditeApp.Patient.Documents.DocumentUploadDirective", ['toaster'])
   .directive("fzDocumentAttach", ['$compile', function ($compile) {
       return {
           restrict: "E",
           scope: {
               uploadType: '=',
           },
           replace: true,
           templateUrl: '/app/Shared/Upload/fz-document-attach.html',
           controller: ['$scope', '$element', '$$Documents', 'toaster', '$rootScope', '$document','$$Lookup',
           function ($scope, $element, $$Documents, toaster, $rootScope, $document,$$Lookup) {
               $scope.NewUpload = false;
               $scope.uiState = {};
               $scope.uploadModel = {};
               $scope.uiState.Divisions=[{DivisionID:null,DivisionName:'Select'}];
               $scope.uiState.Batches=[{BatchID:null,BatchStartYear:'Select'}];
               $scope.uiState.Courses=[{CourseID:null,CourseName:'Select'}];
               //Get All Divisions
               function getAllDivisions() {
                   $$Lookup.getAllDivisions()
                   .success(function (resp) {
                     //$scope.uiState.Divisions={DivisionID:null,DivisionName:'Select'}
                       $scope.uiState.Divisions.push.apply($scope.uiState.Divisions,resp);
                   })
                   .error(function () {
                       console.log("Could't get all divisions")
                   })
               }
               //Get all Batches
               function getAllBatches() {
                   $$Lookup.getAllBatches()
                   .success(function (resp) {
                       $scope.uiState.Batches.push.apply($scope.uiState.Batches,resp);
                   })
                   .error(function () {
                       console.log("Could't get all Batches")
                   })
               }
               //Get all Courses
               function getAllCourses() {
                   $$Lookup.getAllCourses()
                   .success(function (resp) {
                       $scope.uiState.Courses.push.apply($scope.uiState.Courses,resp);
                   })
                   .error(function () {
                       console.log("Could't get all Courses")
                   })
               }
               getAllDivisions();
               getAllBatches();
               getAllCourses();


               $scope.model = {
                   title: 'Uploads',
                   PageIndex: 1,
                   PageSize: 15,
                   filters: {},
                   data: [],
                   //infiniteScroll: true

               };
               $scope.onLoad = function () {
                   $$Documents.UploadGrid({
                       Filter: $scope.model.filters,
                       PageIndex: $scope.model.PageIndex,
                       PageSize: $scope.model.PageSize
                   })
                     .success(function (resp) {
                         $scope.model.data = resp.Result;
                         $scope.model.gridTotalRecords = resp.TotalRecords;
                         $scope.$broadcast('reformGrid');
                     })
                     .error(function (error) {

                         toaster.error("Something went wrong while loading the grid");
                     });
               };
               $scope.$on('filterChanged', function () {
                   $scope.model.data = [];
                   $scope.model.PageIndex = 1;
               });

               $scope.submitDocument = function (type) {
                   $scope.uploadModel.UploadType = $scope.uploadType;
                   var newDocument = new FormData();
                   newDocument.append('UploadedFile', $scope.uploadModel.File);
                   newDocument.append('UploadType', $scope.uploadModel.UploadType);
                   newDocument.append('Note', $scope.uploadModel.Note);
                   if ($scope.uploadModel.UploadType === "BATCH COURSE STUDENT" || $scope.uploadModel.UploadType === "BATCH COURSE TIMETABLE") {
                       var contxt = {
                           CollageID: 10001,
                           BatchID: $scope.uploadModel.BatchID,
                           CourseID: $scope.uploadModel.CourseID
                       };
                       newDocument.append('Context', JSON.stringify(contxt));
                   }
                   $$Documents.AddDocument(newDocument).success(function (resp) {
                       $rootScope.$broadcast('xtreset');
                       $scope.uploadModel = {};
                       $scope.NewUpload = true;
                       toaster.success("Document added Successfully");
                   }, function (error) {

                       showDocumentErrorMessages(error.data);
                   });
               };

               function showDocumentErrorMessages(error) {
                   if (error.ModelState) {
                       $scope.ServerErrorMessages = [];
                       $scope.ServerErrorMessages.push(error.ModelState);
                   } else {
                       toaster.error('Something went wrong!');
                   }
               }

               $scope.ViewUploadErrors = function (row) {
                   if (row.UploadStatus == 'COMPLETED WITH ERROR') {
                       $$Documents.ViewUploadErrors(row.UploadID);
                   }                 
               };

           }],
           link: function (scope, element, attributes) {
           }
       };
   }]);
});
