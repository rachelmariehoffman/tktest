angular.module('Sort', [])
.service('SortServices', [function () {
    var service = this;
    var array = [12, 3, 9];
    
    service.sortArray = function(array) {
        return array;
    };
}]);