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
if (isset($_POST['prevDepartment'])) {
  $prevDepartment = $_POST['prevDepartment'];
  $newDepartment = $_POST['newDepartment'];


  $updDeptQuery = "UPDATE department SET name = '$newDepartment' WHERE name = '$prevDepartment'";
  $result = $conn->query($updDeptQuery);

  if (!$result) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
  }

  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data'] = [];

  mysqli_close($conn);

  echo json_encode($output);
}
