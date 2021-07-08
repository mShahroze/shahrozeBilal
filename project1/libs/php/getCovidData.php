<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


$covidData = "https://corona.lmao.ninja/v3/covid-19/countries/" . $_REQUEST['countryName'];

$ch1 = curl_init();
curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch1, CURLOPT_URL, $covidData);

$covidResult = curl_exec($ch1);

$covidDecode = json_decode($covidResult, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output = $covidDecode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
