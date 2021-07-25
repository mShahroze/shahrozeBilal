<?php
    
    // Check that we have a value to use to add to databse
    if(isset($_POST['firstName'])){
    
      ini_set('display_errors', 'On');
      error_reporting(E_ALL);
      
      $executionStartTime = microtime(true);
      
      // Include the preset username, password etc. for database
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
    
      // Establish a statement to use in SQL where we are editing data in the table personnel
      $stmt = $conn->prepare("UPDATE personnel SET firstName = :firstName, lastName = :lastName, jobTitle = :jobTitle, email = :email, departmentID = :departmentID WHERE id = :id");
      // Use bind param to pass variable to use in the SQL statement 
      $stmt->bindParam(':firstName', ucwords(strtolower($_POST['firstName'])));
      $stmt->bindParam(':lastName', ucwords(strtolower($_POST['lastName'])));
      $stmt->bindParam(':jobTitle', ucwords(strtolower($_POST['jobTitle'])));
      $stmt->bindParam(':email', $_POST['email']);
      $stmt->bindParam(':departmentID', $_POST['departmentID']);
      $stmt->bindParam(':id', $_POST['id']);
      // Execute the statment
      $result = $stmt->execute();

      if (!$result) {

          $output['status']['code'] = "400";
          $output['status']['name'] = "executed";
          $output['status']['description'] = "query failed";	
          $output['data'] = [];
  
          mysqli_close($conn);
  
          echo json_encode($output); 
  
          exit;
  
      }
  
      $output['status']['code'] = "200";
      $output['status']['name'] = "ok";
      $output['status']['description'] = "success";
      $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
      $output['data'] = [];
  
      echo json_encode($output);
    }	 

?>