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
//add field
$(document).ready(function() {
    $(".add-btn-field").click(function() {
        var add_element =
            '<div class="input-group mb-4"><input type = "text" name = "course-name" placeholder = "Tuition fee" class = "form-control course_name" ><input type = "text" name = "course-fee" placeholder = "Rs. 500" class = "form-control course_fee" ><div class = "input-group-append border-left-0" ><span class = "input-group-text bg-warning border-left-0 monthy"> Monthly </span> </div> </div>';
        $(".add-btn-area").append(add_element);
    });
});

//set data in indexDB
$(document).ready(function() {
    $(".set-btn-fee").click(function() {
        var class_name = $(".class_name").val();
        var course_fee = [];
        var course_name = [];
        var i;
        $(".course_fee").each(function(i) {
            course_fee[i] = $(this).val();
        });
        $(".course_name").each(function(i) {
            course_name[i] = $(this).val();
        });
        var fee_object = {
            class_name: class_name,
            course_name: course_name,
            course_fee: course_fee
        };
        //store data in database
        var dbname = sessionStorage.getItem("dbname");
        var database = window.indexedDB.open(dbname);
        database.onsuccess = function() {
            var idb = this.result;
            var permission = idb.transaction("fee", "readwrite");
            var access = permission.objectStore("fee");
            var fee_object_store = access.put(fee_object);
            fee_object_store.onsuccess = function() {
                location.reload();
            };
            fee_object_store.onerror = function() {
                alert("error");
            };
        };
    });
});

//opening of modal and adding class name and information
$(document).ready(function() {
    $("#fee-menu").click(function() {
        $("#modal-fee").modal();
        $("#show-fee").html("");
        var db_name = sessionStorage.getItem("dbname");
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function() {
            var idb = this.result;
            var premission = idb.transaction("fee", "readwrite");
            var access = premission.objectStore("fee");
            var get_all_key = access.getAllKeys();
            get_all_key.onsuccess = function() {
                var key = this.result;
                var i, j;
                for (i = 0; i < key.length; i++) {
                    var key_data = access.get(key[i]);
                    key_data.onsuccess = function() {
                        var fee = this.result;
                        var show_fee = document.getElementById("show-fee");
                        var ul = document.createElement("UL");
                        ul.className = "nav nav-tabs";
                        var li = document.createElement("LI");
                        li.className = "nav-item";
                        var a = document.createElement("A");
                        a.className = "nav-link active";
                        a.href = "#";
                        a.innerHTML = "Class - " + fee.class_name;
                        li.append(a);
                        ul.append(li);
                        show_fee.append(ul);
                        var table = document.createElement("TABLE");
                        table.className =
                            "table text-center border-left border-right border-bottom";
                        var td = document.createElement("TD");

                        var tr_for_th = document.createElement("TR");
                        var tr_for_td = document.createElement("TR");
                        for (j = 0; j < fee.course_name.length; j++) {
                            var th = document.createElement("TH");
                            th.innerHTML = fee.course_name[j];
                            tr_for_th.append(th);
                            th.className = "border-0";
                        }
                        var th_edit = document.createElement("TH");
                        th_edit.innerHTML = "Edit";
                        tr_for_th.append(th_edit);
                        th_edit.className = "border-0";

                        var th_delete = document.createElement("TH");
                        th_delete.innerHTML = "Delete";
                        tr_for_th.append(th_delete);
                        th_delete.className = "border-0";

                        for (j = 0; j < fee.course_fee.length; j++) {
                            var td = document.createElement("TD");
                            td.innerHTML = fee.course_fee[j];
                            tr_for_td.append(td);
                            td.className = "border-0";
                        }
                        //edit fee
                        var tr_edit = document.createElement("TH");
                        tr_edit.innerHTML = '<i class="fa fa-edit"></i>';
                        tr_for_td.append(tr_edit);
                        tr_edit.className = "border-0";

                        tr_edit.onclick = function() {
                            var table = this.parentElement.parentElement;
                            var ul = table.previousSibling;
                            var a = ul.getElementsByTagName("A");
                            var class_name = a[0].innerHTML.split(" ");
                            $(".class_name").val(class_name[2]);
                            var tr = table.getElementsByTagName("TR");
                            var th = tr[0].getElementsByTagName("TH");
                            var td = tr[1].getElementsByTagName("TD");
                            var i;
                            var course_name = document.getElementsByClassName("course_name");
                            course_name[0].remove();
                            var course_fee = document.getElementsByClassName("course_fee");
                            course_fee[0].remove();
                            var monthy = document.getElementsByClassName("monthy");
                            monthy[0].remove();
                            $(".add-button").remove();
                            for (i = 0; i < th.length - 2; i++) {
                                $(".add-btn-field").click();
                                course_name[i].value = th[i].innerHTML;
                                course_fee[i].value = td[i].innerHTML;
                            }
                            $(".set-fee").addClass("animated shake");
                        };

                        //fee delete
                        var tr_delete = document.createElement("TH");
                        tr_delete.innerHTML = '<i class="fa fa-trash"></i>';
                        tr_for_td.append(tr_delete);
                        tr_delete.className = "border-0";

                        tr_delete.onclick = function() {
                            var ul = this.parentElement.parentElement.previousSibling;
                            var a = ul.getElementsByTagName("A");
                            var key_name_with_num = a[0].innerHTML;
                            var key_name = key_name_with_num.split(" ");
                            var db_name = sessionStorage.getItem("dbname");
                            var database = window.indexedDB.open(db_name);
                            database.onsuccess = function() {
                                var idb = this.result;
                                var permission = idb.transaction("fee", "readwrite");
                                var access = permission.objectStore("fee");
                                var delete_notice = access.delete(key_name[2]);
                                delete_notice.onsuccess = function() {
                                    alert("success");
                                    tr_delete.parentElement.parentElement.previousSibling.remove();
                                    tr_delete.parentElement.parentElement.remove();
                                };
                            };
                        };

                        table.append(tr_for_th);
                        table.append(tr_for_td);
                        show_fee.append(table);
                    };
                }
            };
        };
    });
});

