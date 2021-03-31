$('#earthquakesSubmit').click(function() {
  $("#earthquakesSubmit").attr("disabled", true);
  $('#first').toggle('visible');
  $('#second').hide();
  $('#third').hide();

  $.ajax({
    url: "libs/php/getGeoEarthquakesInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
      north: 44.1,
      south: 9.9,
      east: 22.4,
      west: 55.2,
    },
    success: function(result) {

      console.log(JSON.stringify(result));

      if (result.status.name == 'ok') {

        $('#datetime1').html(result.data[0]['datetime']);
        $('#depth').html(result.data[1]['depth']);
        $('#longitude').html(result.data[2]['lng']);
        $('#src').html(result.data[3]['src']);
        $('#magnitude').html(result.data[5]['magnitude']);
        $('#latitude').html(result.data[6]['lat']);
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

})

$('#oceansSubmit').click(function() {
  $("#oceansSubmit").attr("disabled", true);
  $('#second').toggle('visible');
  $('#first').hide();
  $('#third').hide();

  $.ajax({
    url: "libs/php/getOceansInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
      latitude: 40.78383,
      longitude: -43.96625
    },
    success: function(result) {

      console.log(JSON.stringify(result));

      if (result.status.name == 'ok') {

        $('#distance').html(result.data.distance);
        $('#geonameId').html(result.data.geonameId);
        $('#name').html(result.data.name);

      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

})

$('#weatherSubmit').click(function() {
  $("#weatherSubmit").attr("disabled", true);
  $('#third').toggle('visible');
  $('#first').hide();
  $('#second').hide();

  $.ajax({
    url: "libs/php/getWeatherObservationInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
      north: 44.1,
      south: -9.9,
      east: -22.4,
      west: 55.2,
    },
    success: function(result) {

      console.log(JSON.stringify(result));

      if (result.status.name == 'ok') {

        $('#observation').html(result.data[0].observation);
        $('#datetime2').html(result.data[0].datetime);
        $('#temperature').html(result.data[0].temperature);
        $('#humidity').html(result.data[0].humidity);
        $('#stationName').html(result.data[0].stationName);
        $('#windDirection').html(result.data[0].windDirection);
      }

      },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

})