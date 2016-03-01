angular.module('SortModule', [])
.service('SortServices', [function () {
    var service = this;

    service.sortArray = function(testArray) {
        
        for (var i = 0; i < testArray.length; i++) {
            if (testArray[i] > testArray[i+1]) {
                testArray[i] = testArray[i+1];
                testArray[i+1] = testArray[i];
            }
        }
        
        return testArray;
    };
}]);