//retrive Class name
$(document).ready(function() {
    var db_name = sessionStorage.getItem("dbname");
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function() {
        var idb = this.result;
        var premission = idb.transaction("fee", "readwrite");
        var access = premission.objectStore("fee");
        var key_name = access.getAllKeys();
        key_name.onsuccess = function() {
            var keys = this.result;
            var i;
            for (i = 0; i < keys.length; i++) {
                var option = document.createElement("OPTION");
                option.innerHTML = keys[i];
                $(".class").append(option);
            }
            for (i = 0; i < keys.length; i++) {
                var option = document.createElement("OPTION");
                option.innerHTML = keys[i];
                $(".find-student").append(option);
            }
        };
    };
});

//upload student pic and preview pic
$(document).ready(function() {
    $("#upload-pic-user").on("change", function() {
        var file = this.files[0];
        var url = URL.createObjectURL(file);
        $("#show-pic").attr("src", url);
        alert(url);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            sessionStorage.setItem("upload-pic", this.result);
        };
    });
});

//admission number
function adm_no() {
    var max_no = 0;
    var dbname = sessionStorage.getItem("dbname");
    var databases = window.indexedDB.open(dbname);
    databases.onsuccess = function() {
        var idb = this.result;
        var permission = idb.transaction("admission", "readwrite");
        var access = permission.objectStore("admission");
        var check_data = access.getAllKeys();
        check_data.onsuccess = function() {
            var keys_array = this.result;
            var i;
            for (i = 0; i < keys_array.length; i++) {
                if (keys_array[i] > max_no) {
                    max_no = keys_array[i];
                }
            }
            var increase = max_no + 1;
            sessionStorage.setItem("admission_no", max_no);
            $(".admission_no").html("A/No.-> " + increase);
        };
    };
}

//admission
$(document).ready(function() {
    $(".admit-btn").click(function() {
        var a_no, i, max = 0;
        var db_name = sessionStorage.getItem("dbname");
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function() {
            var idb = this.result;
            var premission = idb.transaction("admission", "readwrite");
            var access = premission.objectStore("admission");
            var key_name = access.getAllKeys();
            key_name.onsuccess = function() {
                var keys = this.result;
                if (keys.length == 0) {
                    a_no = 1;
                } else {
                    for (i = 0; i < keys.length; i++) {
                        var number = Number(keys[i]);
                        if (number > max) {
                            max = number;
                        }
                    }
                    a_no = max + 1;
                }
                if (sessionStorage.getItem("upload-pic") != null) {
                    var date = new Date($(".dob").val());
                    var dob_day = date.getDate();
                    var dob_month = date.getMonth() + 1;
                    var dob_year = date.getFullYear();
                    var dob = dob_day + "/" + dob_month + "/" + dob_year;


                    var current = new Date();
                    var current_dates = current.getDate();
                    var current_month = current.getMonth() + 1;
                    var current_year = current.getFullYear();
                    var current =
                        current_dates + "/" + current_month + "/" + current_year;


                    var admission = {
                        adm_no: a_no,
                        s_name: $(".s-name").val(),
                        f_name: $(".f-name").val(),
                        m_name: $(".m-name").val(),
                        dob: dob,
                        gender: $(".gender").val(),
                        mobile_one: $(".mobile-one").val(),
                        mobile_two: $(".mobile-two").val(),
                        admit_in: $(".admit-in").val(),
                        address: $(".address").val(),
                        c_date: current,
                        upload_pic: sessionStorage.getItem("upload-pic"),
                        invoice: [],
                        class: $('.class').val()
                    };
                    sessionStorage.removeItem("upload-pic");
                    var dbname = sessionStorage.getItem("dbname");
                    var database = window.indexedDB.open(dbname);
                    database.onsuccess = function() {
                        var idb = this.result;
                        var permission = idb.transaction("admission", "readwrite");
                        var access = permission.objectStore("admission");
                        var check_admission = access.add(admission);

                        check_admission.onsuccess = function() {
                            var alert =
                                "<div class='alert alert-success alert-dismissible fade show'>Admission Success ..<a href='admission_slip.html'>Get Admission Document</a><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
                            $(".admit-notice").html(alert);
                            adm_no();
                        };
                        check_admission.onerror = function() {
                            var alert =
                                "<div class='alert alert-warning alert-dismissible fade show'>Error !<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
                            $(".admit-notice").html(alert);
                        };
                    };
                } else {
                    alert("Upload Student Photo");
                }
            }
        }
    });
});

