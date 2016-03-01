describe('Services', function(){
    var sortServiceObject;
    
    // load the service's module
    beforeEach(module('Sort'));
    
    //Inject the scope and save it in a variable
    beforeEach(inject(function(sortServices) {
        sortServiceObject=SortServices;
    }));
    
    // tests start here
    it('array should show unsorted numbers', function(){
        var unsortedArray = [12, 3, 9];
        expected(unsortedArray).toEqual([12, 3, 9]);
    });
});