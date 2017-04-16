var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);

addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){
	$scope.formData={};
	var coordinates = {};
	var lat = 0;
	var long = 0;

	$scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    $rootScope.$on("clicked", function(){

    // Run the gservice functions associated with identifying coordinates
    $scope.$apply(function(){
        $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
        $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
    });
    });
    $scope.addToilet = function(){

    	var toiletData = {
    	name: $scope.formData.name,
    	gender: $scope.formData.gender,
    	cleanliness_level: $scope.formData.cleanliness_level,
    	ply_number: $scope.formData.ply_number,
    	number_bathroom_stalls: $scope.formData.number_bathroom_stalls,
    	notes: $scope.formData.notes,
    	location: [$scope.formData.longitude, $scope.formData.latitude]
    	};

    	$http.post('/toilets', toiletData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.name = "";
                $scope.formData.gender = "";
                $scope.formData.cleanliness_level = "";
                $scope.formData.ply_number = "";
                $scope.formData.number_bathroom_stalls = "";
                $scope.formData.notes = "";
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
                
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };




});