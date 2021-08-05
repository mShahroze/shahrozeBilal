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

if (isset($_POST['id'])) {
  $departmentID = $_POST['id'];

  $personByDepIDQuery = $conn->prepare("SELECT p.firstName, d.name as department FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) WHERE departmentID = " . '?');

  $personByDepIDQuery->bind_param('i', $departmentID);

  $personByDepIDQuery->execute();

  $result = $personByDepIDQuery->get_result()->fetch_all(MYSQLI_ASSOC);

  $array = [];
  foreach ($result as $row) {
    array_push($array, $row);
  }

  echo json_encode($array);
}
