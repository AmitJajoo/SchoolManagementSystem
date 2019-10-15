//brower compatibility
window.indexedDB =
    window.indexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.msIndexedDB;
//brower transition
window.IDBTransaction =
    window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction;

window.IDBKeyRange =
    window.IDBKeyRange ||
    window.webkitIDBKeyRange ||
    window.mozIDBKeyRange ||
    window.msIDBKeyRange;

if (!window.indexedDB) {
    document.write("<h1>PLEASE UPDATE YOUR BROWER</h1>");
} else {
    $(document).ready(function() {
        $("#register-form").submit(function() {
            var check_datbase = window.indexedDB.databases();
            check_datbase.then(function(database_list) {
                if (database_list.length == 0) {
                    register();
                } else {
                    $("#message").removeClass("d-none");
                    $("#message").addClass("alert-warning");
                    $("#message").append(
                        "<b>Registration Failed</b><a href='https://wapinstitute.com'>Please Purchase Multi Version</a> <i class='fa fa-trash ml-4' data-toggle='tooltip' title='To manage another school please delete current school record' id='tooltip' style='cursor:pointer'></i>"
                    );
                    $("#tooltip").tooltip();
                    $("#tooltip").click(function() {
                        $("#modal_confirm").modal();
                        $("#delete-btn").click(function() {
                            var database = window.indexedDB.databases();
                            database.then(function(pending) {
                                var verify_delete = window.indexedDB.deleteDatabase(pending[0].name);
                                verify_delete.onsuccess = function() {
                                    $("#register-form").trigger('reset');
                                    $("#message").addClass('d-none');
                                    $(".delete_message").html('');
                                    $(".delete-success-notice").removeClass("d-none");
                                    setTimeout(() => {
                                        location.reload();

                                    }, 1000);
                                }
                            });
                        });
                    });
                }
            });

            return false;
        });



        function register() {
            var schoolName = $("#school-name").val();
            var tagLine = $("#tag-line").val();
            var email = $("#email-here").val();
            var password = $("#password").val();
            var website = $("#website-here").val();
            var mobileNumber = $("#mobile-number").val();
            var phoneNumber = $("#phone-number").val();
            var address = $("#address").val();

            var database = window.indexedDB.open(schoolName);

            database.onsuccess = function() {
                $("#message").removeClass("d-none");
                $("#message").addClass("alert-success");
                $("#message").append("<b>Success !</b> dear admin please login...");
                $("#register-form").trigger("reset");
                setTimeout(() => {
                    $("#message").addClass("d-none");
                    $("[href='#login']").click();
                }, 2000);
            };

            database.onerror = function() {
                $("#message").removeClass("d-none");
                $("#message").addClass("alert-warning");
                $("#message").append(
                    "<b>Opps !</b> something wrong Contact 7023756844"
                );
            };

            database.onupgradeneeded = function() {
                var data = {
                    schoolName: schoolName,
                    tagLine: tagLine,
                    email: email,
                    password: password,
                    website: website,
                    mobileNumber: mobileNumber,
                    phoneNumber: phoneNumber,
                    address: address,
                    school_logo: " ",
                    director_sign: " ",
                    principal_sign: " "
                };
                var idb = this.result;
                var object = idb.createObjectStore("about_school", {
                    keyPath: "schoolName"
                });
                idb.createObjectStore("fee", {
                    keyPath: "class_name"
                });
                idb.createObjectStore("admission", {
                    keyPath: "adm_no"
                });
                object.add(data);
            };
        }
    });
}

//login
$(document).ready(function() {
    $(".login-form").submit(function() {
        var username = $("#login_username").val();
        var password = $("#login_password").val();
        var json_data = {
            username: username,
            password: password
        };
        var read_json = JSON.stringify(json_data);
        sessionStorage.setItem("login", read_json);
        if (sessionStorage.getItem("login") != null) {
            //find users from database
            var userDatabase = window.indexedDB.databases();
            userDatabase.then(function(pending_obj) {
                var i;
                for (i = 0; i < pending_obj.length; i++) {
                    var databaseName = pending_obj[i].name;
                    sessionStorage.setItem("dbname", databaseName);
                    var database = window.indexedDB.open(databaseName);
                    database.onsuccess = function() {
                        var idb = this.result;
                        var permission = idb.transaction("about_school", "readwrite");
                        var access = permission.objectStore("about_school");
                        var json_data = access.get(databaseName);
                        json_data.onsuccess = function() {
                            var user = this.result;
                            if (user) {
                                var db_username = user.email;
                                var db_password = user.password;
                                var session_data = JSON.parse(sessionStorage.getItem("login"));
                                if (session_data.username == db_username) {
                                    if (session_data.password == db_password) {
                                        window.location = "success/sucess.html";
                                    } else {
                                        $("#message_login").removeClass("d-none");
                                        $("#message_login").addClass("alert-warning");
                                        $("#message_login").append("<b>Wrong Password</b>");
                                        $(".login-form").trigger("reset");
                                        setTimeout(() => {
                                            $("#message_login").addClass("d-none");
                                        }, 2000);
                                    }
                                } else {
                                    $("#message_login").removeClass("d-none");
                                    $("#message_login").addClass("alert-warning");
                                    $("#message_login").append("<b>User not found</b>");
                                    $(".login-form").trigger("reset");
                                    setTimeout(() => {
                                        $("#message_login").addClass("d-none");
                                    }, 2000);
                                }
                            } else {
                                $("#message_login").removeClass("d-none");
                                $("#message_login").addClass("alert-warning");
                                $("#message_login").append("<b>key not found</b>");
                                $(".login-form").trigger("reset");
                                setTimeout(() => {
                                    $("#message_login").addClass("d-none");
                                }, 2000);
                            }
                        };
                    };
                }
            });
        } else {
            $("#message_login").removeClass("d-none");
            $("#message_login").addClass("alert-warning");
            $("#message_login").append("<b>session failed !</b> please try again");
            $(".login-form").trigger("reset");

            setTimeout(() => {
                $("#message_login").addClass("d-none");
            }, 2000);
        }

        return false;
    });
});