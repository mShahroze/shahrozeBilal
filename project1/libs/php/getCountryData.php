<?php

  ini_set('display_errors', 'On');
  error_reporting(E_ALL);

  $executionStartTime = microtime(true);

  $countryData = json_decode(file_get_contents("../data/countryBorders.geo.json"), true);

  $countryInfo = json_decode(file_get_contents("../data/countryInfo.json"), true);

  $countryNames = [];

  $countryBorders = [];

  foreach ($countryData['features'] as $feature) {

    $temp = null;
    $temp['code'] = $feature["properties"]['iso_a2'];
    $temp['name'] = $feature["properties"]['name'];

    array_push($countryNames, $temp);
    
  }

  foreach ($countryData['features'] as $feature) {

    $temp = null;
    $temp['code'] = $feature["properties"]['iso_a2'];
    $temp['type'] = $feature["geometry"]['type'];
    $temp['coordinates'] = $feature["geometry"]['coordinates'];

    array_push($countryBorders, $temp);

  }

  usort($countryNames, function ($item1, $item2) {

    return $item1['name'] <=> $item2['name'];

  });

  $url = "https://api.openweathermap.org/data/2.5/weather?id=524901&appid=1bc83138eb5d1328d858c1722e6666da";

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL, $url);

  $result=curl_exec($ch);

  $decode = json_decode($result,true);



  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
  $output['countryFeatures'] = $countryData;
  $output['countryNames'] = $countryNames;
  $output['countryBorders'] = $countryBorders;
  $output['countryInfo'] = $countryInfo['geonames'];
  $output['countryWeatherList'] = $decode;

  
  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>
