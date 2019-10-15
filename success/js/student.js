$(document).ready(function() {
    var student_class = sessionStorage.getItem("student_class");
    var dbname = sessionStorage.getItem("dbname");
    var database = window.indexedDB.open(dbname);
    database.onsuccess = function() {

        var idb = this.result;
        var permission = idb.transaction("admission", "readwrite");
        var access = permission.objectStore("admission");
        var check = access.getAllKeys();
        check.onsuccess = function() {
            var keys = this.result;

            for (var i = 0; i < keys.length; i++) {
                var check_data = access.get(keys[i]);
                check_data.onsuccess = function() {
                    var data = this.result;
                    if (data.class == student_class) {
                        var tr = document.createElement("TR");
                        var pic_td = document.createElement("TD");
                        var image = new Image();
                        image.src = data.upload_pic;
                        image.width = "100";
                        image.height = "90";
                        pic_td.append(image);
                        var sname_td = document.createElement("TD");
                        sname_td.style.verticalAlign = "middle";
                        sname_td.innerHTML = data.s_name;

                        var fname_td = document.createElement("TD");
                        fname_td.style.verticalAlign = "middle";
                        fname_td.innerHTML = data.f_name;

                        var mname_td = document.createElement("TD");
                        mname_td.style.verticalAlign = "middle";
                        mname_td.innerHTML = data.m_name;

                        var dob_td = document.createElement("TD");
                        dob_td.style.verticalAlign = "middle";
                        dob_td.innerHTML = data.dob;

                        var current_td = document.createElement("TD");
                        current_td.style.verticalAlign = "middle";
                        current_td.innerHTML = data.c_date;

                        var mobile_td = document.createElement("TD");
                        mobile_td.style.verticalAlign = "middle";
                        mobile_td.innerHTML = data.mobile_one + " , <br>" + data.mobile_two;

                        var address_td = document.createElement("TD");
                        address_td.style.verticalAlign = "middle";
                        address_td.innerHTML = data.address;

                        tr.append(pic_td);
                        tr.append(sname_td);
                        tr.append(fname_td);
                        tr.append(mname_td);
                        tr.append(dob_td);
                        tr.append(current_td);
                        tr.append(mobile_td);
                        tr.append(address_td);
                        $(".table").append(tr);

                    }
                }

            }
            var admission_permission = database.result.transaction("about_school", "readwrite");
            var admission_access = admission_permission.objectStore("about_school");
            var admission_check = admission_access.get(dbname);
            admission_check.onsuccess = function() {
                //retrive logo and school name and tag line
                var logo = new Image();
                logo.src = admission_check.result.school_logo;
                logo.width = "100";
                logo.height = "100";

                $(".logo").append(logo);
                $(".school_name").append(admission_check.result.schoolName);

                $(".tagLine").append(admission_check.result.tagLine);

                //principal and director sign retrive
                var tr = document.createElement("TR");
                var prin_td = document.createElement("TD");
                prin_td.setAttribute("colspan", "4");
                var pri_logo = new Image();
                pri_logo.src = admission_check.result.principal_sign;
                pri_logo.width = "200";
                pri_logo.height = "50";
                prin_td.append(pri_logo);
                tr.append(prin_td);


                var dir_td = document.createElement("TD");
                dir_td.setAttribute("colspan", "4");
                var dir_logo = new Image();
                dir_logo.src = admission_check.result.director_sign;
                dir_logo.width = "200";
                dir_logo.height = "50";
                dir_td.append(dir_logo);
                tr.append(dir_td);
                $(".table").append(tr);

            }
        }

    }
});






// $(document).ready(function () {
//     var dbname = sessionStorage.getItem("dbname");
//     var database = window.indexedDB.open(dbname);
//     database.onsuccess = function () {
//         var idb = this.result;
//         var permission = idb.transaction("admission", "readwrite");
//         var access = permission.objectStore("admission");
//         var check = access.getAllKeys();
//         check.onsuccess = function () {
//             var keys = this.result;
//             for (var i = 0; i < keys.length; i++) {
//                 var check_data = access.get(keys[i]);
//                 check_data.onsuccess = function () {
//                     console.log(this.result);
//                 }
//             }
//         }
//     }
// });