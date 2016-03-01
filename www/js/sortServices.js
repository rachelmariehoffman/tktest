angular.module('SortModule', [])
.service('SortServices', [function () {
    var service = this;

    service.sortArray = function(unsortedArray) {
        return unsortedArray;
    };
}]);