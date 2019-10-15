window.onload = function() {
    var session = sessionStorage.getItem("login");
    if (session == null) {
        document.getElementById("dark").innerHTML = "<h1>Open First Page</h1>";
        document.getElementById("dark").style.height = "100vh";

        document.getElementById("dark").style.backgroundColor = "#000000";
        document.getElementById("dark").style.color = "#fff";
        document.getElementById("dark").style.textAlign = "center";
        document.getElementById("dark").style.fontSize = "40px";
    }
};


$(document).ready(function() {
    var db_name = sessionStorage.getItem("dbname");
    var admis_no = sessionStorage.getItem("admission_no");
    var databases = window.indexedDB.open(db_name);
    databases.onsuccess = function() {
        var premission = databases.result.transaction("about_school", "readwrite");
        var access = premission.objectStore("about_school");
        var check = access.get(db_name);
        check.onsuccess = function() {
            var idb = this.result;
            $('.school_tagline').html(idb.tagLine);
            $('.school_name').html(idb.schoolName);
            $(".office_no").html("Office Number : " + idb.phoneNumber + ", " + idb.mobileNumber)
        }

        var second_permission = databases.result.transaction("admission", "readwrite");
        var access_second = second_permission.objectStore("admission");
        var check_second = access_second.get(Number(admis_no));
        check_second.onsuccess = function() {
            var idb = this.result;

            $('.candidate_name').html(idb.s_name);
            $('.dob').html(idb.dob);
            $('.gender').html(idb.gender);
            $('.adm_date').html(idb.c_date);
            $('.f_name').html(idb.f_name);
            $('.m_name').html(idb.m_name);
            $('.mobile_num').html(idb.mobile_one + ", " + idb.mobile_two);
            $('.candidate_name').html(idb.s_name);
            $('.address').html(idb.address);
            var images = new Image();
            images.src = idb.upload_pic;
            images.width = "150";
            images.height = "150"
            $(".pic").html(images);

        }
    }
});

$(document).ready(function() {
    $('.print').click(function() {
        window.print();
    });
});