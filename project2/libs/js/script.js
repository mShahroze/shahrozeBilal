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
          // console.log(emp);
          empContent += `
          <div class="col-lg-4 col-md-5 col-sm-6 empCardBox">
          <div class="card-box">
            <div class="update-btn" onclick>
              <img src="libs/images/EmployeeAvatar.png" class="img-thumbnail img-fluid" alt="">
              <!-- Edit Button trigger modal -->
              <a href="#" class="btn btn-primary update-bottom" id="editEmployee" data-id="${emp.id}" data-toggle="modal" data-target="#updModal" onclick="showUpdModal(${emp.id})">
                <i class="fa fa-fw fa-edit"></i>Update
              </a>
            </div>
            <div class="updDelBox">
              <h2 data-first=${emp.firstName} data-last=${emp.lastName}>
              ${emp.firstName} ${emp.lastName}
              </h2>
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
          `;
          // console.log(empContent);
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
      if (result.status.description == 'success') {
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
  let prevDepartment = $('#prevDept option:selected').text();
  let newDepartment = $('#newDept').val();
  alert(prevDepartment);
  alert(newDepartment);
  $.ajax({
    url: 'libs/php/editDepartment.php',
    data: {
      prevDepartment: prevDepartment,
      newDepartment: newDepartment,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      // console.log(result);
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

$(document).on('click', '#editEmployee', function () {
  //alert('Edit Button Clicked');
  let getEmpID = $(this).data('id');
  // alert('Employee ID: ' + getEmpID);
  $.ajax({
    url: 'libs/php/getPersonnelByID.php',
    data: {
      empID: getEmpID,
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      console.log(result.data);
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
      $('#department').val(department);
      $('#location').val(location);
    },
  });
});

$(document).on('click', '#updateEmp', function (e) {
  // alert("Update Button Clicked");
  e.preventDefault(); //  prevent page default behavior

  let empID = $('#empid').val();
  let firstname = $('#firstname').val();
  let lastname = $('#lastname').val();
  let jobtitle = $('#jobtitle').val();
  let email = $('#email').val();
  let department = $('#department option:selected').text();
  let location = $('#location option:selected').text();
  // console.log(
  //   empID,
  //   firstname,
  //   lastname,
  //   jobtitle,
  //   email,
  //   department,
  //   location
  // );
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
      console.log(result);
      if (result.status.description == 'success') {
        getAll();
        $('#updEmpModal').modal('hide');
      }
    },
  });
});

$(document).on('click', '.deleteEmp', function () {
  getAll();
  // alert("Delete Button Clicked");
  let empID = $(this).data('id');
  console.log(empID);

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
              console.log(result);
              getAll();
            }
          },
        });
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        );
      }
    });
});

$('.searchDept').change(function () {
  select();
});
$('#search').keyup(function () {
  select();
});
$('.searchLoc').change(function () {
  select();
});

function select() {
  let department = $('.searchDept option:selected').text();
  let search = $('#search').val();
  let location = $('.searchLoc option:selected').text();

  console.log(department);

  $('.empCardBox').hide();
  let boxes = $('.empCardBox').filter(function (index) {
    return (
      (department === 'all' ||
        $(this)
          .children('.card-box')
          .children('.updDelBox')
          .children('.mt-1')
          .children('span')
          .children('.titleHead')
          .attr('data-department'.toLowerCase()) === department) &&
      (!search ||
        $(this)
          .children('.card-box')
          .children('.updDelBox')
          .children('h2')
          .attr('data-first')
          .toLowerCase()
          .indexOf(search.toLowerCase()) >= 0 ||
        !search ||
        $(this)
          .children('.card-box')
          .children('.updDelBox')
          .children('h2')
          .attr('data-last')
          .toLowerCase()
          .indexOf(search.toLowerCase()) >= 0 ||
        ((!search ||
          $(this)
            .children('.card-box')
            .children('.updDelBox')
            .children('.mt-1')
            .children('.titleHead')
            .attr('data-email')
            .indexOf(search.toLowerCase()) >= 0) &&
          (location === 'all' ||
            $(this)
              .children('.card-box')
              .children('.updDelBox')
              .children('.mt-1')
              .children('span')
              .children('.titleHead')
              .attr('data-location') === location)))
    );
  });
  boxes.show();
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
  $('.searchLoc').val('all').trigger('change');
  $('.searchDept').val('all').trigger('change');
});

// $(document).on('keyup', '#search', function () {
//   // console.log("Data loaded");

//   let empName = $(this).val(); // Renders whatever we type on the search field
//   //console.log(empName);
//   createRecord(empName);
// });

// function createRecord(empName) {
//   console.log(empName);
//   $.ajax({
//     url: 'libs/php/getPersonnelByName2.php',
//     data: {
//       emp: empName,
//     },
//     type: 'POST',
//     success: function (result) {
//       console.log(result);
//       $('.row-employeeData-container').html(result);
//     },
//   });
// }

let conf = {
  bgColor: 'rgb(31, 43, 49)',
  hoverColor: '#212529',
  opacity: 0.5,
};
