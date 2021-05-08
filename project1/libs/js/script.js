let mapOptions;
let myMap;
let mapTile;

$(document).ready(function () {
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

  // Event Handler on Left Click
  myMap.on('click', function (e) {
    alert(e.latlng.toString());
    alert(myMap.getZoom());
  });

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

  const marker = L.marker([53.50296, -2.23643], { icon: redIcon }).addTo(myMap);

  map.fitbounds();
  myMap.on('zoomend', function () {
    if (myMap.getZoom() > 6) {
      marker.bindPopup('<b>You Are Here', { minWidth: 80 }).openPopup();
    }
  });

  L.easyButton('fa-crosshairs fa-lg', function () {
    myMap.locate({ setView: true, maxZoom: 10 });
  }).addTo(myMap);
});

const successCallback = (position) => {
  console.log(position);
};

const errorCallback = (error) => {
  console.error(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

//Country Border

// GeoJSON --------------

// Grab Country Borders -----------

$(document).ready(function () {
  $(window).on('load', function () {
    $('.loader').fadeOut(1000);
    $('.container-fluid').fadeIn(1000);
  });
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
  };

  $.ajax({
    url: 'libs/php/getCountryBorders.php',
    type: 'POST',
    dataType: 'json',
    data: {},
    success: function (result) {
      console.log(JSON.stringify(result));

      if (result.status.name == 'ok') {
        L.geoJSON(result.data, {
          style: { color: '#0d89d6' },
        })
          .bindPopup(function (layer) {
            return layer.feature.properties.name;
          })
          .addTo(myMap);

        // $('#datetime1').html(result.data[0]['datetime'])
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});
