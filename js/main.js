var locationData = [
	{
		locationName: 'Embarcadero Station',
		latLng: {lat: 37.793,lng: -122.397}
	},
	{
		locationName: 'Montgomery Station',
		latLng: {lat: 37.789,lng: -122.401}
	},
	{
		locationName: 'Powell St. Station',
		latLng: {lat: 37.785, lng: -122.407}
	},
	{
		locationName: 'Civic Center Station',
		latLng: {lat: 37.780,lng: -122.414}
	},
	{
		locationName: '16th St. Mission Station',
		latLng: {lat: 37.765,lng: -122.420}
	}
];
var viewModel = function() {
  var self = this;
  
  
// build map  
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.781, lng:-122.414},
    zoom: 14
  });

// build data
  self.allPlaces = [];
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });
  
  
//build marker
  self.allPlaces.forEach(function(place) {
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng
    };
    place.marker = new google.maps.Marker(markerOptions);

    //ajax wiki
    var wikiUrl =  'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + place.locationName + '&format=json&callback=wikiCallback';
    var information;
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        // jsonp: "callback",
        success: function(response) {
          var articleList = response[2];
          if(!articleList) {
            articleList = "Unable to find resource";
          }
          var contentString = '<div>'+ place.locationName + '</div>' + '<div>' + articleList + '</div>';
          place.infoWindow = new google.maps.InfoWindow({
            content: contentString
          });
        }
    }).fail();
    //Build infowindow
    //add eventlisten for clicking marker
    place.marker.addListener('click', function() {
      place.infoWindow.open(self.googleMap, place.marker);
      place.marker.setAnimation(google.maps.Animation.BOUNCE);
      setInterval(function() {
        place.infoWindow.close();
        place.marker.setAnimation(null);
      }, 2000);
    });
  });
  // filtered list
  self.visiblePlaces = ko.observableArray();
  //make all place visible
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
  });
  
  //this is user input for filter
  self.userInput = ko.observable('');
  
  
  //making filter marker
    self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    
    self.visiblePlaces.removeAll();
    
    
    self.allPlaces.forEach(function(place) {
      place.marker.setVisible(false);
      
      if (place.locationName.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
      }
    });
    
    
    self.visiblePlaces().forEach(function(place) {
      place.marker.setVisible(true);
    });
  };

  //making list click
  self.itemClick = function(place) {
    place.infoWindow.open(self.googleMap, place.marker);
      place.marker.setAnimation(google.maps.Animation.BOUNCE);
      setInterval(function() {
        place.infoWindow.close();
        place.marker.setAnimation(null);
      }, 2000);
  }
  
  //create Place
  function Place(dataObj) {
    this.locationName = dataObj.locationName;
    this.latLng = dataObj.latLng;
    this.marker = null;
  }
  
};

ko.applyBindings(new viewModel());
