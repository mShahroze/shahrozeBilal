let mapOptions;
let myMap;
let mapTile;
let border;
let current_position, current_accuracy;

$(document).ready(function () {
  $(window).on('load', function () {
    $('.loader').fadeOut(1000);
    $('.container-fluid').fadeIn(1000);
    $.ajax({
      url: 'libs/php/getCountryBorders.php',
      type: 'POST',
      dataType: 'json',
  
      success: function (result) {
        // console.log(JSON.stringify(result));
        // console.log(result.data.features[3].properties.iso_a3);
        if (result.status.name == 'ok') {

          function compare( a, b ) {
            if ( a.properties.name < b.properties.name ){
              return -1;
            }
            if ( a.properties.name > b.properties.name ){
              return 1;
            }
            return 0;
          }
          
          const sortedResult = result.data.features.sort( compare );

          for (var i = 0; i < sortedResult.length; i++) {
            $('#selCountry').append(
              $('<option>', {
                value: sortedResult[i].properties.iso_a3,
                text: sortedResult[i].properties.name,
              })
            );
          }
        }
      },
      error: function(a, b, c){
        console.log('a: ', a);
        console.log(b, c);
      }
    });
  });

  // Created Map Object
  mapOptions = {
    center: [53.50296, -2.23643],
    zoom: 5,
    attributionControl: false,
    maxZoom: 20,
  };

  myMap = L.map('geomap', mapOptions);
  setTimeout(function () {
    myMap.invalidateSize();
  }, 500);

  // Added Basemap Layer
  mapTile = L.tileLayer(
    'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=TYSKvo6e0lUYRYv5ujTkL8eta5s8dieFaH6MXVprzkPFc7X7JHZXfP5N4557o5dz',
    {
      minZoom: 0,
      maxZoom: 20,
      tileSize: 512,
      subdomains: 'abcd',
      zoomOffset: -1,
    }
  );

  myMap.addLayer(mapTile);

  // Event Handler on Right Click
  myMap.on('contextmenu', function (e) {
    L.marker(e.latlng, { icon: redIcon })
      .addTo(myMap)
      .bindPopup(e.latlng.toString());
  });

  const redIcon = L.icon({
    iconUrl: 'libs/images/red-marker.png',
    iconSize: [48, 48],
    iconAnchor: [24, 10],
  });

  L.easyButton('fa-crosshairs fa-lg', function (e) {
    function onLocationFound(e) {
      if (current_position) {
        myMap.removeLayer(current_position);
        myMap.removeLayer(current_accuracy);
      }

      // const radius = e.accuracy / 4;

      // current_position = L.marker(e.latlng, { icon: redIcon })
      //   .addTo(myMap)
        // .bindPopup('You are within ' + radius + ' meters from this point')
        // .openPopup();

      // current_accuracy = L.circle(e.latlng, radius).addTo(myMap);
    }

    function onLocationError(e) {
      alert(e.message);
    }

    myMap.on('locationfound', onLocationFound);
    myMap.on('locationerror', onLocationError);

    function locate() {
      myMap.locate({ });
    }
    // const marker = L.marker([53.50296, -2.23643], { icon: redIcon }).addTo(
    //   myMap
    // );
    // myMap.setView(mapOptions.center, 14);
    // marker.bindPopup('<b>You Are Here', { minWidth: 80 }).openPopup();
    // myMap.locate({ setView: true, maxZoom: 10 });
    locate();

    myMap.on('click', function (e) {
      $.ajax({
        url: 'libs/php/getCountryInfo.php',
        type: 'POST',
        dataType: 'json',
        success: function (result) {
          if (result.status.name == 'ok') {
            // console.log(JSON.stringify(result));

            const filterData = result.data.country.filter(
              (country) => country.countryCode === 'GB'
            );

            const popup = L.popup()
              .setLatLng(e.latlng)
              // .setContent('<p>Hello world!<br />This is a nice popup.</p>')
              .openOn(myMap);
            // current_position.bindPopup(filterData[0]).addTo(myMap).openPopup();
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        },
      });
    });

    $.ajax({
      url: 'libs/php/getCountryBorders.php',
      type: 'POST',
      dataType: 'json',

      success: function (result) {
        // console.log(JSON.stringify(result));
        if (result.status.name == 'ok') {
          for (var i = 0; i < result.data.features.length; i++) {
            $('#selCountry').append(
              $('<option>', {
                value: result.data.features[i].properties.iso_a3,
                text: result.data.features[i].properties.name,
              })
            );
          }
        }
      },
    });

    $.ajax({
      url: 'libs/php/getCountryBorders.php',
      type: 'POST',
      dataType: 'json',
      success: function (result) {
        if (result.status.name == 'ok') {
          function highlightFeature(e) {
            const layer = e.target;

            layer.setStyle({
              weight: 5,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7,
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          }

          function resetHighlight(e) {
            border.resetStyle(e.target);
          }

          function zoomToFeature(e) {
            myMap.fitBounds(e.target.getBounds());
          }

          function onEachFeature(feature, layer) {
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature,
            });
          }

          // function onEachFeature(feature, layer) {
          //   if (feature.geometry.type === 'MultiPolygon') {
          //     layer.bindPopup(feature.geometry.coordinates.join(', '));
          //   }
          // }

          if (myMap.hasLayer(border)) {
            myMap.removeLayer(border);
          }

          const filterData = result.data.features.filter(
            (country) => country.properties.iso_a2 === 'GB'
          );

          border = L.geoJSON(filterData[0], {
            style: function (feature) {
              return {
                color: '#0d89d6',
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
  }).addTo(myMap);

  $(document).on('click', '#selCountry', function () {
    $('#output').html('hello world');
    let name = $('#selCountry').val();
    $.ajax({
      url: 'libs/php/getCountryBorders.php',
      type: 'POST',
      dataType: 'json',
      success: function (result) {
        // console.log(JSON.stringify(result));
        if (result.status.name == 'ok') {
          function highlightFeature(e) {
            const layer = e.target;

            layer.setStyle({
              weight: 5,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7,
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          }

          function resetHighlight(e) {
            border.resetStyle(e.target);
          }

          function zoomToFeature(e) {
            myMap.fitBounds(e.target.getBounds());
          }

          function onEachFeature(feature, layer) {
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature,
            });
          }

          // function onEachFeature(feature, layer) {
          //   if (feature.geometry.type === 'MultiPolygon') {
          //     layer.bindPopup(feature.geometry.coordinates.join(', '));
          //   }
          // }

          if (myMap.hasLayer(border)) {
            myMap.removeLayer(border);
          }

          const filterData = result.data.features.filter(
            (country) => country.properties.iso_a3 === name
          );

          border = L.geoJSON(filterData[0], {
            style: function (feature) {
              return {
                color: 'blue',
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
  });

  myMap.on('click', function(e) {
    
    $.ajax({
      url: 'libs/php/getCountryBorders.php',
          type: 'POST',
          dataType: 'json',
          data: {},
          success: function (result) {
            // console.log(JSON.stringify(result.data.features.properties));
            if (result.status.name == 'ok') {
              var filteredData = result.data.features.forEach(element => {
                // console.log(element.geometry)
                var gjLayer = L.geoJson(element.geometry);
                var results = leafletPip.pointInLayer([e.latlng.lng, e.latlng.lat], gjLayer);
                // results is an array of L.Polygon objects containing that point
                // gjLayer.addTo(myMap)
                if (results.length) {
                  $("#myModal").modal('show');
                  ($("#Country-Name").html(element.properties.name))
                  $.ajax({
                    url: 'libs/php/getCountryInfo.php',
                    type: 'POST',
                    dataType: 'json',

                    success: function (countryResult) {
                      countryResult.data.country.forEach(country => {
                        // console.log(element)
                        if (country.countryName === element.properties.name) {
                          $("#modal-description").html(`
                          <p>Capital: ${country.capital}</p>
                          <p>Population: ${country.population}</p>
                          <p>CurrencyCode: ${country.currencyCode}</p>`)
                          
                          $.ajax({
                            url: 'libs/php/getCountryWeather.php',
                            type: 'POST',
                            dataType: 'json',
                            data: {north: country.north, south: country.south, east: country.east, west: country.west},

                            success: function (weatherResult) {
                              // console.log(weatherResult.data)

                              weatherResult.data.forEach(countryWeather => {
                                $("#modal-description2").html(`
                                <p>Temperature: ${countryWeather.temperature}</p>`)

                                $.ajax({
                                  url: 'libs/php/getCountryWiki.php',
                                  type: 'POST',
                                  dataType: 'json',
                                  data: {city: country.capital},

                                  success: function (wikiResult) {
                                    // console.log(wikiResult)

                                    wikiResult.data.forEach(countryWiki => {
                                      // console.log(countryWiki)
                                      if (country.capital === countryWiki.title) {
                                        $("#modal-description3").html(`
                                        <p>Wikipedia: <a href="https://${countryWiki.wikipediaUrl}">${countryWiki.wikipediaUrl}</a></p>`)
                                      }
                                    })
                                  },
                                  error: function (jqXHR, textStatus, errorThrown) {
                                    console.log(textStatus);
                                  },
                                })
                              })
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                              console.log(textStatus);
                            },
                          }) 
                        }
                      })
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log(textStatus);
                    },
                  })
                }
              });
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
          },
        })
  });
});
