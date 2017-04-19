// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;

        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        googleMapService.refresh = function(latitude, longitude){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // Perform an AJAX call to get all of the records in the db.
            $http.get('/toilets').success(function(response){

                // Convert the results into Google Map Format
                locations = convertToMapPoints(response);

                // Then initialize the map.
                initialize(latitude, longitude);
            }).error(function(data){
                console.log("Error refreshing Google Maps" + data)
            });
        };

        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locationsMapPoints = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var toilet = response[i];

                // Create popup windows for each record
                var  contentString =
                    '<p><h4>' + toilet.name + '</h4>' +
                    '<br><b>Gender</b>: ' + toilet.gender +
                    '<br><b>Cleanliness Level</b>: ' + toilet.cleanliness_level +
                    '<br><b>Ply Number</b>: ' + toilet.ply_number +
                    '<br><b>Number of Bathroom Stalls</b>: ' + toilet.number_bathroom_stalls +
                    '<br><b>Notes</b>: ' + toilet.notes +
                    '</p>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locationsMapPoints.push({
                    latlon: new google.maps.LatLng(toilet.location[1], toilet.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    name: toilet.name,
                    gender: toilet.gender,
                    cleanliness_level: toilet.cleanliness_level,
                    ply_number: toilet.ply_number,
                    number_bathroom_stalls: toilet.number_bathroom_stalls,
                    notes: toilet.notes


            });
        }
        // location is now an array populated with records in Google Maps format
        return locationsMapPoints;
    };

// Initializes the map
var initialize = function(latitude, longitude) {

    // If map has not been created already...
    if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: new google.maps.LatLng(selectedLat, selectedLong)
        });
    }
    var initialLocation = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos) {
        var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        marker.setPosition(me);
        map.setZoom(14);
        map.panTo(marker.position);
    }, function(error) {
        // ...
    });
    }


    // Loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

            // When clicked, open the selected marker's message
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    // Set initial location as a bouncing red marker
  
    lastMarker = marker;

    // Clicking on the Map moves the bouncing red marker
    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // When a new spot is selected, delete the old red bouncing marker
        if(lastMarker){
            lastMarker.setMap(null);
        }

        // Create a new red bouncing marker and move to it
        lastMarker = marker;
        map.setZoom(14);
        map.panTo(marker.position);

        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });

};



// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load', googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});
