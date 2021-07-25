let empContent = '';
let empDeptInfo = '';
let empUpdDeptInfo = '';
let empLocInfo = '';
let empUpdLocInfo = '';

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
        empUpdDeptInfo += `<option value="">Select Department</option>`;
        result.data.forEach((dpt) => {
          empDeptInfo += `
          <option value=${dpt.id}>${dpt.name}</option>";
          `;
          empUpdDeptInfo += `
          <option value=${dpt.name}>${dpt.name}</option>";
          `;
        });
        document.querySelector('#department').innerHTML = empDeptInfo;
        document.querySelector('#dept').innerHTML = empDeptInfo;
        document.querySelector('#prevDept').innerHTML = empUpdDeptInfo;
        document.querySelector('#deleteDept').innerHTML = empDeptInfo;
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
        empUpdLocInfo += `<option value="">Select Location</option>`;
        result.data.forEach((loc) => {
          empLocInfo += `
          <option value=${loc.id}>${loc.name}</option>
          `;
          empUpdLocInfo += `
          <option value=${loc.name}>${loc.name}</option>
          `;
        });
        document.querySelector('#location').innerHTML = empLocInfo;
        document.querySelector('#loc').innerHTML = empLocInfo;
        document.querySelector('#loca').innerHTML = empLocInfo;
        document.querySelector('#prevLocation').innerHTML = empUpdLocInfo;
        document.querySelector('#deleteLoc').innerHTML = empLocInfo;
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
      console.log(result);
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

function showUpdDeptModal() {
  $('#UpdateDepartment').modal('show');
}

$(document).on('click', '#updateDepartment', function (e) {
  e.preventDefault();
  // alert('Add Department Clicked');
  let prevDepartment = $('#prevDept').val();
  let newDepartment = $('#newDept').val();
  // alert(prevDepartment);
  // alert(newDepartment);
  $.ajax({
    url: 'libs/php/editDepartment.php',
    data: {
      prevDepartment: prevDepartment,
      newDepartment: newDepartment,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      console.log(result);
      if (result.status.description == 'success') {
        $('#UpdateDepartment').modal('hide');
        // getAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Department has been Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });
});

function showDelDeptModal() {
  $('#DeleteDepartment').modal('show');
}

$(document).on('click', '#deleteDepartment', function (e) {
  e.preventDefault();
  // alert("Add Department Clicked");
  let deleteDepartment = $('#deleteDept').val();
  // alert(deleteDepartment);
  $.ajax({
    url: 'libs/php/deleteDepartmentByID.php',
    data: {
      deleteDepartment: deleteDepartment,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      console.log(result);
      if (result.status.description == 'success') {
        $('#DeleteDepartment').modal('hide');
        // getAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Department has been Deleted Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });
});

function showAddLocModal() {
  $('#AddLocation').modal('show');
}

$(document).on('click', '#addLocation', function (e) {
  e.preventDefault();
  //  alert("Add Location Clicked");
  let location = $('#locationAdd').val();
  // alert(location);
  $.ajax({
    url: 'libs/php/insertLocation.php',
    data: {
      location: location,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      // console.log(result);
      if (result.status.description == 'success') {
        $('#AddLocation').modal('hide');
        // getAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Location has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });
});

function showUpdLocModal() {
  $('#UpdateLocation').modal('show');
}

$(document).on('click', '#updateLocation', function (e) {
  e.preventDefault();
  //  alert("Add Location Clicked");
  let prevLocation = $('#prevLocation').val();
  let newLocation = $('#newLocation').val();
  // alert(prevLocation);
  // alert(newLocation);
  $.ajax({
    url: 'libs/php/editLocation.php',
    data: {
      prevLocation: prevLocation,
      newLocation: newLocation,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      // console.log(result);
      if (result.status.description == 'success') {
        $('#UpdateLocation').modal('hide');
        // getAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Location has been Updated',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });
});

function showDelLocModal() {
  $('#DeleteLocation').modal('show');
}

$(document).on('click', '#deleteLocation', function (e) {
  e.preventDefault();
  //  alert("Add Location Clicked");
  let deleteLocation = $('#deleteLoc').val();
  // alert(deleteLoc);
  $.ajax({
    url: 'libs/php/deleteLocationByID.php',
    data: {
      deleteLocation: deleteLocation,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      // console.log(result);
      if (result.status.description == 'success') {
        $('#DeleteLocation').modal('hide');
        // getAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Location has been Deleted',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });
});
