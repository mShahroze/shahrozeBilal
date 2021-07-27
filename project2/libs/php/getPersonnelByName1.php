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

if (isset($_POST['emp'])) {
  $emp = $_POST['emp'];
  $query = "SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email, d.name as department, l.name 
        as location FROM personnel p 
        LEFT JOIN department d ON (d.id = p.departmentID) 
        LEFT JOIN location l ON (l.id = d.locationID) 
        WHERE p.firstName LIKE '$emp%' 
        OR p.lastName LIKE '$emp%'
        OR d.name LIKE '$emp%'
        OR l.name LIKE '$emp%'
        OR p.email LIKE '$emp%'
        ORDER BY p.firstName, p.lastName, d.name, l.name";

  $result = $conn->query($query);

  if ($result->num_rows > 0) {
    while ($r = $result->fetch_object()) {
      // print_r($resultEmp); 
?>
      <div class="col-lg-4 col-md-5 col-sm-6 empCardBox">
        <div class="card-box">
          <div class="update-btn" onclick>
            <img src="libs/images/EmployeeAvatar.png" class="img-thumbnail img-fluid" alt="">
            <!-- Edit Button trigger modal -->
            <a href="#" class="btn btn-primary update-bottom" id="editEmployee" data-id="<?php echo $r->id; ?>" data-toggle="modal" data-target="#updModal" onclick="showUpdModal(<?php echo $r->id; ?>)">
              <i class="fa fa-fw fa-edit"></i>Update
            </a>
          </div>
          <div class="updDelBox">
            <h2>
              <?php echo $r->firstName; ?> <?php echo $r->lastName; ?>
            </h2>
            <hr>
            <div class="mt-1">
              Job Title:
              <span class="titleHead"><?php echo $r->jobTitle; ?></span>
            </div>
            <div class="mt-1">
              Email:
              <span class="titleHead">$<?php echo $r->email; ?></span>
            </div>
            <div class="mt-1">
              Department:
              <span class="titleHead"><?php echo $r->department; ?></span>
            </div>
            <div class="mt-1">
              Location:
              <span class="titleHead"><?php echo $r->location; ?></span>
            </div>
            <hr>
            <div class="mt-1">
              <button type="submit" data-id="<?php echo $r->id; ?>" class="btn btn-danger deleteEmp" value="Delete" name="">
                <i class="fa fa-fw fa-trash"></i> Delete</button>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    <?php
    }
  } else {
    ?>

    <h1>Record Not Found</h1>

<?php
  }

  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";

  mysqli_close($conn);

  echo json_encode($output);
}
