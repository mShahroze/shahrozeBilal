<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$countryData = json_decode(file_get_contents("../data/countryBorders.geo.json"), true);

$countryNames = [];

foreach ($countryData['features'] as $feature) {

  $temp = null;
  $temp['code'] = $feature["properties"]['iso_a2'];
  $temp['name'] = $feature["properties"]['name'];

  array_push($countryNames, $temp);
}

usort($countryNames, function ($item1, $item2) {

  return $item1['name'] <=> $item2['name'];
});

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['countryNames'] = $countryNames;

// $output['countryExchangeRates'] = $exchangeDecode['rates'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
