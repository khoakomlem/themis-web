var socket = io();

$(document).ready(function() {

    $('#submit-log').click(function() {
        socket.emit('login', { user: $('#user-log').val(), pass: $('#pass-log').val() });
    })

})

socket.on('message', text => {
    alert(text);
})

$(document).ready(function() {
    var user, pass;
    $("#submit-log").click(function() {
        user = $("#user-log").val();
        pass = $("#pass-log").val();
        $.post("/login", { users: user, passs: pass }, function(data) {
            if (data === 'done') {
                alert("login success");
            }
        });
    });
});