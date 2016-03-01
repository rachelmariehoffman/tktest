angular.module('Sort', [])
.service('SortServices', [function () {
    var service = this;
    var unsortedArray = [12, 3, 9];
    
    service.sortArray = function(unsortedArray) {
        return unsortedArray;
    };
}]);