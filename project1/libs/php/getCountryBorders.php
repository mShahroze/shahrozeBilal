<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$countryData = json_decode(file_get_contents("../data/countryBorders.geo.json"), true);

foreach ($countryData['features'] as $feature) {
  // print_r($feature);
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['countryName'])) {
      $countryName = $_POST['countryName'];
    }
    if ($countryName === $feature["properties"]["name"]) {
      $countryBorder = $feature;
    }
  }
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['countryBorder'] = $countryBorder;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
