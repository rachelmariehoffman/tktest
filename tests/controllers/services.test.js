describe('Services', function(){
    var scope;
    
    // load the controller's module
    beforeEach(module('ionic'));
    beforeEach(module('starter.controllers'));
    beforeEach(module('RESTConnection'));
    beforeEach(module('SSFAlerts'));
    beforeEach(module('Sort'));
    
    //Inject the scope and save it in a variable
    beforeEach(inject(function($rootScope, service) {
        scope = $rootScope.$new();
        $service('SortServices', {$scope: scope});
    }));
    
    // tests start here
    it('should have a title with value of Login', function(){
        expect(scope.array).toEqual([12, 3, 9]);
    });
});