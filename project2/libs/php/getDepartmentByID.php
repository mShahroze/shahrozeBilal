<?php


// example use from browser
// http://localhost/companydirectory/libs/php/getDepartmentByID.php?id=2

// remove next two lines for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

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

if (isset($_POST['deptID'])) {
	$deptID = (int)$_POST['deptID'];

	$getDeptByIDquery = $conn->prepare("SELECT id, name, locationID FROM department WHERE id =" . '?');
	$getDeptByIDquery->bind_param('i', $deptID);

	$result = $getDeptByIDquery->execute();

	if ($result === false) {
		trigger_error($deleteLocQuery->error, E_USER_ERROR);
	}

	$resultArray = $deleteLocCountQuery->get_result()->fetch_all(MYSQLI_ASSOC);

	$data = [];

	while ($row = mysqli_fetch_assoc($resultArray)) {
		$tempHolder['id'] = $row['id'];
		$tempHolder['name'] = $row['name'];
		array_push($data, $tempHolder);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	header('Content-Type: application/json; charset=UTF-8');

	mysqli_close($conn);

	echo json_encode($output);
}