// retrive school name and tag line for left box
$(document).ready(function() {
    var dbname = sessionStorage.getItem("dbname");
    var database = window.indexedDB.open(dbname);
    database.onsuccess = function() {
        var idb = this.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var tag_line = access.get(dbname);
        tag_line.onsuccess = function() {
            var school_tag_line = this.result;
            $(".school-name").html(school_tag_line.schoolName);
            $(".school-name").css("textTransform", "uppercase");
            $(".tag-line").html(school_tag_line.tagLine);
        };
    };
});

adm_no();

//show director signature and logo
$(document).ready(function() {
    var dbname = sessionStorage.getItem("dbname");
    var database = window.indexedDB.open(dbname);
    database.onsuccess = function() {
        var idb = this.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check = access.get(dbname);
        check.onsuccess = function() {
            var data = this.result;
            if (data.director_sign == " ") {
                $(".d-sign-input").removeClass("d-none");
            } else {
                $(".d-sign-con").removeClass("d-none");
                var signature = data.director_sign;
                var image = new Image();
                image.src = signature;
                image.width = "150";
                image.height = "30";
                $(".d-sign").html(image);
            }
        };
    };
});

//upload director sign
$(document).ready(function() {
    $("#director").on("change", function() {
        var reader = new FileReader();
        var file = this.files[0];
        reader.readAsDataURL(file);
        reader.onload = function() {
            var sign = this.result;
            var dbname = sessionStorage.getItem("dbname");
            var database = window.indexedDB.open(dbname);
            database.onsuccess = function() {
                var idb = this.result;
                var permission = idb.transaction("about_school", "readwrite");
                var access = permission.objectStore("about_school");
                var check_data = access.get(dbname);
                check_data.onsuccess = function() {
                    var data = this.result;
                    data.director_sign = sign;
                    var update = access.put(data);
                    update.onsuccess = function() {
                        window.location = location.href;
                    };
                    update.onerror = function() {
                        alert("Update Failed");
                    };
                };
            };
        };
    });
});

//delete director sign
$(document).ready(function() {
    $(".delete-icon").on("click", function() {
        var dbname = sessionStorage.getItem("dbname");
        var database = window.indexedDB.open(dbname);
        database.onsuccess = function() {
            var idb = this.result;
            var permission = idb.transaction("about_school", "readwrite");
            var access = permission.objectStore("about_school");
            var check_data = access.get(dbname);
            check_data.onsuccess = function() {
                var data = this.result;
                data.director_sign = " ";
                var update = access.put(data);
                update.onsuccess = function() {
                    window.location = location.href;
                };
                update.onerror = function() {
                    alert("Update Failed");
                };
            };
        };
    });
});

//show principal signature and logo
$(document).ready(function() {
    var dbname = sessionStorage.getItem("dbname");
    var database = window.indexedDB.open(dbname);
    database.onsuccess = function() {
        var idb = this.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check = access.get(dbname);
        check.onsuccess = function() {
            var data = this.result;
            if (data.principal_sign == " ") {
                $(".p-sign-input").removeClass("d-none");
            } else {
                $(".p-sign-con").removeClass("d-none");
                var signature = data.principal_sign;
                var image = new Image();
                image.src = signature;
                image.width = "150";
                image.height = "30";
                $(".p-sign").html(image);
            }
        };
    };
});

