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

//Country Border

// GeoJSON --------------

// Grab Country Borders -----------

// $(document).ready(function () {
//   $(window).on('load', function () {
//     $('.loader').fadeOut(1000);
//     $('.container-fluid').fadeIn(1000);
//   });

//   $.ajax({
//     url: 'libs/php/getCountryBorders.php',
//     type: 'POST',
//     dataType: 'json',
//     data: {},
//     success: function (result) {
//       console.log(JSON.stringify(result));

//       if (result.status.name == 'ok') {
//         L.geoJSON(result.data, {
//           style: { color: '#0d89d6' },
//         })
//           .bindPopup(function (layer) {
//             return layer.feature.properties.name;
//           })
//           .addTo(myMap);

//         // $('#datetime1').html(result.data[0]['datetime'])
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     },
//   });
// });

// // Event Handler on Left Click
// myMap.on('click', function (e) {
//   alert(e.latlng.toString());
//   alert(myMap.getZoom());
// });

//Get geolocation using Navigator

// var options = {
//   enableHighAccuracy: true,
//   timeout: 5000,
// };

// const successCallback = (position) => {
//   console.log(position);
//   myMap.getZoom();
// };

// const errorCallback = (error) => {
//   console.error(error);
// };

// const watchId = navigator.geolocation.getCurrentPosition(
//   successCallback,
//   errorCallback,
//   { options }
// );

// geoJson map countryborders extraction
// myMap.on('click', function (e) {
//   console.log(e);
//   $.ajax({
//     url: 'libs/php/getCountryBorders.php',
//     type: 'POST',
//     dataType: 'json',
//     data: {},
//     success: function (result) {
//       console.log(JSON.stringify(result.data));
//       if (result.status.name == 'ok') {
//         function zoomToFeature(e) {
//           myMap.fitBounds(e.target.getBounds());
//         }

//         function onEachFeature(feature, layer) {
//           layer.on({
//             click: zoomToFeature,
//           });
//         }

//         function onEachFeature(feature, layer) {
//           if (feature.geometry.type === 'MultiPolygon') {
//             layer.bindPopup(feature.geometry.coordinates.join(', '));
//           }
//         }

//         const filterData = result.data.features.filter(
//           (country) => country.properties.iso_a2 === 'AF'
//         );
//         if (border) {
//           border.remove();
//         }

//         border = L.geoJSON(filterData[0], {
//           style: { color: '#0d89d6' },
//           onEachFeature: onEachFeature,
//         }).addTo(myMap);
//         myMap.fitBounds(border.getBounds());
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     },
//   });
// });

// L.easyButton(
//   '<img src="libs/images/covid.png" style="width:25px; position: absolute; right: 2px; top: 2.5px;">',
//   function (btn, myMap) {
//     const home = [53.50296, -2.23643];
//     myMap.setView(home, 5);
//   }
// ).addTo(myMap);

// <!-- Classic Modal -->
// <div
//   class="modal fade"
//   id="myModal"
//   tabindex="-1"
//   role="dialog"
//   aria-labelledby="myModalLabel"
//   aria-hidden="true"
// >
//   <div class="modal-dialog">
//     <div class="modal-content">
//       <!-- Modal Header -->
//       <div class="modal-header">
//         <!-- <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
//                 <i class="material-icons">X</i>
//             </button> -->
//         <h4 class="modal-title float-left" id="Country-Name">
//           Country Name
//         </h4>
//       </div>
//       <div class="modal-body">
//         <div id="modal-description">
//           <p>Country Information...</p>
//         </div>
//         <div id="modal-description2">
//           <p>Country Information...</p>
//         </div>
//         <div id="modal-description3">
//           <p>Country Information...</p>
//         </div>
//       </div>
//       <div class="modal-footer">
//         <!-- <button type="button" class="btn btn-simple">Nice Button</button> -->
//         <!-- <button type="button" class="btn btn-danger btn-simple" data-dismiss="modal">Close</button> -->
//         <button
//           id="closeModal"
//           type="button"
//           class="btn btn-danger"
//           data-bs-dismiss="modal"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
// <!--  End Modal -->
