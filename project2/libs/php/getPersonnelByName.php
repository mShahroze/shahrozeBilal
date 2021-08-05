<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include('config.php');

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

if (isset($_POST['search'], $_POST['dept'], $_POST['loca'])) {
  $search = '%' . $_POST['search'] . '%';
  $dept = '%' . $_POST['dept'] . '%';
  $loca = '%' . $_POST['loca'] . '%';

  $getPersonByNameQuery = $conn->prepare("SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email, d.name as department, l.name 
  as location FROM personnel p 
  LEFT JOIN department d ON (d.id = p.departmentID) 
  LEFT JOIN location l ON (l.id = d.locationID) 
  WHERE p.firstName LIKE ?
  OR d.name LIKE ?
  OR l.name LIKE ?
  OR p.lastName LIKE ?
  OR p.email LIKE ?
  ORDER BY p.id, p.firstName, p.lastName, p.jobTitle, p.email, d.name, l.name");

  $getPersonByNameQuery->bind_param('sssss', $search, $dept, $loca, $search, $search);

  $getPersonByNameQuery->execute();

  $result = $getPersonByNameQuery->get_result();

  if ($result === false) {
    trigger_error($deleteLocQuery->error, E_USER_ERROR);
  }

  $data = [];

  while ($row = mysqli_fetch_assoc($result)) {
    array_push($data, $row);
  }

  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data'] = $data;

  mysqli_close($conn);

  echo json_encode($output);
}
