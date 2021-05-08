//getgeolocation ---------------
// placeholders for the L.marker and L.circle representing user's current position and accuracy
var current_position, current_accuracy;

function onLocationFound(e) {
  // if position defined, then remove the existing position marker and accuracy circle from the map
  if (current_position) {
    mymap.removeLayer(current_position);
    mymap.removeLayer(current_accuracy);
  }

  var radius = e.accuracy / 8;

  current_position = L.marker(e.latlng)
    .addTo(mymap)
    .bindPopup('You are within ' + radius + ' meters from this point')
    .openPopup();

  current_accuracy = L.circle(e.latlng, radius).addTo(mymap);
}

function onLocationError(e) {
  alert(e.message);
}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

// wrap map.locate in a function
function locate() {
  mymap.locate({ setView: true, maxZoom: 18 });
}

// call locate every 3 seconds... forever
setInterval(locate, 1000);
// getgeolocation ---------------
