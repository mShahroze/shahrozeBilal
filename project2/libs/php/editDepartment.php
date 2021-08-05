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

if (isset($_POST['prevDepartment'])) {
  $prevDepartment = $_POST['prevDepartment'];
  $newDepartment = $_POST['newDepartment'];
  $locationID = $_REQUEST['locationID'];

  $updDeptQuery = $conn->prepare("UPDATE department SET name = ?, locationID = ? WHERE name = ?");
  $updDeptQuery->bind_param('sis', $newDepartment, $locationID, $prevDepartment);
  $result = $updDeptQuery->execute();

  if ($result === false) {
    trigger_error($updDeptQuery->error, E_USER_ERROR);
  }

  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data'] = [];

  mysqli_close($conn);

  echo json_encode($output);
}
