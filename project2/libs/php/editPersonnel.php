<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Include the preset username, password etc. for database
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

  $output['status']['code'] = "300";
  $output['status']['name'] = "failure";
  $output['status']['description'] = "database unavailable";
  $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data'] = [];

  mysqli_close($conn);

  echo json_encode($output);

  exit;
}

// fetching data from table personel 
$sqlQuery = "SELECT id, firstName, lastName, jobTitle, email, departmentID, FROM personnel WHERE id = " . $_REQUEST['id'];
$result = $conn->query($sqlQuery);

if (!$result) {

  $output['status']['code'] = "400";
  $output['status']['name'] = "executed";
  $output['status']['description'] = "query failed";
  $output['data'] = [];

  mysqli_close($conn);

  echo json_encode($output);

  exit;
}

$editEmployee =  mysqli_fetch_assoc($result);

// Assign information to varibale
$tempHolder['id'] = $editEmployee['id'];
$tempHolder['firstName'] = $editEmployee['firstName'];
$tempHolder['lastName'] = $editEmployee['lastName'];
$tempHolder['email'] = $editEmployee['email'];

if (isset($editEmployee['departmentID'])) {
  $tempHolder['department'] = $editEmployee['departmentID'];
} else {
  $tempHolder['department'] =  "No Department";
}
if (isset($department['locationID'])) {
  $tempHolder['location'] = $department['locationID'];
} else {
  $tempHolder['location'] = "No Locaiton";
}
$tempHolder['job'] = $editEmployee['jobTitle'];

// return data
echo json_encode($tempHolder, true);
