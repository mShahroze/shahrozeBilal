let empContent = '';
let empDeptInfo = '';
let empLocInfo = '';

function getAll() {
  $.ajax({
    url: 'libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.name === 'ok') {
        // console.log(result.data);
        result.data.forEach((emp) => {
          empContent += `
          <div class="col-lg-4 col-md-5 col-sm-6">
          <div class="card-box">
            <div class="update-btn" onclick>
              <img src="libs/images/EmployeeAvatar.png" class="img-thumbnail img-fluid" alt="">
              <!-- Edit Button trigger modal -->
              <a href="#" class="btn btn-primary update-bottom" id="editEmp" data-id="${emp.id}" data-toggle="modal" data-target="#updModal" onclick="showUpdModal(${emp.id})">
                <i class="fa fa-fw fa-edit"></i>Update
              </a>
            </div>
            <div class="updDelBox">
              <h2>
              ${emp.firstName} ${emp.lastName}
              </h2>
              <hr>
              <div class="mt-1">
                Job Title:
                <span class="titleHead">${emp.jobTitle}</span>
              </div>
              <div class="mt-1">
                Email:
                <span class="titleHead ">${emp.email}</span>
              </div>
              <div class="mt-1">
                Department:
                <span class="titleHead ">${emp.department}</span>
              </div>
              <div class="mt-1">
                Location:
                <span class="titleHead ">${emp.location}</span>
              </div>
              <hr>
              <div class="mt-1">
                <button type="submit" data-id="" class="btn btn-danger deleteEmp" value="Delete" name="">
                  <i class="fa fa-fw fa-trash"></i> Delete</button>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
          `;
        });
        document.querySelector('.row-employeeData-container').innerHTML =
          empContent;
      }
    },
  });
}

getAll();

function showUpdModal() {
  $('#updEmpModal').modal('show');
}

function getDepartments() {
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      // console.log(result);
      if (result.status.name === 'ok') {
        empDeptInfo += `<option value="">Select Department</option>`;
        result.data.forEach((emp) => {
          empDeptInfo += `
          <option value=${emp.id}>${emp.name}</option>";
          `;
        });
        document.querySelector('#department').innerHTML = empDeptInfo;
        document.querySelector('#dept').innerHTML = empDeptInfo;
      }
    },
  });
}

getDepartments();

function getLocations() {
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      // console.log(result);
      if (result.status.name === 'ok') {
        empLocInfo += `<option value="">Select Location</option>`;
        result.data.forEach((emp) => {
          empLocInfo += `
          <option value=${emp.id}>${emp.name}</option>
          `;
        });
        document.querySelector('#location').innerHTML = empLocInfo;
        document.querySelector('#loc').innerHTML = empLocInfo;
        document.querySelector('#loca').innerHTML = empLocInfo;
      }
    },
  });
}

getLocations();

function showAddEmpModal() {
  $('#AddEmployee').modal('show');
}

$(document).on('click', '#addEmployee', function (e) {
  e.preventDefault();
  // alert('Add Employee Clicked');
  let fname = $('#emp_firstname').val();
  let lname = $('#emp_lastname').val();
  let job_title = $('#emp_jobTitle').val();
  let email = $('#emp_email').val();
  let dept = $('#dept').val();
  let location = $('#location').val();
  // alert('Details Saved');
  $.ajax({
    url: 'libs/php/insertPersonnel.php',
    data: {
      fname: fname,
      lname: lname,
      job_title: job_title,
      email: email,
      dept: dept,
      location: location,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      // console.log(result);
      if (res.status.description == 'success') {
        $('#AddEmployee').modal('hide');
        getAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Employee has been Added',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });
});

function showAddDeptModal() {
  $('#AddDepartment').modal('show');
}

$(document).on('click', '#addDepartment', function (e) {
  e.preventDefault();
  // alert("Add Department Clicked");
  let department = $('#departmentAdd').val();
  let location = $('#loca').val();
  // alert('Details Saved');
  $.ajax({
    url: 'libs/php/insertDepartment.php',
    data: {
      department: department,
      location: location,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      // console.log(result);
      if (result.status.description == 'success') {
        $('#AddDepartment').modal('hide');
        getAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Department has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });
});
