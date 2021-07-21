let content = '';

function getAll() {
  $.ajax({
    url: 'libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.name === 'ok') {
        console.log(result.data);
        result.data.forEach((emp) => {
          content += `
          <div class="col-lg-4 col-md-5 col-sm-6">
          <div class="card-box">
            <div class="update-btn">
              <img src="libs/images/EmployeeAvatar.png" class="img-thumbnail img-fluid" alt="">
              <!-- Edit Button trigger modal -->
              <a href="#" class="update-bottom" id="editEmp" data-id="" data-toggle="modal" data-target="#exampleModal">
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
          content;
      }
    },
  });
}

getAll();
