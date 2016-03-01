angular.module('SortModule', [])
.service('SortServices', [function () {
    var service = this;

    service.sortArray = function(testArray) {
        
        var counter = 0;
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
                    counter++;
                }
            }
        } while (repeat);
            return {testArray, counter};
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