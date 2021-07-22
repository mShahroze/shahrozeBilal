<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <link rel="shortcut icon" type="image/png" href="./libs/images/favicon.ico">
  <link href="libs/css/styles.css" rel='stylesheet' type='text/css' media="all">
  <link href="vendors/css/bootstrap.css" rel="stylesheet" />
  <link rel="stylesheet" href="vendors/fontawesome-free-5.15.3-web/css/all.css" />
  <link rel="stylesheet" href="vendors/font-awesome-4.7.0/css/font-awesome.min.css">

  <title>Company Directory</title>
</head>

<body>
  <div class="container-fluid">
    <!--header-->
    <?php include('header.php'); ?>
    <!--//header-->

    <!-- Section Start-->
    <section class="py-lg-4 py-md-3 py-sm-3 py-3">
      <!-- Get data dynamically on cards -->
      <div class="container-fluid py-lg-5 py-md-4 py-sm-4 py-3">
        <div class="row-employeeData-container"></div>
      </div>
    </section>
    <!-- //Section End-->

    <!-- Update Pop up Modal Start -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="exampleModalLabel">Update Employee Record</h3>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ...
            <!-- Edit Form Start -->
            <form>
              <!-- <div class="form-group">
                          <label for="#">ID</label>
                          <input type="text" class="form-control" id="eid" aria-describedby="eid" readonly>
                      </div> -->
              <div class="form-group">
                <label for="#">First Name</label>
                <input type="text" class="form-control" id="firstname" aria-describedby="firstname">
              </div>
              <div class="form-group">
                <label for="#">Last Name</label>
                <input type="text" class="form-control" id="lastname" aria-describedby="lastname">
              </div>

              <div class="form-group">
                <label for="#">Job Title</label>
                <input type="text" class="form-control" id="jobtitle" aria-describedby="jobtitle" placeholder="Enter Job Title">
              </div>
              <div class="form-group">
                <label for="#">Email</label>
                <input type="email" class="form-control" id="email" aria-describedby="email">
              </div>

              <div class="form-group">
                <label>Department</label>
                <!-- <input type="text" class="form-control" id="department" aria-describedby="department"> -->
              </div>
              <div class="form-group">
                <label>Location</label>
                <!-- <input type="text" class="form-control" id="location" aria-describedby="location"> -->
              </div>
              <button type="submit" id="updateEmp" class="btn btn-primary">Update</button>
            </form>
            <!-- Edit Form End-->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Update Pop up Modal End -->
  </div>

  <script type="application/javascript" src="vendors/js/jquery-3.6.0.min.js"></script>
  <script src="vendors/js/popper.min.js"></script>
  <script src="vendors/js/bootstrap.min.js"></script>
  <script type="application/javascript" src="libs/js/script.js"></script>
</body>

</html>