let empContent = '';

function getAll() {
  $.ajax({
    url: 'libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.name === 'ok') {
        console.log(result.data);
        result.data.forEach((emp) => {
          empContent += `
          <div class="col-lg-4 col-md-5 col-sm-6">
          <div class="card-box">
            <div class="update-btn" onclick>
              <img src="libs/images/EmployeeAvatar.png" class="img-thumbnail img-fluid" alt="">
              <!-- Edit Button trigger modal -->
              <a href="#" class="btn btn-primary update-bottom" id="editEmp" data-id="${emp.id}" data-toggle="modal" data-target="#exampleModal">
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
$('#editEmp').on('click', function () {
  $('#myModal').modal('show');
});

// Function to  fill the input boxes with an employees current data. This is done for two reasons, one so the  user can easily see what they change and also
// so that the data does not have to be re-typed if it is the same.
function showModal(data) {
  $.ajax({
    url: 'php/editEmployee.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: data,
    },
    success: function (result) {
      // Appends each input value to their respective data
      $('#editID').val(result['id']);
      $('#editName').val(result['firstName']);
      $('#editLast').val(result['lastName']);
      $('#editEmail').val(result['email']);
      $('#editJob').val(result['job']);
      $('#editDep').val(result['department']);
      $('#editLoc').val(result['location']);
      $('#edit-modal').modal();
    },
    error: function (jqXHR, exception) {
      errorajx(jqXHR, exception);
      console.log('Edit Employee');
    },
  });
}
