<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


$rest = "https://restcountries.eu/rest/v2/alpha/" . $_REQUEST['countryCode'];

$ch1 = curl_init();
curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch1, CURLOPT_URL, $rest);

$restResult = curl_exec($ch1);

$restDecode = json_decode($restResult, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output = $restDecode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
