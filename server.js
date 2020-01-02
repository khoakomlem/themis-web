var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 3000;

//---------------------------------------------------

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'themis'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

//---------------------------------------------------

var md5 = require('md5');

//---------------------------------------------------

app.get('/themis', function(req, res) {
    var express = require('express');
    app.use(express.static(path.join(__dirname, 'themis')));
    res.sendFile(path.join(__dirname, 'themis', 'index.html'));
});

app.get('/login', function(req, res) {
    var express = require('express');
    app.use(express.static(path.join(__dirname, 'login')));
    res.sendFile(path.join(__dirname, 'login', 'index.html'));
});

http.listen(port, () => {
    console.log('Server started on port :*' + port);
})

io.on('connection', socket => {
    socket.on('login', req => {
        let query = "SELECT * FROM `member_dtb` WHERE username = ? AND password = ? LIMIT 1";
        connection.query(query, [req.user, md5(req.pass)], (error, results, fields) => {
            if (error) {
                socket.emit('error', error);
                if (error) console.log(error);
                return;
            }
            if (results.length == 1)
                socket.emit('message', 'Login thành công!!');
            else
                socket.emit('message', 'Sai tài khoản hoặc mật khẩu!?!');
        });
    })

    socket.on('register', req => {
        connection.query("SELECT * FROM `member_dtb` WHERE username = ? LIMIT 1", [req.user], (error, results, fields)=>{

            if (results.length==1){
                socket.emit('message', 'Trùng tên tài khoản trước đây ?!?');
                return; 
            }

        })
        // let query = "INSERT INTO `member_dtb` (`id`, `username`, `password`, `email`) VALUES (NULL, '" + req.user + "', '" + md5(req.pass) + "', '" + req.mail + "')";
        let query = "INSERT INTO `member_dtb` (`id`, `username`, `password`, `email`) VALUES (?, ?, ?, ?)";
        connection.query(query, ['NULL', req.user, md5(req.pass), req.mail], (error, results, fields) => {
            if (error) {
                socket.emit('error', error);
                if (error) console.log(error);
                return;
            }

            socket.emit('message', 'Đăng kí thành công!!');
        });
    })
})