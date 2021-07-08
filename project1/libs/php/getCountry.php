<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$country = "http://api.geonames.org/countryCodeJSON?lat=" . $_REQUEST['lat'] . "&lng=" . $_REQUEST['lng'] . "&username=muhammad_shahroze";

$ch1 = curl_init();
curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch1, CURLOPT_URL, $country);

$foundCountryResult = curl_exec($ch1);

$foundCountryDecode = json_decode($foundCountryResult, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['country'] = $foundCountryDecode['countryName'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