//upload principal sign
$(document).ready(function() {
    $("#principal").on("change", function() {
        var reader = new FileReader();
        var file = this.files[0];
        reader.readAsDataURL(file);
        reader.onload = function() {
            var sign = this.result;
            var dbname = sessionStorage.getItem("dbname");
            var database = window.indexedDB.open(dbname);
            database.onsuccess = function() {
                var idb = this.result;
                var permission = idb.transaction("about_school", "readwrite");
                var access = permission.objectStore("about_school");
                var check_data = access.get(dbname);
                check_data.onsuccess = function() {
                    var data = this.result;
                    data.principal_sign = sign;
                    var update = access.put(data);
                    update.onsuccess = function() {
                        window.location = location.href;
                    };
                    update.onerror = function() {
                        alert("Update Failed");
                    };
                };
            };
        };
    });
});

//delete principal sign
$(document).ready(function() {
    $(".delete-icon-p").on("click", function() {
        var dbname = sessionStorage.getItem("dbname");
        var database = window.indexedDB.open(dbname);
        database.onsuccess = function() {
            var idb = this.result;
            var permission = idb.transaction("about_school", "readwrite");
            var access = permission.objectStore("about_school");
            var check_data = access.get(dbname);
            check_data.onsuccess = function() {
                var data = this.result;
                data.principal_sign = " ";
                var update = access.put(data);
                update.onsuccess = function() {
                    window.location = location.href;
                };
                update.onerror = function() {
                    alert("Update Failed");
                };
            };
        };
    });
});

//school logo
$(document).ready(function() {
    $(".school-input").on("change", function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            var logo = this.result;
            var dbname = sessionStorage.getItem("dbname");
            var database = window.indexedDB.open(dbname);
            database.onsuccess = function() {
                var idb = this.result;
                var permission = idb.transaction("about_school", "readwrite");
                var access = permission.objectStore("about_school");
                var check_data = access.get(dbname);
                check_data.onsuccess = function() {
                    var data = this.result;
                    data.school_logo = logo;
                    var update = access.put(data);
                    update.onsuccess = function() {
                        window.location = location.href;
                    };
                    update.onerror = function() {
                        alert("Some error occur");
                    };
                };
            };
        };
    });
});

//showing school logo
$(document).ready(function() {
    var dbname = sessionStorage.getItem("dbname");
    var database = window.indexedDB.open(dbname);
    database.onsuccess = function() {
        var idb = this.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check = access.get(dbname);
        check.onsuccess = function() {
            var data = this.result;
            if (data.school_logo != " ") {
                var logo = data.school_logo;
                var image = new Image();
                image.src = logo;
                image.width = "110";
                image.height = "100";
                $("#show-pic-logo").html(image);
            }
        };
    };
});

//invoice coding
$(document).ready(function() {
    $(".invoice-btn").click(function() {
        var a_no = Number($('.admission-no').val());
        sessionStorage.setItem("admission_invoice", a_no);


        var date = new Date($('.invoice-date').val());
        var invoice_day = date.getDate();
        var invoice_month = date.getMonth() + 1;
        var invoice_year = date.getFullYear();
        var invoice_date = invoice_day + "/" + invoice_month + "/" + invoice_year;

        var dbname = sessionStorage.getItem("dbname");
        var database = window.indexedDB.open(dbname);
        database.onsuccess = function() {
            var idb = this.result;
            var permission = idb.transaction("admission", "readwrite");
            var access = permission.objectStore("admission");
            var check = access.get(a_no);
            check.onsuccess = function() {
                var data = this.result;
                if (data) {
                    var class_name = data.class;
                    var fee_permission = idb.transaction("fee", "readwrite");
                    var fee_access = fee_permission.objectStore("fee");
                    var check_fee = fee_access.get(class_name);
                    check_fee.onsuccess = function() {
                        var fee_data = this.result;
                        if (fee_data) {
                            var invoice_no;
                            if (data.invoice.length == 0) {
                                invoice_no = 1;
                            } else {
                                invoice_no = data.invoice.length + 1;
                            }


                            var invoice_data = {
                                invoice_no: invoice_no,
                                invoice_date: invoice_date,
                                course_name: fee_data.course_name,
                                course_fee: fee_data.course_fee
                            }
                            var update_permission = idb.transaction("admission", "readwrite");
                            var update_access = update_permission.objectStore("admission");
                            var update_check_data = update_access.get(a_no);
                            update_check_data.onsuccess = function() {
                                var update_object = this.result;
                                update_object.invoice.push(invoice_data);
                                var update = update_access.put(update_object);
                                update.onsuccess = function() {
                                    window.location = "invoice.html";
                                }
                                update_access.onerror = function() {
                                    alert("invoice failed");
                                }
                            }
                        } else {
                            alert("fee not found pls set the fee");
                        }
                    }

                } else {
                    alert("student not found");
                }
            }
        }
    });
});

//find student
$(document).ready(function() {
    $('.find-student').on('change', function() {
        sessionStorage.setItem("student_class", this.value);
        window.location = "student.html";
    });
});