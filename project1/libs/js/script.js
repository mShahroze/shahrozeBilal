let mapOptions;
let myMap;
let border;

function getRandomLatLng(myMap) {
  var bounds = myMap.getBounds(),
    southWest = bounds.getSouthWest(),
    northEast = bounds.getNorthEast(),
    lngSpan = northEast.lng - southWest.lng,
    latSpan = northEast.lat - southWest.lat;

  return new L.LatLng(
    southWest.lat + latSpan * Math.random(),
    southWest.lng + lngSpan * Math.random()
  );
}

// Added Map, MapTile

const Topo = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  {
    tileSize: 256,
    attribution:
      'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
  }
);

const Sat = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    tileSize: 256,
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  }
);

let baseMaps = {
  "<span style='color: tan'>Esri - World Topo Map</span>": Topo,
  "<span style='color: darkgreen'>Esri - World Topo Map</span>": Sat,
};

mapOptions = {
  center: [53.50296, -2.23643],
  zoom: 5,
  minZoom: 3,
  maxZoom: 13,
  attributionControl: false,
};

function createMap(latlng) {
  myMap = L.map('geomap', mapOptions).setView(latlng, 8);
  setTimeout(function () {
    myMap.invalidateSize.bind(myMap);
  }, 500);
}

$(document).ready(function () {
  // On Page load
  $(window).on('load', function () {
    $('.loader').fadeOut(2000);
    $('.container-fluid').fadeIn(2000);
  });

  // on Load - Current Location

  navigator.geolocation.getCurrentPosition(function (location) {
    const latlng = new L.LatLng(
      location.coords.latitude,
      location.coords.longitude
    );

    // console.log(latlng);
    createMap(latlng);

    L.control.layers(baseMaps).addTo(myMap);

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      {
        tileSize: 256,
        attribution:
          'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
      }
    ).addTo(myMap);

    const homeIcon = L.icon({
      iconUrl: 'libs/images/home-marker.png',
      iconSize: [48, 48],
      iconAnchor: [24, 10],
    });

    const marker = L.marker(latlng, { icon: homeIcon }).addTo(myMap);

    L.easyButton(
      '<img src="libs/images/location.png" style="width:25px; position: absolute; right: -4px; top: 1.5px;">',
      function (btn, myMap) {
        const home = [53.50296, -2.23643];
        myMap.setView(home, 5);

        $.ajax({
          url: 'libs/php/getCountryData.php',
          type: 'POST',
          dataType: 'json',
          success: function (result) {
            if (result.status.name == 'ok') {
              function zoomToFeature(e) {
                myMap.fitBounds(e.target.getBounds());
              }

              function onEachFeature(feature, layer) {
                layer.on({
                  click: zoomToFeature,
                });
              }

              if (myMap.hasLayer(border)) {
                myMap.removeLayer(border);
              }

              const filterData = result.countryFeatures.features.filter(
                (country) => country.properties.iso_a2 === 'GB'
              );

              border = L.geoJSON(filterData[0], {
                style: function (feature) {
                  return {
                    color: '#33ADFF',
                    weight: 5,
                    opacity: 0.65,
                  };
                },
                onEachFeature: onEachFeature,
              }).addTo(myMap);
              myMap.fitBounds(border.getBounds().pad(0.5));
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
          },
        });
      }
    ).addTo(myMap);

    L.easyButton(
      '<img src="libs/images/information.png" style="width:25px; position: absolute; right: -4px; top: 1.5px;">',
      function (btn, myMap) {
        let name = $('#selCountry').val();
        // let markers = L.markerClusterGroup();
        // markers.addLayer(L.marker(getRandomLatLng(myMap), { icon: homeIcon }));
        // myMap.addLayer(markers);
        $.ajax({
          url: 'libs/php/getCountryData.php',
          type: 'POST',
          dataType: 'json',
          success: function (result) {
            if (result.status.name == 'ok') {
              let filteredData = result.countryFeatures.features.forEach(
                (countryFeature) => {
                  if (countryFeature.properties.name === name) {
                    $('#myModal').modal('show');
                    $('#Country-Name').html(countryFeature.properties.name);
                  }
                }
              );
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
          },
        });
      }
    ).addTo(myMap);

    L.easyButton(
      '<img src="libs/images/weather.png" style="width:25px; position: absolute; right: -4px; top: 1.5px;">',
      function (btn, myMap) {
        // let markers = L.markerClusterGroup();
        // markers.addLayer(L.marker(getRandomLatLng(myMap), { icon: homeIcon }));
        // myMap.addLayer(markers);
        $.ajax({
          url: 'libs/php/getCountryData.php',
          type: 'POST',
          dataType: 'json',
          success: function (result) {
            console.log(result.countryWeatherList);
            const geojsonMarkerOptions = {
              radius: 8,
              fillColor: '#ff7800',
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8,
            };

            // const geojsonWeather =

            L.geoJSON(result.countryWeatherList, {
              pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
              },
            }).addTo(myMap);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
          },
        });
      }
    ).addTo(myMap);

    L.easyButton(
      '<img src="libs/images/covid.png" style="width:25px; position: absolute; right: -4px; top: 1.5px;">',
      function (btn, myMap) {
        const home = [53.50296, -2.23643];
        myMap.setView(home, 5);
      }
    ).addTo(myMap);
  });

  // Country Code and Country name in Select

  $.ajax({
    url: 'libs/php/getCountryData.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      // console.log(JSON.stringify(result));
      if (result.status.name == 'ok') {
        countryArray = result.countryNames;

        for (var i = 0; i < countryArray.length; i++) {
          $('#selCountry').append(
            $('<option>', {
              value: countryArray[i].code,
              text: `(${countryArray[i].code}) ${countryArray[i].name}`,
            })
          );
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });

  $(document).on('click', '#selCountry', function () {
    let name = $('#selCountry').val();
    // const myLayer = L.geoJSON().addTo(myMap);
    $.ajax({
      url: 'libs/php/getCountryData.php',
      type: 'POST',
      dataType: 'json',
      success: function (result) {
        // console.log(JSON.stringify(result.countryBorders));
        // myLayer.addData(result.countryBorders);

        if (myMap.hasLayer(border)) {
          myMap.removeLayer(border);
        }

        const filteredData = result.countryBorders.filter(
          (countryBorder) => countryBorder.code === name
        );

        border = L.geoJSON(filteredData[0], {
          style: function (feature) {
            return {
              color: '#33ADFF',
              weight: 5,
              opacity: 0.65,
            };
          },
        }).addTo(myMap);
        myMap.fitBounds(border.getBounds().pad(0.5));
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
    });
  });

  // $(document).on('click', '#selCountry', function () {
  //   let name = $('#selCountry').val();
  //   $.ajax({
  //     url: 'libs/php/getCountryData.php',
  //     type: 'POST',
  //     dataType: 'json',
  //     success: function (result) {
  //       // console.log(JSON.stringify(result.countryBorders));
  //       if (result.status.name == 'ok') {
  //         // function highlightFeature(e) {
  //         //   const layer = e.target;

  //         //   layer.setStyle({
  //         //     weight: 5,
  //         //     color: '#666',
  //         //     dashArray: '',
  //         //     fillOpacity: 0.7,
  //         //   });

  //         //   if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
  //         //     layer.bringToFront();
  //         //   }
  //         // }

  //         // function resetHighlight(e) {
  //         //   border.resetStyle(e.target);
  //         // }

  //         // function zoomToFeature(e) {
  //         //   myMap.fitBounds(e.target.getBounds());
  //         // }

  //         // function onEachFeature(feature, layer) {
  //         //   layer.on({
  //         //     mouseover: highlightFeature,
  //         //     mouseout: resetHighlight,
  //         //     click: zoomToFeature,
  //         //   });
  //         // }

  //         // function onEachFeature(feature, layer) {
  //         //   if (feature.geometry.type === 'MultiPolygon') {
  //         //     layer.bindPopup(feature.geometry.coordinates.join(', '));
  //         //   }
  //         // }

  //         // if (myMap.hasLayer(border)) {
  //         //   myMap.removeLayer(border);
  //         // }

  //         const filteredData = result.countryBorders.filter(
  //           (countryBorder) => countryBorder.code === name
  //         );

  //         console.log(filteredData);

  //         border = L.geoJSON(filteredData[0], {
  //           style: function (feature) {
  //             return {
  //               color: 'blue',
  //               weight: 5,
  //               opacity: 0.65,
  //             };
  //           },
  //           // onEachFeature: onEachFeature,
  //         }).addTo(myMap);
  //         myMap.fitBounds(border.getBounds().pad(0.5));
  //       }
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log(textStatus);
  //     },
  //   });
  // })
});
