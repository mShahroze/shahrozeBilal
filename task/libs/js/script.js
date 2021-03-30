$('#earthquakesSubmit').click(function() {

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

        $('#datetime').html(result.data[0]['datetime']);
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

});