angular.module('SortModule', [])
.service('SortServices', [function () {
    var service = this;

    service.sortArray = function(testArray) {

        var repeat = false;
        do {
            repeat = false;
            for (var i = 0; i < testArray.length; i++) {
                if (testArray[i] > testArray[i++]) {
                    var temp = testArray[i];
                    var temp2 = testArray[i++];
                    testArray[i] = temp2;
                    testArray[i++] = temp;
                    repeat = true;
                }
            }
        } while (repeat);
            return testArray;
    };
}]);



/*
for (var i = 0; i < testArray.length; i++) {
    for (var i = 0; i < testArray.length; i++) {
        if (testArray[i] > testArray[i++]) {
            var temp = testArray[i];
            var temp2 = testArray[i++];
            testArray[i] = temp2;
            testArray[i++] = temp;
        }
    }
    return testArray;
}
*/