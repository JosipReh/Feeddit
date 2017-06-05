$(document).ready(function() {
    $("#register_form").validate({
        rules: {
            username: {
              required: true,
              minlength:5
            },
            password: {
              required: true,
              minlength:5
            }
        },

        messages: {
            username: {required : "Molimo unesite korisničko ime!",
                       minlength: "Minimalna duljina korisničkog imena je 5 znakova"},
            password: {required : "Molimo unesite lozinku!",
                       minlength: "Minimalna duljina lozinke je 5 znakova"}
        },
        submitHandler: function(form) { // <- pass 'form' argument in
            $(".submit").attr("disabled", true);
            form.submit(); //that will make users not able to press subimt button until everything what's defined is entered
        }
    });
});