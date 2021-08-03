<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

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

if (isset($_POST['locationID'])) {
  $locationID = (int)$_POST['locationID'];

  $deleteLocCountQuery = "SELECT COUNT(name) as departments FROM department WHERE department.locationID = '$locationID'";

  $countResult = $conn->query($deleteLocCountQuery);

  $data = [];

  while ($row = mysqli_fetch_assoc($countResult)) {

    array_push($data, $row);
  }

  $personnel = $data[0]['departments'];

  if ($personnel > 0) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "delete denied";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
  }
}

$deleteLocQuery = "DELETE FROM location WHERE id=" . $locationID;

$result = $conn->query($deleteLocQuery);

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
$output['status']['description'] = "delete success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

mysqli_close($conn);

echo json_encode($output);
