// Handle Api get data, add edit delete data
$(document).ready(function() {
    //Để gán thông tin nhân viên muốn tìm kiếm
    let ifEmployee="";
    // Để gán departentID để lọc theo phòng ban
    let department="";
    // Để gán positionID để lọc theo vị trí
    let position="";
    // Để gán pagesize lọc theo số nhân viên muốn hiển thị trên 1 trang
    let pagesize;
    
    loadPosition("#select-position");
    loadDepartment("#select-department");

    // gán các sự kiện cho các element:
    initEvents();

    var inputElement = document.querySelector("#searchEmployee");
    console.log(inputElement);
    // Xử lý sự kiện khi nhập gì đó vào ô tìm kiếm
    inputElement.oninput = function (e) {
        console.log(e.target.value);

        // Load dữ liệu theo input tìm kiếm
        loadData(e.target.value,position,department,pagesize);
        ifEmployee=e.target.value;
    }

    // Xử lý sự kiện khi chọn phòng ban muốn lọc
    $('#select-department').on('change', function() {
        department=this.value;
        console.log(department);
        loadData(ifEmployee,position,department,pagesize); 
    });
    
    // Xử lý sự kiện khi chọn vị trí muốn lọc
    $('#select-position').on('change', function() {
        position=this.value;
        loadData(ifEmployee,position,department,pagesize);
    });

    // Xử lý sự kiện khi chọn số trang muốn hiển thị
    $('#pagesize').on('change', function() {
        pagesize=this.value;
        loadData(ifEmployee,position,department,pagesize);
    });

    // Load dữ liệu nếu người dùng không tìm kiếm hay lọc
    loadData("",position,department,pagesize);

    // Xử lý sự kiện khi người dùng nhập giá tiền
    var inputElement = document.querySelector("#salary");
    console.log(inputElement);
    inputElement.oninput = function (e) {
        let salary_target=e.target.value.replace(/[^0-9 ]/g, "");
        $("#salary").val(salary_target.replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
    }
})

// Load vị trí để lọc
 function loadPosition(selectposition){
    $.ajax({
        type: "GET",
        async: false,
        url:"http://localhost:48388/api/v1/Positions",
        success: function(res) {
            var datapositions=res;
            console.log(datapositions);
            $(selectposition).empty();

            $(selectposition).append("<option value=''>"
                        +"Tất cả vị trí"+ "</option>");

                for (var i = 0; i < datapositions.length; i++) {
                        $(selectposition).append("<option value=" +datapositions[i]["positionID"] + ">"
                            + datapositions[i]["positionName"] + "</option>");

                }
        },
        error: function(res) {
            console.log(res);
        }
    })
 }

 //Load phòng ban để lọc
 function loadDepartment(selecdepartment){
    $.ajax({
        type: "GET",
        async: false,
        url:"http://localhost:48388/api/v1/Departments",
        success: function(res) {
            var datadepartments=res;
            console.log(datadepartments);
            $(selecdepartment).empty();

            $(selecdepartment).append("<option value=''>"
                        +"Tất cả phòng ban"+ "</option>");

                for (var i = 0; i < datadepartments.length; i++) {

                        $(selecdepartment).append("<option value=" +datadepartments[i]["departmentID"] + ">"
                            +datadepartments[i]["departmentName"] + "</option>");

                }
        },
        error: function(res) {
            console.log(res);
        }
    })
 }

//Id nhân viên
var employeeId = null;
//formMode để kiếm tra nhấn save là thêm mới hay sửa
var formMode = "add";
// data này sẽ chứa dữ liệu của employee
var data=null;

/**
 * Thực hiện load dữ liệu lên table
 * Author: NVDIA (28/08/2022)
 */

// Trang hiển thị
let pageNumber=1;
// Số giá trị trong 1 trang;
let pageSize=$('#pagesize').val();

// Tống số trang
let totalpage=0;

//Load dữ liệu
function loadData(keyword,positionID,departmentID,pagesizecombobox){
     //Biến để gán chuỗi trang hiển thị và số lượng employee trên 1 trang
     var paging;
     if(keyword!=null||keyword!=undefined){
        paging="keyword="+keyword;
     }
     if(positionID!=null||positionID!=undefined){
        paging+="&positionID="+positionID;
     }
     if(departmentID!=null||departmentID!=undefined){
        paging+="&departmentID="+departmentID;
     }
     if(pagesizecombobox!=null&&pagesizecombobox!=undefined){
        pageSize=pagesizecombobox;
     }

     paging+="&pageSize="+pageSize+"&pageNumber="+pageNumber;
     console.log(paging);
    $.ajax({
                type: "GET",
                async: false,
                url: "http://localhost:48388/api/v1/Employees/filter?"+paging,
                success: function(res) {
                    totalpage=res.totalCount;
                    var dataEmployee=res.data;
                    $("table#tbEmployeeList tbody").empty();
                    // Xử lý dữ liệu từng đối tượng:
                    var sort = 1;
                    let ths = $("table#tbEmployeeList thead th");

                    for (const emp of dataEmployee) {
                        // duyệt từng cột trong tiêu đề:
                        var trElement = $('<tr></tr>');
                        for (const th of ths) {

                            // Lấy ra propValue tương ứng với các cột:
                            const propValue = $(th).attr("propValue");
        
                            const format = $(th).attr("format");
                            // Lấy giá trị tương ứng với tên của propValue trong đối tượng:
                            let value = null;
                            if (propValue == "Sort")
                                value = sort
                            else
                                value = emp[propValue];
                            let classAlign = "";
                            switch (format) {
                                case "date":
                                    value = formatDate(value);
                                    classAlign = "text-align--center";
                                    break;
                                case "money":
                                    value = Math.round(Math.random(100) * 1000000);
                                    value = formatMoney(value);
                                    classAlign = "text-align--right";
                                    break;
                                case "departmentid":
                                    value=formatdepartmentid(value);
                                    classAlign = "text-align--right";
                                    break;
                                case "gender":
                                    value=formatgender(value);
                                    classAlign = "text-align--right";
                                    break;   
                                case "positionid":
                                    value=formatpositionid(value);
                                    classAlign = "text-align--right";
                                     break; 
                                case "workstatus":
                                    value=formatworkstatus(value);
                                    classAlign = "text-align--right";
                                    break;
                                default:
                                    break;
                            }
        
                            // Tạo thHTML:
                            let thHTML = `<td class='${classAlign}'>${value||""}</td>`;
        
                            // Đẩy vào trHMTL:
                            trElement.append(thHTML);
                        }
                        sort++;
                        $(trElement).data("id", emp.employeeID);
                        $(trElement).data("entity", emp);
                        $("table#tbEmployeeList tbody").append(trElement)
                    }
                    renderPgeNumber();
                    // Hiện thị lượng employee trên 1 trang đang chọn và số lượng employee
                    $("#showallemployee").text("Hiển thị 1-"+res.data.length+"/"+res.totalCount+" nhân viên");
                },
                error: function(res) {
                    console.log(res);
                }
            });
}

//Hàm này thực thi hiển thị màu trang muốn xem và xóa màu trang xem trước đó
function handlePageNumber(num){
    pageNumber=num;
    loadData();
    // nếu nhấn trang tiếp theo để phân trang thì màu trang đầu tiên sẽ mất
    if(num!=1){

        $(`#${1}`).removeClass("active");
    }
    // Thay đổi màu của trang chọn
    $(`#${num}`).addClass("active");
}

// Hàm này hiển thị dãy các số trang để người dùng có thể chọn xem từng trang
function renderPgeNumber(){
    $("#paging").empty();
    totalpage=totalpage/pageSize;
    console.log("aaaaa"+totalpage);
    debugger;
    var result = (totalpage- Math.floor(totalpage)) !== 0; 
    if(result){
        if(totalpage%2!=0&&totalpage!=1){
            debugger;
            totalpage=Math.floor(totalpage)+1;
        }
    }
    console.log("bbbb"+totalpage);
    for(let i=1;i<=totalpage;i++){
        let pageNumberElement;
        if(i==1){
            pageNumberElement=`<a id="${i}" class="active" onclick="handlePageNumber(${i})">${i}</a>`;
        }else{
            pageNumberElement=`<a id="${i}" onclick="handlePageNumber(${i})">${i}</a>`;
        }
        $("#paging").append(pageNumberElement);
    }
}

/**
 * Định dạng hiển thị ngày tháng năm
 * @param {Date} date 
 * @returns 
 * Author: NVDIA (28/08/2022)
 */
 function formatDate(date) {
    try {
        if (date) {
            date = new Date(date);

            // Lấy ra ngày:
            dateValue = date.getDate();

            // lấy ra tháng:
            let month = date.getMonth() + 1;

            // lấy ra năm:
            let year = date.getFullYear();

            return `${dateValue}/${month}/${year}`;
        } else {
            return "";
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Định dạng hiển thị tiền VND
 * @param {Number} money 
 */
function formatMoney(money) {
    try {
        money = new Intl.NumberFormat('vn-VI', { style: 'currency', currency: 'VND' }).format(money);
        return money;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Định dạng hiển thị phòng ban
 * @param {String} departmentName
 */
function formatdepartmentid(departmentid){
    let departmentName;
    try{
        $.ajax({
            url: "http://localhost:48388/api/v1/Departments",
            async: false, 
            method: "GET",
            success: function(res) {
                let department=res;
                for (var i = 0; i < department.length; i++) {
                    if(department[i]["departmentID"]==departmentid){
                        departmentName=department[i]["departmentName"].toString();
                    }
                }
            }
        });
        console.log("mmmmm"+departmentName);
        return departmentName;
    }catch(error){
        console.log(error);
    }
}

/**
 * Định dạng hiển thị vị trí
 * @param {String} positionName
 */
function formatpositionid(positionid){
    let positionName;
    try{
        $.ajax({
            url: "http://localhost:48388/api/v1/Positions",
            async: false, 
            method: "GET",
            success: function(res) {
                let positions=res;
                for (var i = 0; i < positions.length; i++) {
                    if(positions[i]["positionID"]==positionid){
                       positionName=positions[i]["positionName"].toString();
                    }
                }
            }
        });
        console.log("mmmmm"+positionName);
        return positionName;
    }catch(error){
        console.log(error);
    }
}

/**
 * Định dạng hiển thị giới tính
 * @param {String} genderName
 */
function formatgender(gender){
    let genderName;
    if(gender==0){
        genderName="Nữ";
    }else{
        if(gender==1){
            genderName="Nam";
        }else{
            genderName="Khác";
        }
    }
    return genderName;
}

/**
 * Định dạng hiển thị 
 * @param {String} workstatusName
 */
 function formatworkstatus(workstatuss){
    let workstatus;
    if(workstatuss==0){
        workstatus="Đang làm";
    }else{
        if(workstatuss==1){
            workstatus="Nghỉ phép";
        }else{
            if(workstatuss==2){
                workstatus="Đã nghỉ";
            }else{
                workstatus="";
            }
            
        }
    }
    return workstatus;
}

//Hàm gán các sự kiện cho các element
function initEvents(){

    // Xóa nhân viên
    $("#btnDelete").click(function() {
        console.log(employeeId);
        $("#form-1").hide();
        var result = confirm("Want to delete?");
        if (!result) {
            return;       
        }
        $.ajax({
            type: "DELETE",
            url: "http://localhost:48388/api/v1/Employees/" + employeeId,
            success: function(response) {
                alert("Xóa thành công");
                // Load lại dữ liệu:
                loadData("","","");
            },
            error: function(res) {
                console.log(res);
            }
        });
    });
    // Nhân bản nhân viên
    $("#btnReplication").click(function() {
        // Hiển thị form:
        $("#form-1").show();

        $('input').val(null);
        $('select').val(null);
        $("#form-1 input")[0].focus();

        // Binding dữ liệu tương ứng với bản ghi vừa chọn:
        console.log(employeeId);
        data=getEmployeeID(employeeId);

         // Duyệt tất cả các input:
         let inputs = $("#form-1 input,#form-1 select");
         for (const input of inputs) {
             // Đọc thông tin propValue:
             const propValue = $(input).attr("propValue");
             const format = $(input).attr("format");
             if (propValue) {
                 let value="";
                 if(propValue=="dateOfBirth"||propValue=="indentityIssuedDate"||propValue=="joiningDate"){
                     if(data[propValue]){
                         value=moment(data[propValue], "YYYY-MM-DD").format('YYYY-MM-DD');             
                     }
                 }
                 else
                 {
                    if(propValue=="departmentID"){
                        debugger;
                        console.log(data[propValue]);
                    }
                    if(propValue=="employeeCode"){
                        value="";
                    }else{
                        if(propValue=="salary"){
                            debugger;
                            let salaryif="";
                            salaryif=data[propValue].toString();
                            value =salaryif.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }else{
                            value = data[propValue];
                        }
                    }
                 }
                 input.value = value;
             }
         }

        // Lấy mã nhân viên mới thông qua Api 
        $.ajax({
            url: "http://localhost:48388/api/v1/Employees/NewEmployeeCode",
            method: "GET",
            success: function(newEmployeeCode) {
                console.log("Mã nhân viên"+newEmployeeCode);
                $("#employeeCode").val(newEmployeeCode);
            }
        });
        //$('#employeeCode').attr("readonly", false);
        $("#employeeCode").prop('disabled', true);
    });

    // Hiển thị form thêm và điền trước mã nhân viên nhờ vào API
    $("#btnAdd").click(function() {

        // Hiển thị form
        $("#form-1").show();

        // Focus vào ô nhập liệu đầu tiên:
        $('#form-1 input')[0].focus();
        formMode = "add";

        // Hiển thị form nhập thông tin chi tin chi tiết:
        $('input').val(null);
        $('select').val(null);
        // Lấy mã nhân viên mới thông qua Api 
        $.ajax({
            url: "http://localhost:48388/api/v1/Employees/NewEmployeeCode",
            method: "GET",
            success: function(newEmployeeCode) {
                console.log("Mã nhân viên"+newEmployeeCode);
                $("#employeeCode").val(newEmployeeCode);
            }
        });
        $("#employeeCode").prop('disabled', true);
    }) 

    // Dùng để gọi create or update
    $("#btnSave").click(saveData);

    // Ẩn form
    $("#btnClose").click(function() {
        $("#form-1").hide()
    });

    // Kích đúp chuột vào hàng hiển thị form chi tiết và có thể nhấn lưu để sửa
    $(document).on('dblclick', 'table#tbEmployeeList tbody tr', function() {
        formMode = "edit";
        // Hiển thị form:
        $("#form-1").show();
 
        // Load dữ liệu phòng ban và vị trí
        loadPosition("#positionID");
        loadDepartment("#departmentID");

        // Focus vào ô input đầu tiên:
        $("#form-1 input")[0].focus();

        // Binding dữ liệu tương ứng với bản ghi vừa chọn:
        employeeId = $(this).data('id');
        debugger;
        data=getEmployeeID(employeeId);   
        // Duyệt tất cả các input:
        let inputs = $("#form-1 input,#form-1 select");
        for (const input of inputs) {
            // Đọc thông tin propValue:
            const propValue = $(input).attr("propValue");
            const format = $(input).attr("format");
            if (propValue) {
                let value="";
                if(propValue=="dateOfBirth"||propValue=="indentityIssuedDate"||propValue=="joiningDate"){
                    if(data[propValue]){
                        value=moment(data[propValue], "YYYY-MM-DD").format('YYYY-MM-DD');             
                    }
                }
                else
                { 
                    if(propValue=="salary"){
                        let salaryif="";
                        salaryif=data[propValue].toString();
                        value =salaryif.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    }else{
                        value = data[propValue];
                    }
                }
                input.value = value;
            }
        }
        $("#employeeCode").prop('disabled', true);
    });

    // In đậm dòng được chọn và xóa in đậm dòng đã chọn trước đó
    $(document).on('click', 'table#tbEmployeeList tbody tr', function() {
        // Xóa tất cả các trạng thái được chọn của các dòng dữ liệu khác:
        $(this).siblings().removeClass('row-selected');
        // In đậm dòng được chọn:
        this.classList.add("row-selected");
        employeeId = $(this).data('id');
        //data = $(this).data('entity');
        loadPosition("#positionID");
        loadDepartment("#departmentID");
    });

}

// Lấy dữ liệu chi tiết của một nhân viên
function getEmployeeID(employeeid){
    let employee;
    try{
        $.ajax({
            url: "http://localhost:48388/api/v1/Employees/"+employeeid,
            async: false, 
            method: "GET",
            success: function(res) {
                employee=res;
                console.log(employee);
                debugger;
            }
        });
        return employee;
    }catch(error){
        console.log(error);
    }
}

// Thêm mới và sửa nhân viên
function saveData() {
    // Thu thập dữ liệu:
    let inputs = $("#form-1 input,#form-1 select");
    var employee = {};
    employee["employeeID"]="3fa85f64-5717-4562-b3fc-2c963f66afa6";
    console.log(JSON.stringify(employee));
    // build object:
    for (const input of inputs) {
        // Đọc thông tin propValue:
        const propValue = $(input).attr("propValue");
        // Lấy ra value:
        if (propValue) {
            let value;
            if(propValue=="gender"||propValue=="salary"||propValue=="workStatus"){
                debugger;
                value=Number(input.value.replace(/[^0-9 ]/g, "")); 
            }else{
                value = input.value;
            }
            employee[propValue] = value;
        }
    }
    employee["createdDate"]=new Date();
    employee["createdBy"]="";
    employee["modifiedDate"]=new Date();
    employee["modifiedBy"]="";

    console.log(JSON.stringify(employee));
    // Gọi api thực hiện cất dữ liệu:
    if (formMode == "edit") {
        $.ajax({
            type: "PUT",
            url: "http://localhost:48388/api/v1/Employees/" + employeeId,
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                alert("Sửa dữ liệu thành công!");
                // load lại dữ liệu:
                loadData();
                // Ẩn form chi tiết:
                $("#form-1").hide();

            }
        });
    } else {
        $.ajax({
            type:"POST",
            url:"http://localhost:48388/api/v1/Employees",
            data:JSON.stringify(employee),
            dataType:"json",
            contentType: "application/json",
            success: function(response) {
                alert("Thêm mới dữ liệu thành công!");
                // load lại dữ liệu:
                debugger;
                loadData();
                // Ẩn form chi tiết:
                $("#form-1").hide();

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("loi"+errorThrown);
                alert(errorThrown);
            }
        });
    }


}