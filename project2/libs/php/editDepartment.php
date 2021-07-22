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

// Establish a statement to use in SQL where we are getting data from the table personnel 
$sql = "SELECT id, name, locationID FROM department WHERE id = ". $_REQUEST['id'];
$result = $conn->query($sql);
$department = mysqli_fetch_assoc($result);

// Assign information to varibale
$tempHolder['name'] = $department['name'];
$tempHolder['id'] = $department['id'];
$tempHolder['location'] = $department['locationID'];

// Echo out the data  to be used
echo json_encode($tempHolder, true);
?>