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

if (isset($_POST['empID'])) {
  $firstName = $_POST['firstName'];
  $lastName = $_POST['lastName'];
  $jobTitle = $_POST['jobTitle'];
  $email = $_POST['email'];
  $department = $_POST['department'];
  $empID = $_POST['empID'];
  // $location = $_POST['location'];

  $updateEmpQuery = $conn->prepare("UPDATE personnel SET firstName=?, lastName =?, jobTitle =?, email = ?, departmentID = ? WHERE id = ?");

  $updateEmpQuery->bind_param('ssssii', $firstName, $lastName, $jobTitle, $email, $department, $empID);

  $result = $updateEmpQuery->execute();

  // $result = $getPersonByNameQuery->get_result();

  if ($result === false) {
    trigger_error($updateEmpQuery->error, E_USER_ERROR);
  }

  $output['status']['code'] = "204";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";

  mysqli_close($conn);

  echo json_encode($output);
}
