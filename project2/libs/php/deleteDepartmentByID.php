<?php

// example use from browser
// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id= <id>

// remove next two lines for production

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

if (isset($_POST['departmentID'])) {
	$departmentID = (int)$_POST['departmentID'];


	$deleteDeptCountQuery = $conn->prepare("SELECT COUNT(firstName) as emp FROM personnel WHERE personnel.departmentID = ?");

	$deleteDeptCountQuery->bind_param('i', $departmentID);

	$deleteDeptCountQuery->execute();

	$countResult = $deleteDeptCountQuery->get_result()->fetch_all(MYSQLI_ASSOC);

	$personnel = $countResult[0]['emp'];

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

$deleteDeptQuery = $conn->prepare("DELETE FROM department WHERE id =" . '?');
$deleteDeptQuery->bind_param('i', $departmentID);

$result = $deleteDeptQuery->execute();

if ($result === false) {
	trigger_error($deleteLocQuery->error, E_USER_ERROR);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "delete success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

mysqli_close($conn);

echo json_encode($output);
