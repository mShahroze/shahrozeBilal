<nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="navBar1">
    <a class="navbar-brand" href="index.php">
        <img src="libs/images/companydirectory-logo.png" style="display: inblock; width: 80px; height: 80px; margin-left: 30px;" class="d-inline-block align-top" alt="">
    </a>
</nav>

<nav class="navbar navbar-expand-lg bg-dark navbar-dark" id="navBar2">

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">

        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#AddEmployee" style="margin-left:30px;" onclick="showAddEmpModal()">
            <i class="fa fa-fw fa-plus"></i> Add Employee
        </button>
        &nbsp;

        <div class="dropdown">
            <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Departments
            </button>
            <div class="dropdown-menu">
                <a class="dropdown-item" href="#AddDepartment" data-toggle="modal" data-target="#AddDepartment" onclick="showAddDeptModal()">Add </a>
                <a class="dropdown-item" href="#UpdateDepartment" data-toggle="modal" data-target="#UpdateDepartment" onclick="showUpdDeptModal()">Update </a>
                <a class="dropdown-item" href="#DeleteDepartment" data-toggle="modal" data-target="#DeleteDepartment" onclick="showDelDeptModal()">Delete </a>
            </div>
        </div>
        &nbsp;

        <div class="dropdown">
            <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Locations
            </button>
            <div class="dropdown-menu">
                <a class="dropdown-item" href="#AddLocation" data-toggle="modal" data-target="#AddLocation" onclick="showAddLocModal()">Add</a>
                <a class="dropdown-item" href="#UpdateLocation" data-toggle="modal" data-target="#UpdateLocation">Update</a>
                <a class="dropdown-item" href="#DeleteLocation" data-toggle="modal" data-target="#DeleteLocation">Delete</a>
            </div>
        </div>
        &nbsp;

        <a href="index.php" class="btn btn-success"><i class="fa fa-refresh" aria-hidden="true"></i></a>
        &nbsp;

        <ul class="navbar-nav mr-auto" id="searchBar">
            <form class="form-inline my-2 my-lg-0">
                <input style="width: 380px; border-radius: 100px;" class="form-control mr-sm-2" type="search" id="search" placeholder="Search By Name, Department, Location & Email">
            </form>
            <a class="btn btn-secondary btn-sm mr-sm-2" id="advanced-button" style="width: 150px; border-radius: 100px;">Advanced search</a>
        </ul>

    </div>
</nav>