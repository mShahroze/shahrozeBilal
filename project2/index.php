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

    <!-- short -->
    <div class="using-border py-5"></div>
    <!-- //short-->

    <!-- Section Start-->
    <section class="py-lg-4 py-md-3 py-sm-3 py-3">
      <!-- Get data dynamically on cards -->
      <div class="container-fluid py-lg-5 py-md-4 py-sm-4 py-3">
        <div class="row-employeeData-container"></div>
      </div>
    </section>
    <!-- //Section End-->
  </div>

  <script type="application/javascript" src="vendors/js/jquery-3.6.0.min.js"></script>
  <script src="vendors/js/bootstrap.min.js"></script>
  <script type="application/javascript" src="libs/js/script.js"></script>
</body>

</html>