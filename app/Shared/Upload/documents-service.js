
define(["angular",
    'app/eruditeconfig',
    'ngDialog',
    'app/Shared/fzClose/Directives/fz-close',
    'app/Shared/fzSubmit/Directives/fz-submit',
    'app/Shared/fzCancel/Directives/fz-cancel',
    'app/Shared/fzFile/Directives/fz-file.js'
], function () {

    return angular.module('eruditeApp.Patient.documentsService', [])
  .service('$$Documents', ['$http', 'ERUDITE_CONFIG', 'ngDialog', '$q',

    function ($http, ERUDITE_CONFIG, ngDialog, $q) {
        var apiUrl = ERUDITE_CONFIG.baseUrl;

        this.UploadGrid = function (gridRequest) {

            var deferred = $q.defer(),
                   promise = deferred.promise;
            $http.post(apiUrl + 'upload/get-all-uploads', gridRequest)
            .then(function (resp) {
                deferred.resolve(resp.data);
            })
            .catch(function (error) {
                deferred.reject(error.data);
            });
            promise.success = function (callback) {
                promise.then(callback);
                return promise;
            };
            promise.error = function (callback) {
                promise.catch(callback);
                return promise;
            };
            return promise;
        }
        this.DocumentGriddirective = function (gridRequest, patientID) {

            return $http.post(apiUrl + 'documents/get-all-documents-by-patient/' + patientID, gridRequest);
        }

        this.ViewUploadErrors = function (uploadID) {
            var deferred = $q.defer();
            window.open(apiUrl + 'upload/get-upload-error-report/' + uploadID, '_blank');
            deferred.resolve();
            return deferred.promise;
        }

        this.Delete = function (documentIds) {
            return $http.post(apiUrl + 'documents/Delete', documentIds);
        }
        this.AddDocument = function (addDocument) {
            return $http.post(apiUrl + 'upload/add', addDocument, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            });
        }

        this.open = function (id) {
            var deferred = $q.defer();
            ngDialog.openConfirm({
                template: 'app/Shared/Upload/add-document-modal.html',
                className: "large",
                resolve: {
                    id: function () {
                        return id;
                    }
                },
                controller: documentModalController
            }).then(function (value) {
                deferred.resolve(value);
            }).catch(function () {
                deferred.resolve(false);
            });
            return deferred.promise;
        };

        var documentModalController = ['$scope', '$$Documents', 'toaster', '$$Lookup', '$element', '$filter', 'id', '$rootScope',
          function ($scope, $$Documents, toaster, $$Lookup, $element, $filter, id, Upload, $rootScope) {

              $scope.addDocument = {};
              $scope.availablePatients = [];
              $scope.ServerErrorMessages = [];
              $scope.uiState = {};
              $scope.uiState.showDocumentsTab = false
              $scope.uiState.selectPatientTab = true;
              $scope.isPatientContext = false;
              $scope.getAllPatients = function () {
                  $$Lookup.getPatients()
                    .success(function (resp) {
                        $scope.availablePatients = angular.copy(resp);
                    })
                    .error(function (error) {
                        ShowDocumentErrorMessages(error);
                    });
              }
              $scope.addDocuments = function () {
                  $scope.uiState.showDocumentsTab = true
                  $scope.uiState.selectPatientTab = false;
              }
              $scope.showPatient = function () {
                  $scope.uiState.showDocumentsTab = false
                  $scope.uiState.selectPatientTab = true;
              }
              //Submit a new document
              $scope.submitDocument = function (type) {
                  var newDocument = new FormData();
                  newDocument.append('UploadedFile', $scope.addDocument.File);
                  newDocument.append('DocumentType', $scope.addDocument.DocumentType);
                  newDocument.append('Description', $scope.addDocument.Description);
                  newDocument.append('PatientID', $scope.addDocument.patientID);
                  $$Documents.AddDocument(newDocument).then(function (resp) {

                      if (type == 'Save') {
                          $scope.closeThisDialog();
                      }
                      $scope.addDocument = {};
                      if (id) {
                          $scope.addDocument.patientID = id;
                      }
                      toaster.success("Document added Successfully");
                  }, function (error) {
                      ShowDocumentErrorMessages(error.data);
                  });
              }


              function ShowDocumentErrorMessages(error) {
                  if (error.ModelState) {
                      $scope.ServerErrorMessages = [];
                      $scope.ServerErrorMessages.push(error.ModelState);
                  } else {
                      toaster.error('Something went wrong!');
                  }
              }
              if (!id) {
                  $scope.getAllPatients();
              } else {
                  $scope.uiState.showDocumentsTab = true
                 // $scope.uiState.selectPatientTab = true;
                  $scope.addDocument.patientID = id;
                  $scope.isPatientContext = true;
              }


          }
        ];

    }
  ]);
});
