$(document).ready(function() {
    $("#login_form").validate({
        rules: {
            username: "required",
            password: "required"
        },

        messages: {
            username: "Molimo unesite korisničko ime!",
            password: "Molimo unesite lozinku!"
        },
        submitHandler: function(form) { // <- pass 'form' argument in
            $(".submit").attr("disabled", true);
            form.submit(); //that will make users not able to press subimt button until everything what's defined is entered
        }
    });
});