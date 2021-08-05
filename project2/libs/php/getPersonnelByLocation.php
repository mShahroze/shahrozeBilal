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

require('conn.php');

if (isset($_POST['id'])) {
  $locationID = $_POST['id'];

  $personByLocIDQuery = $conn->prepare("SELECT d.name as department, l.name as location FROM department d LEFT JOIN location l ON (l.id = d.locationID) WHERE l.id =" . '?');

  $personByLocIDQuery->bind_param('i', $locationID);

  $personByLocIDQuery->execute();

  $result = $personByLocIDQuery->get_result()->fetch_all(MYSQLI_ASSOC);

  $array = [];
  foreach ($result as $row) {
    array_push($array, $row);
  }

  echo json_encode($array);
}
