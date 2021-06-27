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
    myMap = L.map('geomap', mapOptions).setView(latlng, 13);
    setTimeout(function () {
      myMap.invalidateSize.bind(myMap);
    }, 500);

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

    const weatherIcon = L.icon({
      iconUrl: 'libs/images/weather-marker.png',
      iconSize: [48, 48],
      iconAnchor: [24, 10],
    });

    const homeMarker = L.marker(latlng, { icon: homeIcon }).addTo(myMap);

    // myMap.on('click', function (e) {
    //   alert(e.latlng.toString());
    // });

    function setCurrentLocation() {
      $.ajax({
        url: 'libs/php/getCountryData.php',
        type: 'POST',
        dataType: 'json',
        success: function (result) {
          console.log(result);
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

    setCurrentLocation();

    L.easyButton(
      '<img src="libs/images/location.png" style="width:25px; position: absolute; right: -4px; top: 1.5px;">',
      function (btn, myMap) {
        const home = [53.50296, -2.23643];
        myMap.setView(home, 5);
        setCurrentLocation();
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
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
          },
        });

        const addressPoints = [
          [51.706111, -1.387246],
          [52.692663, -2.412393],
          [51.980725, -3.55541],
          [54.77295, -1.818904],
          [50.675789, -4.1489],
          [53.55498, -0.707306],
          [52.570306, 0.40222],
          [56.911107, -4.836182],
          [56.381304, -3.146485],
          [55.332547, -3.915528],
          [54.473032, -6.596192],
        ];

        let markers = L.markerClusterGroup();

        for (let i = 0; i < addressPoints.length; i++) {
          let a = addressPoints[i];
          let marker = L.marker(new L.LatLng(a[0], a[1]), {
            icon: weatherIcon,
          });
          markers.addLayer(marker);
        }

        myMap.addLayer(markers);

        yourApiKey = '1bc83138eb5d1328d858c1722e6666da';

        const popup = L.popup();

        markers.on('click', onClick);

        function onClick(e) {
          const weathermarker = L.marker(e.latlng, { icon: weatherIcon })
            .addTo(myMap)
            .bindPopup(
              popup
                .setLatLng(e.latlng)
                .setContent('You clicked the map at ' + e.latlng.toString()) //esample from leaflet, will be immediately replaced by weatherpopup...
                .openOn(myMap)
            );

          //getting json function
          $.ajax({
            url:
              'https://api.openweathermap.org/data/2.5/weather?lat=' +
              e.latlng.lat +
              '&lon=' +
              e.latlng.lng +
              '&appid=' +
              yourApiKey,
            dataType: 'json',
            success: function (result) {
              // storing json data in variables
              weatherlocation_lon = result.coord.lon; // lon WGS84
              weatherlocation_lat = result.coord.lat; // lat WGS84
              weatherstationname = result.name; // Name of Weatherstation
              weatherstationid = result.id; // ID of Weatherstation
              weathertime = result.dt; // Time of weatherresult (UTC)
              temperature = result.main.temp; // Kelvin
              airpressure = result.main.pressure; // hPa
              airhumidity = result.main.humidity; // %
              temperature_min = result.main.temp_min; // Kelvin
              temperature_max = result.main.temp_max; // Kelvin
              windspeed = result.wind.speed; // Meter per second
              winddirection = result.wind.deg; // Wind from direction x degree from north
              cloudcoverage = result.clouds.all; // Cloudcoverage in %
              weatherconditionid = result.weather[0].id; // ID
              weatherconditionstring = result.weather[0].main; // Weatheartype
              weatherconditiondescription = result.weather[0].description; // Weatherdescription
              weatherconditionicon = result.weather[0].icon; // ID of weathericon

              // Converting Unix UTC Time
              const utctimecalc = new Date(weathertime * 1000);
              const months = [
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
              ];
              const year = utctimecalc.getFullYear();
              const month = months[utctimecalc.getMonth()];
              const date = utctimecalc.getDate();
              const hour = utctimecalc.getHours();
              const min = utctimecalc.getMinutes();
              const sec = utctimecalc.getSeconds();
              const time =
                date +
                '.' +
                month +
                '.' +
                year +
                ' ' +
                hour +
                ':' +
                min +
                ' Uhr';

              // recalculating
              const weathercondtioniconhtml =
                'http://openweathermap.org/img/w/' +
                weatherconditionicon +
                '.png';
              const weathertimenormal = time; // reallocate time const....
              const temperaturecelsius =
                Math.round((temperature - 273) * 100) / 100; // Converting Kelvin to Celsius
              const windspeedknots = Math.round(windspeed * 1.94 * 100) / 100; // Windspeed from m/s in Knots; Round to 2 decimals
              const windspeedkmh = Math.round(windspeed * 3.6 * 100) / 100; // Windspeed from m/s in km/h; Round to 2 decimals
              let winddirectionstring = 'Im the wind from direction'; // Wind from direction x as text
              if (winddirection > 348.75 && winddirection <= 11.25) {
                winddirectionstring = 'North';
              } else if (winddirection > 11.25 && winddirection <= 33.75) {
                winddirectionstring = 'Northnortheast';
              } else if (winddirection > 33.75 && winddirection <= 56.25) {
                winddirectionstring = 'Northeast';
              } else if (winddirection > 56.25 && winddirection <= 78.75) {
                winddirectionstring = 'Eastnortheast';
              } else if (winddirection > 78.75 && winddirection <= 101.25) {
                winddirectionstring = 'East';
              } else if (winddirection > 101.25 && winddirection <= 123.75) {
                winddirectionstring = 'Eastsoutheast';
              } else if (winddirection > 123.75 && winddirection <= 146.25) {
                winddirectionstring = 'Southeast';
              } else if (winddirection > 146.25 && winddirection <= 168.75) {
                winddirectionstring = 'Southsoutheast';
              } else if (winddirection > 168.75 && winddirection <= 191.25) {
                winddirectionstring = 'South';
              } else if (winddirection > 191.25 && winddirection <= 213.75) {
                winddirectionstring = 'Southsouthwest';
              } else if (winddirection > 213.75 && winddirection <= 236.25) {
                winddirectionstring = 'Southwest';
              } else if (winddirection > 236.25 && winddirection <= 258.75) {
                winddirectionstring = 'Westsouthwest';
              } else if (winddirection > 258.75 && winddirection <= 281.25) {
                winddirectionstring = 'West';
              } else if (winddirection > 281.25 && winddirection <= 303.75) {
                winddirectionstring = 'Westnorthwest';
              } else if (winddirection > 303.75 && winddirection <= 326.25) {
                winddirectionstring = 'Northwest';
              } else if (winddirection > 326.25 && winddirection <= 348.75) {
                winddirectionstring = 'Northnorthwest';
              } else {
                winddirectionstring = ' - currently no winddata available - ';
              }

              //Popup with content
              const fontsizesmall = 1;
              popup.setContent(
                'Weatherdata:<br>' +
                  '<img src=' +
                  weathercondtioniconhtml +
                  '><br>' +
                  weatherconditionstring +
                  ' (Weather-ID: ' +
                  weatherconditionid +
                  '): ' +
                  weatherconditiondescription +
                  '<br><br>Temperature: ' +
                  temperaturecelsius +
                  '°C<br>Airpressure: ' +
                  airpressure +
                  ' hPa<br>Humidityt: ' +
                  airhumidity +
                  '%' +
                  '<br>Cloudcoverage: ' +
                  cloudcoverage +
                  '%<br><br>Windspeed: ' +
                  windspeedkmh +
                  ' km/h<br>Wind from direction: ' +
                  winddirectionstring +
                  ' (' +
                  winddirection +
                  '°)' +
                  '<br><br><font size=' +
                  fontsizesmall +
                  '>Datasource:<br>openweathermap.org<br>Measure time: ' +
                  weathertimenormal +
                  '<br>Weatherstation: ' +
                  weatherstationname +
                  '<br>Weatherstation-ID: ' +
                  weatherstationid +
                  '<br>Weatherstation Coordinates: ' +
                  weatherlocation_lon +
                  ', ' +
                  weatherlocation_lat
              );
            },
            error: function () {
              alert('error receiving wind data from openweathermap');
            },
          });
          markers.on('click', onClick);
        }
      }
    ).addTo(myMap);

    L.easyButton(
      '<img src="libs/images/covid.png" style="width:25px; position: absolute; right: -4px; top: 1.5px;">',
      function (btn, myMap) {
        const home = [53.50296, -2.23643];
        myMap.setView(home, 5);
      }
    ).addTo(myMap);

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
  });

  // Select Country - Highlights Country on Map

  $(document).on('click', '#selCountry', function () {
    let name = $('#selCountry').val();
    // const myLayer = L.geoJSON().addTo(myMap);
    if (name) {
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
    }
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
