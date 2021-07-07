<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


$countryInfo = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country=" . $_REQUEST['countryName'] . "&username=muhammad_shahroze&style=full";

$ch1 = curl_init();
curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch1, CURLOPT_URL, $countryInfo);

$countryInfoResult = curl_exec($ch1);

$countryInfoDecode = json_decode($countryInfoResult, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['countryInfo'] = $countryInfoDecode['geonames'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
