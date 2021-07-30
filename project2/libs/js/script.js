let empContent = '';
let empDeptInfo = '';
let empUpdDeptInfo = '';
let empLocInfo = '';
let empUpdLocInfo = '';
let search = '';
let searchDept = '';
let searchLoc = '';

function reload() {
  setTimeout(function () {
    window.location.reload(1);
  }, 1600);
}

$('#search').keyup(function () {
  search = $(this).val();
  select(search);
});
$('#searchDept').change(function () {
  searchDept = $('#searchDept option:selected').text() || '';
  select(searchDept);
});
$('#searchLoc').change(function () {
  searchLoc = $('#searchLoc option:selected').text() || '';
  select(searchLoc);
});

function select(searchName) {
  if (searchName != '') {
    $.ajax({
      url: 'libs/php/getPersonnelByName.php',
      type: 'POST',
      data: {
        search: searchName,
        dept: searchName,
        loca: searchName,
      },
      success: function (result) {
        empContent = '';
        if (result['data'].length > 0) {
          renderEmps(result['data']);
        } else {
          getAll();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
    });
  } else {
    empContent = '';
    getAll();
  }
}

$('#advanced-button').on('click', function () {
  $('#advanced-button').hide();
  $('#advancedRow').is(':visible')
    ? $('#advancedRow').hide()
    : $('#advancedRow').show();
  $('#return-button').is(':visible')
    ? $('#return-button').hide()
    : $('#return-button').show();
});

$('#return-button').on('click', function () {
  $('#return-button').hide();
  $('#advancedRow').is(':visible')
    ? $('#advancedRow').hide()
    : $('#advancedRow').show();
  $('#advanced-button').is(':visible')
    ? $('#advanced-button').hide()
    : $('#advanced-button').show();
  $('#searchLoc').val('all').trigger('change');
  $('#searchDept').val('all').trigger('change');
});

function renderEmps(empArray) {
  empArray.forEach((emp) => {
    empContent += `
    <div class="col-lg-4 col-md-6 col-sm-12 empCardBox">
    <div class="card-deck">
    <div class="card-box bg-light mb-3 h-100">
      <div class="update-btn" onclick>
        <img src="libs/images/EmployeeAvatar.png" class="img-thumbnail img-fluid" alt="">
        <!-- Edit Button trigger modal -->
        <a href="#" class="btn btn-primary update-bottom" id="editEmployee" data-id="${emp.id}" data-toggle="modal" data-target="#updModal" onclick="showUpdModal(${emp.id})">
          <i class="fa fa-fw fa-edit"></i>Update
        </a>
      </div>
      <div class="updDelBox">
        <h4 data-first=${emp.firstName} data-last=${emp.lastName}>
        ${emp.firstName} ${emp.lastName}
        </h4>
        <hr>
        <div class="mt-1">
          Job Title:
          <span class="titleHead">${emp.jobTitle}</span>
        </div>
        <div class="mt-1">
          Email:
          <span class="titleHead" data-email=${emp.email}>${emp.email}</span>
        </div>
        <div class="mt-1">
          Department:
          <span class="titleHead" data-department=${emp.department}>${emp.department}</span>
        </div>
        <div class="mt-1">
          Location:
          <span class="titleHead" data-location=${emp.location}>${emp.location}</span>
        </div>
        <hr>
        <div class="mt-1">
          <button type="submit" data-id="${emp.id}" class="btn btn-danger deleteEmp" value="Delete" name="">
            <i class="fa fa-fw fa-trash"></i> Delete</button>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
    </div>
  </div>
    `;
  });
  document.querySelector('.row-employeeData-container').innerHTML = empContent;
}

function getAll() {
  $.ajax({
    url: 'libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.name === 'ok') {
        renderEmps(result['data']);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
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
        document.querySelector('#searchDept').innerHTML = empDeptInfo;
        document.querySelector('#empUpdDept').innerHTML = empDeptInfo;
        document.querySelector('#dept').innerHTML = empDeptInfo;
        document.querySelector('#prevDept').innerHTML = empUpdDeptInfo;
        document.querySelector('#deleteDept').innerHTML = empDeptInfo;
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
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
        document.querySelector('#searchLoc').innerHTML = empLocInfo;
        document.querySelector('#empUpdLoc').innerHTML = empLocInfo;
        document.querySelector('#loc').innerHTML = empLocInfo;
        document.querySelector('#loca').innerHTML = empLocInfo;
        document.querySelector('#prevLocation').innerHTML = empUpdLocInfo;
        document.querySelector('#deleteLoc').innerHTML = empLocInfo;
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
}

getLocations();

function showAddEmpModal() {
  $('#AddEmployee').modal('show');
}

$(document).on('click', '#addEmployee', function (e) {
  e.preventDefault();
  let fname = $('#emp_firstname').val();
  let lname = $('#emp_lastname').val();
  let job_title = $('#emp_jobTitle').val();
  let email = $('#emp_email').val();
  let dept = $('#dept').val();
  let location = $('#location').val();
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
      if (result.status.description == 'success') {
        $('#AddEmployee').modal('hide');
        reload();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Employee has been Added',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});

$(document).on('click', '#editEmployee', function () {
  let getEmpID = $(this).data('id');
  $.ajax({
    url: 'libs/php/getPersonnelByID.php',
    data: {
      empID: getEmpID,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      let id = result.data.id;
      let firstName = result.data.firstName;
      let lastName = result.data.lastName;
      let jobTitle = result.data.jobTitle;
      let email = result.data.email;
      let department = result.data.department;
      let location = result.data.location;

      $('#empid').val(id);
      $('#lastname').val(lastName);
      $('#firstname').val(firstName);
      $('#jobtitle').val(jobTitle);
      $('#email').val(email);
      $('#empUpdDept').val(department);
      $('#empUpdLoc').val(location);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});

$(document).on('click', '#updateEmp', function (e) {
  e.preventDefault();

  let empID = $('#empid').val();
  let firstname = $('#firstname').val();
  let lastname = $('#lastname').val();
  let jobtitle = $('#jobtitle').val();
  let email = $('#email').val();
  let department = $('#empUpdDept').val();
  let location = $('#empUpdLoc').val();

  console.log(department, location);
  $.ajax({
    url: 'libs/php/editPersonnel.php',
    data: {
      empID: empID,
      firstName: firstname,
      lastName: lastname,
      jobTitle: jobtitle,
      email: email,
      department: department,
      location: location,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.description == 'success') {
        reload();
        $('#updEmpModal').modal('hide');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});

$(document).on('click', '.deleteEmp', function () {
  getAll();
  let empID = $(this).data('id');

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then((result) => {
      if (result.value) {
        $.ajax({
          url: 'libs/php/deletePersonnelByID.php',
          data: {
            empID: empID,
          },
          type: 'POST',
          success: function (result) {
            if (result.status.description == 'success') {
              reload();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
          },
        });
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        );
      }
    });
});

function showAddDeptModal() {
  $('#AddDepartment').modal('show');
}

$(document).on('click', '#addDepartment', function (e) {
  e.preventDefault();
  let department = $('#departmentAdd').val();
  let location = $('#loca').val();
  $.ajax({
    url: 'libs/php/insertDepartment.php',
    data: {
      department: department,
      location: location,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.description == 'success') {
        $('#AddDepartment').modal('hide');
        reload();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Department has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});

function showUpdDeptModal() {
  $('#UpdateDepartment').modal('show');
}

$(document).on('click', '#updateDepartment', function (e) {
  e.preventDefault();
  let prevDepartment = $('#prevDept option:selected').text();
  let newDepartment = $('#newDept').val();
  $.ajax({
    url: 'libs/php/editDepartment.php',
    data: {
      prevDepartment: prevDepartment,
      newDepartment: newDepartment,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.description == 'success') {
        $('#UpdateDepartment').modal('hide');
        reload();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Department has been Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});

function showDelDeptModal() {
  $('#DeleteDepartment').modal('show');
}

$(document).on('click', '#deleteDepartment', function (e) {
  e.preventDefault();
  let deleteDepartment = $('#deleteDept').val();
  $.ajax({
    url: 'libs/php/deleteDepartmentByID.php',
    data: {
      deleteDepartment: deleteDepartment,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.description == 'success') {
        $('#DeleteDepartment').modal('hide');
        reload();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Department has been Deleted Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});

function showAddLocModal() {
  $('#AddLocation').modal('show');
}

$(document).on('click', '#addLocation', function (e) {
  e.preventDefault();
  let location = $('#locationAdd').val();
  $.ajax({
    url: 'libs/php/insertLocation.php',
    data: {
      location: location,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.description == 'success') {
        $('#AddLocation').modal('hide');
        reload();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Location has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});

function showUpdLocModal() {
  $('#UpdateLocation').modal('show');
}

$(document).on('click', '#updateLocation', function (e) {
  e.preventDefault();
  let prevLocation = $('#prevLocation').val();
  let newLocation = $('#newLocation').val();
  $.ajax({
    url: 'libs/php/editLocation.php',
    data: {
      prevLocation: prevLocation,
      newLocation: newLocation,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.description == 'success') {
        $('#UpdateLocation').modal('hide');
        reload();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Location has been Updated',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});

function showDelLocModal() {
  $('#DeleteLocation').modal('show');
}

$(document).on('click', '#deleteLocation', function (e) {
  e.preventDefault();
  let deleteLocation = $('#deleteLoc').val();
  $.ajax({
    url: 'libs/php/deleteLocationByID.php',
    data: {
      deleteLocation: deleteLocation,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.description == 'success') {
        $('#DeleteLocation').modal('hide');
        reload();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Location has been Deleted',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
});

function navBarCollapse() {
  let dropDown = document.getElementById('navbarSupportedContent');
  if (dropDown.style.display === 'block') {
    dropDown.style.display = 'none';
  } else {
    dropDown.style.display = 'block';
  }
}

let conf = {
  bgColor: 'rgb(31, 43, 49)',
  hoverColor: '#212529',
  opacity: 0.5,
};
