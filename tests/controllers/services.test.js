describe('Services', function(){
    var sortServicesObject;
    
    // load the service's module
    beforeEach(module('SortModule'));
    
    //Inject the scope and save it in a variable
    beforeEach(inject(function(sortServices) {
        sortServicesObject = sortServices;
    }));
    
    // tests start here
    it('array should show unsorted numbers', function(){
        var unsortedArray = [12, 3, 9];
        expected(unsortedArray).toEqual([12, 3, 9]);
    });
});