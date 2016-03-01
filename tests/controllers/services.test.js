describe('Services', function(){
    var sortServicesObject;
    
    // load the service's module
    beforeEach(module('SortModule'));
    
    //Inject the scope and save it in a variable
    beforeEach(inject(function(SortServices) {
        sortServicesObject = SortServices;
    }));
    
    // tests start here
    it('array should show unsorted numbers', function(){
        var unsortedArray = [12, 3, 9];
        var sorted = sortServicesObject.sortArray(unsortedArray);
        expect(unsortedArray).toEqual(sorted);
    });
});