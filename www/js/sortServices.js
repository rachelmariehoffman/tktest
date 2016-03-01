angular.module('SortModule', [])
.service('SortServices', [function () {
    var service = this;
    var testArray = [];

    service.sortArray = function(testArray) {
        return testArray;
    };
}]);