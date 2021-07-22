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

  // Include the preset username, password etc. for database
  require('conn.php');
  
  // Establish a statement to use in SQL where we are getting data from the table location 
  $sql = "SELECT d.name as department, l.name as location FROM department d LEFT JOIN location l ON (l.id = d.locationID) WHERE l.id =".$_POST['id'];
  $result = $conn->query($sql);
  $array =[];
  foreach($result as $row){

      array_push($array, $row);
  }

  // Echo out the data to be used
  echo json_encode($array);
?>