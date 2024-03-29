let mapOptions;
let myMap;
let border;
let markers;
let arrMarkers = new Array(0);
let lMarkers = new Array(0);
let geoJsonLayers;
let covidGeoJson;

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

const Dark = L.tileLayer(
  'https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=TYSKvo6e0lUYRYv5ujTkL8eta5s8dieFaH6MXVprzkPFc7X7JHZXfP5N4557o5dz',
  {
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    subdomains: 'abcd',
    accessToken:
      'TYSKvo6e0lUYRYv5ujTkL8eta5s8dieFaH6MXVprzkPFc7X7JHZXfP5N4557o5dz',
  }
);

googleHybrid = L.tileLayer(
  'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
  {
    tileSize: 256,
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }
);

let baseMaps = {
  "<span style='color: tan'>Esri - World Topo Map</span>": Topo,
  "<span style='color: darkgreen'>World Sat Map</span>": Sat,
  "<span style='color: black'>Dark Matrix</span>": Dark,
  "<span style='color: black'>Google Hybrid</span>": googleHybrid,
};

mapOptions = {
  center: [53.50296, -2.23643],
  zoom: 5,
  minZoom: 3,
  maxZoom: 13,
  attributionControl: true,
};

$(document).ready(function () {
  // On Page load
  $(window).on('load', function () {
    $('.loader').fadeOut(2000);
    $('.container-fluid').fadeIn(2000);
  });

  let wiki = L.layerGroup.wikipediaLayer({
    target: '_blank',
    images: 'vendors/css/images',
    limit: 1,
    clearOutsideBounds: true,
  });

  let gph = L.geographPhotos({
    api_key: 'geograph_demo',
    autoZoomOnAdd: true,
    query: 'canal',
  });

  // on Load - Get Current Location

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (location) {
      const latlng = new L.LatLng(
        location.coords.latitude,
        location.coords.longitude
      );

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
        iconSize: [36, 36],
        iconAnchor: [24, 10],
      });

      const weatherIcon = L.icon({
        iconUrl: 'libs/images/weather-marker.png',
        iconSize: [48, 48],
        iconAnchor: [24, 10],
      });

      function setCurrentLocation() {
        $.ajax({
          url: 'libs/php/getCountry.php',
          type: 'POST',
          dataType: 'json',
          data: { lat: latlng.lat, lng: latlng.lng },
          success: function (result) {
            if (result.status.name == 'ok') {
              $.ajax({
                url: 'libs/php/getCountryBorders.php',
                type: 'POST',
                dataType: 'json',
                data: { countryName: result.country },

                success: function (result) {
                  countryBorder = result.countryBorder;
                  $('#selCountry').val(countryBorder.properties.name).change();

                  myMap.eachLayer(function (layer) {
                    if (layer === markers) {
                      myMap.removeLayer(markers);
                    } else if (layer === border) {
                      myMap.removeLayer(border);
                    }
                  });

                  function zoomToFeature(e) {
                    myMap.fitBounds(e.target.getBounds());
                  }

                  function onEachFeature(feature, layer) {
                    layer.on({
                      click: zoomToFeature,
                    });
                  }

                  border = L.geoJSON(countryBorder, {
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
                  wiki.addTo(myMap);
                  gph.addTo(myMap);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log(textStatus);
                },
              });
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
          },
        });
      }

      setCurrentLocation();

      L.control
        .scale({
          position: 'bottomleft',
        })
        .addTo(myMap);

      var miniMap = new L.Control.MiniMap(Topo, {
        toggleDisplay: true,
        minimized: false,
        position: 'bottomleft',
      }).addTo(myMap);

      L.easyButton(
        '<img src="libs/images/location.png" style="width:25px; position: absolute; right: 2px; top: 2.5px;">',
        function (btn, myMap) {
          const home = [latlng.lat, latlng.lng];
          myMap.setView(home, 5);
          setCurrentLocation();
        }
      ).addTo(myMap);

      L.easyButton(
        '<img src="libs/images/Information.png" style="width:25px; position: absolute; right: 2px; top: 2.5px;">',

        function (btn, myMap) {
          let name = $('#selCountry').val();
          const latlng = myMap.getCenter();

          $.ajax({
            url: 'libs/php/getCountry.php',
            type: 'POST',
            dataType: 'json',
            data: { lat: latlng.lat, lng: latlng.lng },
            success: function (result) {
              if (result.status.name == 'ok') {
                $.ajax({
                  url: 'libs/php/getCountryBorders.php',
                  type: 'POST',
                  dataType: 'json',
                  data: { countryName: result.country },
                  success: function (result) {
                    if (result.status.name == 'ok') {
                      countryFeature = result.countryBorder;
                      let gjLayer = L.geoJson(countryFeature.geometry);
                      let results = leafletPip.pointInLayer(
                        [latlng.lng, latlng.lat],
                        gjLayer
                      );

                      if (results.length) {
                        $('#myModal').modal('show');
                        $('#Country-Name').html(
                          countryFeature.properties.name.toUpperCase()
                        );

                        $.ajax({
                          url: 'libs/php/getCountryInfo.php',
                          type: 'POST',
                          dataType: 'json',
                          data: {
                            countryCode: countryFeature.properties.iso_a2,
                          },

                          success: function (result) {
                            countryInfo = result.countryInfo[0];
                            $('#td2').html(`${countryInfo.capital}`);
                            $('#td5').html(
                              `${countryInfo.population
                                .toString()
                                .replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ','
                                )} (million)`
                            );
                            $('#td20').html(`${countryInfo.areaInSqKm} ㎢`);
                          },
                          error: function (jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                          },
                        });

                        $.ajax({
                          url: 'libs/php/getMoreCountryInfo.php',
                          type: 'POST',
                          dataType: 'json',
                          data: {
                            countryCode: countryFeature.properties.iso_a3,
                          },

                          success: function (moreCountryInfo) {
                            if (result.status.name == 'ok') {
                              $('#td14').html(
                                `${moreCountryInfo.languages[0].name}`
                              );
                              $('#td17').html(
                                `<img src=${moreCountryInfo.flag} style="width:30px;">`
                              );
                              $('#td23').html(
                                `+${moreCountryInfo.callingCodes}`
                              );
                              moreCountryInfo.currencies.filter((curCode) => {
                                $('#td8').html(
                                  `${curCode.symbol}${curCode.code}`
                                );
                              });
                            }
                          },
                          error: function (jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                          },
                        });

                        $.ajax({
                          url: 'libs/php/getCountryCurExchange.php',
                          type: 'POST',
                          dataType: 'json',

                          success: function (countryResult) {
                            for (const key in countryResult.countryExchangeRates) {
                              if (
                                key.substring(0, 2) ===
                                countryFeature.properties.iso_a2
                              ) {
                                $('#td11').html(
                                  `${countryResult.countryExchangeRates[key]} /(£)`
                                );
                              }
                            }
                          },
                          error: function (jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                          },
                        });
                      }
                    }
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                  },
                });
              }
            },
          });
        }
      ).addTo(myMap);

      L.easyButton(
        '<img src="libs/images/weather.png" style="width:25px; position: absolute; right: 2px; top: 2.5px;">',
        function (btn, myMap) {
          let name = $('#selCountry').val() || 'United Kingdom';

          $.ajax({
            url: 'libs/php/getCountryBorders.php',
            type: 'POST',
            dataType: 'json',
            data: { countryName: name },
            success: function (result) {
              countryBorder = result.countryBorder;

              lMarkers = [];
              arrMarkers = [];
              if (markers) {
                myMap.removeLayer(markers);
              }

              yourApiKey = '1bc83138eb5d1328d858c1722e6666da';

              const popup = L.popup();

              function onClick(e) {
                const weathermarker = L.marker(e.latlng, { icon: weatherIcon })
                  .addTo(myMap)
                  .bindPopup(
                    popup
                      .setLatLng(e.latlng)
                      .setContent(
                        'You clicked the map at ' + e.latlng.toString()
                      )
                      .openOn(myMap)
                  );

                // Obtaining weather data from API
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
                    weatherlocation_lon = result.coord.lon;
                    weatherlocation_lat = result.coord.lat;
                    weatherstationname = result.name;
                    weatherstationid = result.id;
                    weathertime = result.dt;
                    temperature = result.main.temp;
                    airpressure = result.main.pressure;
                    airhumidity = result.main.humidity;
                    temperature_min = result.main.temp_min;
                    temperature_max = result.main.temp_max;
                    windspeed = result.wind.speed;
                    winddirection = result.wind.deg;
                    cloudcoverage = result.clouds.all;
                    weatherconditionid = result.weather[0].id;
                    weatherconditionstring = result.weather[0].main;
                    weatherconditiondescription = result.weather[0].description;
                    weatherconditionicon = result.weather[0].icon;

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
                    const weathertimenormal = time;
                    const temperaturecelsius =
                      Math.round((temperature - 273) * 100) / 100;
                    const windspeedknots =
                      Math.round(windspeed * 1.94 * 100) / 100;
                    const windspeedkmh =
                      Math.round(windspeed * 3.6 * 100) / 100;
                    let winddirectionstring = 'Im the wind from direction';
                    if (winddirection > 348.75 && winddirection <= 11.25) {
                      winddirectionstring = 'North';
                    } else if (
                      winddirection > 11.25 &&
                      winddirection <= 33.75
                    ) {
                      winddirectionstring = 'Northnortheast';
                    } else if (
                      winddirection > 33.75 &&
                      winddirection <= 56.25
                    ) {
                      winddirectionstring = 'Northeast';
                    } else if (
                      winddirection > 56.25 &&
                      winddirection <= 78.75
                    ) {
                      winddirectionstring = 'Eastnortheast';
                    } else if (
                      winddirection > 78.75 &&
                      winddirection <= 101.25
                    ) {
                      winddirectionstring = 'East';
                    } else if (
                      winddirection > 101.25 &&
                      winddirection <= 123.75
                    ) {
                      winddirectionstring = 'Eastsoutheast';
                    } else if (
                      winddirection > 123.75 &&
                      winddirection <= 146.25
                    ) {
                      winddirectionstring = 'Southeast';
                    } else if (
                      winddirection > 146.25 &&
                      winddirection <= 168.75
                    ) {
                      winddirectionstring = 'Southsoutheast';
                    } else if (
                      winddirection > 168.75 &&
                      winddirection <= 191.25
                    ) {
                      winddirectionstring = 'South';
                    } else if (
                      winddirection > 191.25 &&
                      winddirection <= 213.75
                    ) {
                      winddirectionstring = 'Southsouthwest';
                    } else if (
                      winddirection > 213.75 &&
                      winddirection <= 236.25
                    ) {
                      winddirectionstring = 'Southwest';
                    } else if (
                      winddirection > 236.25 &&
                      winddirection <= 258.75
                    ) {
                      winddirectionstring = 'Westsouthwest';
                    } else if (
                      winddirection > 258.75 &&
                      winddirection <= 281.25
                    ) {
                      winddirectionstring = 'West';
                    } else if (
                      winddirection > 281.25 &&
                      winddirection <= 303.75
                    ) {
                      winddirectionstring = 'Westnorthwest';
                    } else if (
                      winddirection > 303.75 &&
                      winddirection <= 326.25
                    ) {
                      winddirectionstring = 'Northwest';
                    } else if (
                      winddirection > 326.25 &&
                      winddirection <= 348.75
                    ) {
                      winddirectionstring = 'Northnorthwest';
                    } else {
                      winddirectionstring =
                        ' - currently no winddata available - ';
                    }

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

              markers = L.markerClusterGroup();

              const a = countryBorder.geometry.coordinates;

              let polygon = L.polygon(a);

              function plotrandom(polygon) {
                bounds = polygon.getBounds();

                const x_max = bounds.getEast();
                const x_min = bounds.getWest();
                const y_max = bounds.getSouth();
                const y_min = bounds.getNorth();

                const lat = y_min + Math.random() * (y_max - y_min);
                const lng = x_min + Math.random() * (x_max - x_min);

                let point = turf.point([lng, lat]);
                let poly = polygon.toGeoJSON();

                let inside = turf.booleanPointInPolygon(point, poly);
                if (inside) {
                  return point;
                } else {
                  return plotrandom(polygon);
                }
              }

              for (let i = 0; i < 20; ++i) {
                let randPlot = plotrandom(polygon);
                arrMarkers.push(randPlot);
              }

              for (let i = 0; i < arrMarkers.length; i++) {
                let addressPoint = arrMarkers[i].geometry.coordinates;
                let marker = L.marker(
                  new L.LatLng(addressPoint[0], addressPoint[1]),
                  {
                    icon: weatherIcon,
                  }
                );
                lMarkers.push(marker);
                markers.addLayer(marker);
              }

              myMap.addLayer(markers);
              lMarkers.map((marker) => {
                marker.on('click', onClick);
              });
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus);
            },
          });
        }
      ).addTo(myMap);

      // Get Covid Data

      L.easyButton(
        '<img src="libs/images/covid.png" style="width:25px; position: absolute; right: 2px; top: 2.5px;">',
        function (btn, myMap) {
          let name = $('#selCountry').val();
          const latlng = myMap.getCenter();

          $.ajax({
            url: 'libs/php/getCountry.php',
            type: 'POST',
            dataType: 'json',
            data: { lat: latlng.lat, lng: latlng.lng },
            success: function (result) {
              if (result.status.name == 'ok') {
                $.ajax({
                  url: 'libs/php/getCountryBorders.php',
                  type: 'POST',
                  dataType: 'json',
                  data: { countryName: result.country },
                  success: function (result) {
                    countryBorder = result.countryBorder;
                    $.ajax({
                      url: 'libs/php/getCovidData.php',
                      type: 'POST',
                      dataType: 'json',
                      data: { countryName: name },
                      success: function (covidResult) {
                        if (result.status.name == 'ok') {
                          countryFeature = result.countryBorder;
                          let gjLayer = L.geoJson(countryFeature.geometry);
                          let results = leafletPip.pointInLayer(
                            [latlng.lng, latlng.lat],
                            gjLayer
                          );

                          if (results.length) {
                            let hasData =
                              (Array.isArray(covidResult) &&
                                covidResult.length > 0) ||
                              typeof covidResult === 'object';

                            if (!hasData) return;

                            if (typeof covidResult === 'object') {
                              const { countryInfo = {} } = covidResult;
                              const { lat, long: lng } = countryInfo;
                              covidGeoJson = {
                                type: 'FeatureCollection',
                                features: [
                                  {
                                    type: 'Feature',
                                    properties: {
                                      ...covidResult,
                                    },
                                    geometry: {
                                      type: 'Point',
                                      coordinates: [lng, lat],
                                    },
                                  },
                                ],
                              };
                            } else {
                              covidGeoJson = {
                                type: 'FeatureCollection',
                                features: covidResult.map((country = {}) => {
                                  const { countryInfo = {} } = country;
                                  const { lat, long: lng } = countryInfo;
                                  if (country.properties)
                                    return {
                                      type: 'Feature',
                                      properties: {
                                        ...country,
                                      },
                                      geometry: {
                                        type: 'Point',
                                        coordinates: [lng, lat],
                                      },
                                    };
                                }),
                              };
                            }

                            geoJsonLayers = new L.GeoJSON(covidGeoJson, {
                              pointToLayer: (feature = {}, latlng) => {
                                const { properties = {} } = feature;
                                let updatedFormatted;
                                let casesString;

                                const {
                                  country,
                                  updated,
                                  cases,
                                  deaths,
                                  recovered,
                                } = properties;

                                casesString = `${cases}`;

                                if (cases > 1000) {
                                  casesString = `${casesString.slice(0, -3)}k+`;
                                }

                                if (updated) {
                                  updatedFormatted = new Date(
                                    updated
                                  ).toLocaleString();
                                }

                                const html = `
                                <span class="icon-marker">
                                  <span class="icon-marker-tooltip">
                                    <h2>${country}</h2>
                                    <ul>
                                      <li><strong>Confirmed:</strong> ${cases}</li>
                                      <li><strong>Deaths:</strong> ${deaths}</li>
                                      <li><strong>Recovered:</strong> ${recovered}</li>
                                      <li><strong>Last Update:</strong> ${updatedFormatted}</li>
                                    </ul>
                                  </span>
                                  ${casesString}
                                </span>
                              `;

                                return L.marker(latlng, {
                                  icon: L.divIcon({
                                    className: 'icon',
                                    html,
                                  }),
                                  riseOnHover: true,
                                });
                              },
                            });

                            geoJsonLayers.addTo(myMap);
                          }
                        }
                      },
                      error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                      },
                    });
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                  },
                });
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus);
            },
          });
        }
      ).addTo(myMap);

      // Country Code and Country name in Select

      $.ajax({
        url: 'libs/php/getCountryNames.php',
        type: 'POST',
        dataType: 'json',
        success: function (result) {
          if (result.status.name == 'ok') {
            countryArray = result.countryNames;

            for (let i = 0; i < countryArray.length; i++) {
              $('#selCountry').append(
                $('<option>', {
                  value: countryArray[i].name,
                  text: `${countryArray[i].name}`,
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
      if (name) {
        $.ajax({
          url: 'libs/php/getCountryBorders.php',
          type: 'POST',
          dataType: 'json',
          data: { countryName: name },
          success: function (result) {
            if (result.status.name == 'ok') {
              countryBorder = result.countryBorder;

              myMap.eachLayer(function (layer) {
                if (layer === 'markers') {
                  myMap.removeLayer(markers);
                } else if (layer === border) {
                  myMap.removeLayer(border);
                } else if (layer === gph) {
                  myMap.removeLayer(gph);
                } else if (layer === geoJsonLayers) {
                  myMap.removeLayer(geoJsonLayers);
                }
              });

              function zoomToFeature(e) {
                myMap.fitBounds(e.target.getBounds());
              }

              function onEachFeature(feature, layer) {
                layer.on({
                  click: zoomToFeature,
                });
              }

              border = L.geoJSON(countryBorder, {
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
              wiki.addTo(myMap);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
          },
        });
      }
    });
  } else {
    x.innerHTML = 'Geolocation is not supported by this browser.';
  }
});
