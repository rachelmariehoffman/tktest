angular.module('Sort', [])
.service('SortServices', [function () {
    var service = this;

    service.sortArray = function(unsortedArray) {
        return unsortedArray;
    };
}]);