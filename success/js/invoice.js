$(document).ready(function() {
    //school information
    var total = 0;
    var db_name = sessionStorage.getItem("dbname");
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function() {
        var idb = this.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check = access.get(db_name);
        check.onsuccess = function() {
            var data = this.result;
            $(".school_name").html(data.schoolName);
            $(".tag-line").html(data.tagLine);
            $(".address").html("Venue : " + data.address);
            var logo_image = new Image();
            logo_image.src = data.school_logo;
            logo_image.width = "100";
            logo_image.height = "90";
            logo_image.className = "align-self-center";
            $(".logo").html(logo_image);
            var principal_sign = new Image();
            principal_sign.src = data.principal_sign;
            principal_sign.width = "100";
            principal_sign.height = "50";
            $('.principal_sign').html(principal_sign);
            $('.principal_text').html("<b>PRINCIPAL SIGNATURE</b>");
            var director_sign = new Image();
            director_sign.src = data.director_sign;
            director_sign.width = "100";
            director_sign.height = "50";
            $('.director_sign').html(director_sign);
            $('.director_text').html("<b>DIRECTOR SIGNATURE</b>");

            //student information
            var a_no = Number(sessionStorage.getItem("admission_invoice"));

            var s_permission = idb.transaction("admission", "readwrite");
            var s_access = s_permission.objectStore("admission");
            var s_check = s_access.get(a_no);
            s_check.onsuccess = function() {
                var school_data = this.result;
                $('.s_name').html(school_data.s_name);
                $('.f_name').html(school_data.f_name);
                $('.class').html(school_data.class);
                $(".invoice-date").html(school_data.invoice[school_data.invoice.length - 1].invoice_date);
                $('.invoice-no').html(school_data.invoice[school_data.invoice.length - 1].invoice_no);
                var school_invoice = school_data.invoice[school_data.invoice.length - 1];
                for (var i = 0; i < school_invoice.course_fee.length; i++) {
                    var amount = document.querySelector(".fee").innerHTML += school_invoice.course_fee[i] + "<hr>";
                    var description = document.querySelector(".description").innerHTML += school_invoice.course_name[i] + "<hr>";
                    var total_amount = Number(school_invoice.course_fee[i]);
                    total += total_amount;
                }
                $(".amount").html(total);
            }
        }

    }
});

$(document).ready(function() {
    $(".print").click(function() {
        window.print();
    });
})