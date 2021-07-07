<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$countryData = json_decode(file_get_contents("../data/countryBorders.geo.json"), true);

$countryBorders = [];

foreach ($countryData['features'] as $feature) {

  $temp = null;
  $temp['code'] = $feature["properties"]['iso_a2'];
  $temp['type'] = $feature["geometry"]['type'];
  $temp['coordinates'] = $feature["geometry"]['coordinates'];

  array_push($countryBorders, $temp);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['countryBorders'] = $countryBorders;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
