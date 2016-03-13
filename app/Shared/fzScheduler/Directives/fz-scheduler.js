// angular.module("eruditeApp.Shared.Scheduler", [])

// .directive("fzScheduler", function($window, $document, $timeout) {
//   return {
//     restrict: "A",

//     link: function(scope, element, attributes) {

//       var fzWindow = angular.element($window),
//         fzDocument = angular.element($document);

//       element.addClass('show');

//       scope.mode = "day";


//       scope.fzsStyles = {
//         width: 0,
//         height: 0
//       }
//       scope.fzsHeaderStyles = {
//         width: 0,
//         height: 0,
//         top: 0,
//         left: 0
//       }
//       scope.fzsTimeslotStyles = {
//         width: 0,
//         height: 0,
//         top: 0,
//         left: 0
//       }
//       scope.fzsContentStyles = {
//         width: 0,
//         height: 0,
//         top: 0,
//         left: 0
//       }


//       var set_fzsWidth = function() {


//         scope.$apply(function() {
//           scope.fzsStyles.width = fzWindow.width() - element.offset().left - 15
//         });
//       }
//       var set_fzsHeight = function() {
//         var footerHeight;
//         if (fzWindow.height() <= fzDocument.find('.fz-footer').offset().top) {
//           footerHeight = 15;
//         } else {
//           footerHeight = (fzWindow.height() - fzDocument.find('.fz-footer').offset().top) + 15;
//         }
//         scope.$apply(function() {
//           scope.fzsStyles.height = fzWindow.height() - element.offset().top - footerHeight;
//         });
//       }

//       fzWindow.on("resize", function() {
//         set_fzsWidth()
//         set_fzsHeight();
//       });
//       element.closest(".fz-wrapper").on("scroll", function() {
//         // element.scrollTop - is the pixels hidden in top due to the scroll.With no scroll its value is 0.
//         // element.scrollHeight - is the pixels of the whole div.
//         // element.clientHeight - is the pixels that you see in your browser.
//         set_fzsWidth()
//         set_fzsHeight();
//       })
//     }
//   }
// });
