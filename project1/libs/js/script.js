let mapOptions;
let myMap;
let mapTile;
let border;

$(document).ready(function () {
  $(window).on('load', function () {
    $('.loader').fadeOut(1000);
    $('.container-fluid').fadeIn(1000);
  });
  // Created Map Object
  mapOptions = {
    center: [53.50296, -2.23643],
    zoom: 5,
    attributionControl: false,
    maxZoom: 15,
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
      maxZoom: 18,
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

  L.easyButton('fa-crosshairs fa-lg', function () {
    const marker = L.marker([53.50296, -2.23643], { icon: redIcon }).addTo(
      myMap
    );
    myMap.setView(mapOptions.center, 14);
    marker.bindPopup('<b>You Are Here', { minWidth: 80 }).openPopup();
    myMap.locate({ setView: true, maxZoom: 10 });

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

          function onEachFeature(feature, layer) {
            if (feature.geometry.type === 'MultiPolygon') {
              layer.bindPopup(feature.geometry.coordinates.join(', '));
            }
          }

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

  $(document).on('click', '#btnSearch', function () {
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

          function onEachFeature(feature, layer) {
            if (feature.geometry.type === 'MultiPolygon') {
              layer.bindPopup(feature.geometry.coordinates.join(', '));
            }
          }

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

  // geoJson map countryborders extraction
  myMap.on('click', function (e) {
    console.log(e);
    $.ajax({
      url: 'libs/php/getCountryBorders.php',
      type: 'POST',
      dataType: 'json',
      data: {},
      success: function (result) {
        console.log(JSON.stringify(result.data));
        if (result.status.name == 'ok') {
          function zoomToFeature(e) {
            myMap.fitBounds(e.target.getBounds());
          }

          function onEachFeature(feature, layer) {
            layer.on({
              click: zoomToFeature,
            });
          }

          function onEachFeature(feature, layer) {
            if (feature.geometry.type === 'MultiPolygon') {
              layer.bindPopup(feature.geometry.coordinates.join(', '));
            }
          }

          const filterData = result.data.features.filter(
            (country) => country.properties.iso_a2 === 'AF'
          );
          if (border) {
            border.remove();
          }

          border = L.geoJSON(filterData[0], {
            style: { color: '#0d89d6' },
            onEachFeature: onEachFeature,
          }).addTo(myMap);
          myMap.fitBounds(border.getBounds());
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
    });
  });
});
