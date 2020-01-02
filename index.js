var express = require('express');
var app = require('express')();
app.set('view engine', 'ejs');

var fs = require('fs');
var request = require('request');
var session = require('express-session')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('express-session');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var port = process.env.PORT || 3000;
var md5 = require('md5');
var maso = 0;
var os = require("os");
var mysql = require('mysql');
var chokidar = require('chokidar');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "themis"
});


var
    queue = {},
    maCode = 0,
    noti = {
        start: {},
        end: {}
    };



generateCode = () => {
    return md5(Date.now() + Math.random());
}


http.listen(port, () => {
    connection.connect(err => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Connected to the databse!');
        connection.query("SELECT id FROM `nopbai` ORDER BY `id` DESC LIMIT 1", (error, results, fields) => {
            if (results[0]) {
                maCode = results[0].id;
            }

            console.log(maCode)
        })
    })
    console.log("server started on port: *" + port);


});



app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('express').static(__dirname + '/views'));


app.use('/', (req, res, next) => {

    if (req.session.username == undefined) {
            console.log(2);
        connection.query("SELECT `username` FROM `member_dtb` WHERE `code` = ?", [req.cookies.code], (error, results, fields) => {
            if (results.length == 1) { //Đúng thì tới trang chủ và truyền biến tên
                req.session.username = results[0].username;

                connection.query("SELECT `contest` FROM `member_dtb` WHERE `username` = ?", [results[0].username], (error, results, fields) => {
                    if (results.length == 1) {
                        req.session.contestReg = results[0].contest;
                    }
                    next();
                })

            } else {
                next();
            }
        });
    } else {
            console.log(1);
        connection.query("SELECT `contest` FROM `member_dtb` WHERE `username` = ?", [req.session.username], (error, results, fields) => {
            if (results.length == 1) {
                req.session.contestReg = results[0].contest;
            }
            next();
        })
    }
    // next();
});


app.use('/lambai', (req, res, next) => {
    if (!req.session.username) {
        res.send('<script>alert("Bạn chưa đăng nhập!"); location.assign("../login")</script>');
        return;
    }
    next();
})


app.get('/lambai', (req, res) => {
    if (!req.session.idBai)
        req.session.idBai = req.query.id || ""; //session.idBai là nhớ lại id bài nãy nộp

    connection.query("SELECT * FROM `contest` WHERE `id` = ? LIMIT 1", [req.session.contestReg], (error, results, fields)=>{
        if (results.length == 1 && new Date(Date.now()) > new Date(results[0].time_start)){
            let idcacbai = results[0].idcacbai.split(' ');
            let _idcacbai = {};
            for (var i in idcacbai)
                _idcacbai[idcacbai[i]] = results[0]['debai' + (Number(i) + 1)];
            res.render('lambai', {idcacbai: _idcacbai, id: req.session.idBai, contestReg: req.session.contestReg, cookieCode: req.cookies.cookieCode || "// Your codes goes here" });
        } else {
            res.render('lambai', {idcacbai: null, id: req.session.idBai, contestReg: "", cookieCode: req.cookies.cookieCode || "// Your codes goes here" });
        }
    })

});


app.post('/lambai', (req, res) => {
    maCode++;
    req.session.idBai = req.body.id;
    var code = unescape(req.body.code);
    if (req.body.way != 'file')
        res.cookie('cookieCode', req.body.code);
    console.log(req.body);
    var idClient = maCode + req.session.username + req.body.id;
    var tenfile = `${maCode}[${req.session.username}][${req.body.id}].${req.body.codetype}`;
    let query = "INSERT INTO `nopbai` (`id`, `username`, `status`, `mabai`, `diem`, `idClient`, `thoigiannop`) VALUES (NULL, ?, ?, ?, ?, ?, current_timestamp())";
    connection.query(query, [req.session.username, 0, req.body.id, 0, idClient], (error, results, fields) => {
        // io.emit('nopbai_queue', {username: req.session.username,status: 0,mabai: req.body.id, idClient: idClient, thoigiannop: Date.now()});

        fs.writeFile("chambai/nopbai/" + tenfile, code, function(err) {
            fs.watch("chambai/nopbai/" + tenfile, (eventType, filename) => { // on delete
                if (eventType == "change") {
                    // io.emit('nopbai_cham', {idClient:idClient, status: 1});
                    connection.query("UPDATE `nopbai` SET `status` = 1 WHERE `idClient` = ?", [idClient])
                }
            });
            (chokidar.watch('chambai/nopbai/Logs/' + tenfile + '.log')).on('add', path => { // on create 
                fs.readFile('chambai/nopbai/Logs/' + tenfile + '.log', function(err, data) {
                    fs.unlink('chambai/nopbai/Logs/' + tenfile + '.log', () => {});
                    var test;
                    test = /ℱ (.*)/.exec(data);
                    if (test != null && test[1] == "Dịch lỗi") {
                        // io.emit('nopbai_done', {idClient:idClient, status: 3, diem:0});
                        connection.query("UPDATE `nopbai` SET `status` = ?, `diem` = ? WHERE `idClient` = ?", [3, 0, idClient])
                        return;
                    }
                    test = /: (.*)/.exec(data);
                    if (test != null) {
                        // io.emit('nopbai_done', {idClient:idClient, status: 2, diem:Number(test[1])});
                        connection.query("UPDATE `nopbai` SET `status` = ?, `diem` = ? WHERE `idClient` = ?", [2, Number(test[1]), idClient])
                        return;
                    }
                })
            });
            fs.writeFile("chambai/backup/" + tenfile, code, () => {});

            //end
            if (req.body.way == 'file') {
                res.send({ title: "Nộp bài thành công!!", text: "Bài có mã " + req.body.id, type: "success" });
                return;
            }
            res.redirect('../lambai');
        });
    })


    // connection.query("SELECT * FROM `uutien`", (err, data) => {
    //     maso = ++data[0].ma;
    //     connection.query("UPDATE `uutien` SET `ma` = " + maso);
    //     var code = unescape(req.body.code).replace(/\n/g, os.EOL);
    //     var tenfile = `${maso}[${req.session.username}][${req.body.id}].pas`;
    //     fs.writeFile("chambai/nopbai/" + tenfile, code, function(err) {
    //         fs.readdir("chambai/nopbai/", (err, files) => {
    //             queue[req.session.id] = files.length - 1;
    //             req.session.nopbai = true;
    //             res.redirect('../lambai');
    //         });
    //         fs.watch("chambai/nopbai/" + tenfile, (eventType, filename) => {
    //             queue[req.session.id]--;
    //             io.emit('queue_DESC', filename);
    //         });
    //         fs.writeFile("chambai/backup/" + tenfile, code, () => {});
    //     });

    // });

})


app.get('/', (req, res) => {
    res.redirect('trangchu');
})


app.get('/trangchu', (req, res) => {

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    if (!req.session.username) //Check lại cookie
        res.render('trangchu', { name: "Người lạ?!?", loggedIn: false, contestReg: "", timeNow: Date.now() });
    else {
        // console.log(request.cookies.contestReg);
        res.render('trangchu/index', { name: req.session.username, loggedIn: true, contestReg: req.session.contestReg, timeNow: Date.now() }); //Chuyển hướng tới trang chủ sau khi login bình thường xong
    }
})

app.get('/bangxephang', (req, res) => {
    res.send('Chưa code :v <br> Bấm <a href="../trangchu">vào đây</a> để về trang chủ <br> fb của a khoa đẹp trai <a href="https://www.facebook.com/dangcap2004">tại đây</a>');
})

app.get('/trangchu/logout', (req, res) => {
    connection.query("UPDATE `member_dtb` SET `code` = ? WHERE `username` = ?", [generateCode(), req.session.user]);
    req.session.destroy();
    res.clearCookie('code');
    res.redirect('../');
})


app.post('/trangchu/dangki', (req, res) => {
    // console.log(req.body);
    if (!req.session.username) {
        res.send({ title: "Lỗi", text: 'Bạn phải đăng nhập để đăng kí contest này!', type: 'error' });
        return;
    }
    connection.query("SELECT * FROM `contest` WHERE id = ? LIMIT 1", [req.body.data], (error, results, fields) => {
        console.log(new Date(Date.now()))
        console.log(new Date(results[0].time_end));
        if (new Date(Date.now()) > new Date(results[0].time_start)) {
            res.send({ title: "Lỗi", text: "Contest đã bắt đầu!", type: "warning" });
            return;
        }
        if (new Date(Date.now()) > new Date(results[0].time_end)) {
            res.send({ title: "Lỗi", text: "Contest đã hết hạn!", type: "warning" });
            return;
        }
        // connection.query("SELECT `contest` FROM `member_dtb` WHERE `username` = ? LIMIT 1", [req.session.username], (error, results, fields) => {
            if (/*results[0].contest*/ req.session.contestReg == req.body.data) {
                res.send({ title: "Reject", text: 'Bạn đã đăng kí contest này rồi :)', type: 'error' });
            } else {
                connection.query("UPDATE `member_dtb` SET `contest` = ? WHERE `username` = ?", [req.body.data, req.session.username], (error, results, fields) => {
                    // req.session.contestReg = req.body.data;
                    res.send({ title: "Đăng kí contest thành công!!", text: 'Chúc bạn may mắn làm bài ;)', type: 'success' });
                })
                // connection.query("UPDATE `member_dtb` SET `contest` = ? WHERE `username` = ?", [req.body.data, req.session.username], ()=>{

                // });
            }
        // })
    })

})


app.use('/login', (req, res, next) => {
    if (req.session.username) {
        res.redirect('../trangchu');
        return;
    }
    next();
})


app.get('/login', (req, res) => {
    res.render("login/index", { msg: 'Vui lòng đăng nhập để tiếp tục' });
});


app.post('/login', (req, res) => {
    if (/[^a-zA-Z0-9.]/.test(req.body.username)){
        res.send('username của bạn quá dị');
        return;
    }
    let query = "SELECT * FROM `member_dtb` WHERE username = ? AND password = ? LIMIT 1";
    connection.query(query, [req.body.username, md5(req.body.password)], (error, results, fields) => {

        if (results.length == 1) { // truy vấn thành công => lưu vào session
            req.session.username = req.body.username;
            let code = generateCode();

            if (req.body.remember === "true") { // cung cấp mã code khi tick vào remeber me
                res.cookie('code', code, { maxAge: 1000 * 60 * 60 * 24 * 7 });
            } else { // xoá cookie và thay đổi code trong database để tăng bảo mật || nếu có user khác đăng nhập cùng 1 tài khoản thì phiên đăng nhập kia bị hết hạn
                res.clearCookie("code");
                res.clearCookie("contest");
            }

            connection.query("UPDATE `member_dtb` SET `code` = ? WHERE `username` = ?", [code, req.body.username]);
            res.redirect('../trangchu');
        } else // sai tk mk
            res.render('login/index', { msg: 'Sai tài khoản hoặc mật khẩu ?!?' })
    });
})


app.get('/register', (req, res) => {
    res.render("register/index", { msg: 'Đăng kí thành viên!!' });
});


app.post('/register', (req, res) => {
    if (/[^a-zA-Z0-9.]/.test(req.body.username)){
        res.render("register/index", { msg: 'các kí tự cho phép: a-z, A-Z, 0-9' });
        return;
    }
    connection.query("SELECT * FROM `member_dtb` WHERE username = ? LIMIT 1", [req.body.username], (error, results, fields) => {
        if (results.length == 1) { // khong the dang ki
            res.render("register/index", { msg: 'Trùng tên tài khoản trước đây?!?' });
        } else { // co the dang ki
            let query = "INSERT INTO `member_dtb` (`id`, `username`, `password`, `email`) VALUES (?, ?, ?, ?)";
            connection.query(query, ['NULL', req.body.username, md5(req.body.password), req.body.email], (error, results, fields) => {
                req.session.destroy();
                res.clearCookie('code');
                res.clearCookie('contest');
                res.redirect('../login')
            });
        }
    });
});


setInterval(() => {
    connection.query("SELECT * FROM `contest` ORDER BY time_start DESC LIMIT 10", (err, contest) => {
        for (var i in contest) {
            contest[i].time_start = contest[i].time_start.getTime();
            contest[i].time_end = contest[i].time_end.getTime();
            let a = new Date(Date.now());
            let b = new Date(contest[i].time_start);
            let c = new Date(contest[i].time_end);

            if (!noti['start'][contest[i].id])
                noti['start'][contest[i].id] = 0;
            if (!noti['end'][contest[i].id])
                noti['end'][contest[i].id] = 0;

            if (a >= b && a < c && noti['start'][contest[i].id]++ < 5) {
                io.emit('contest_start', contest[i].id);
            }
            if (a > c && noti['end'][contest[i].id]++ == 0) {
                io.emit('contest_end', contest[i].id);
                connection.query("UPDATE `member_dtb` SET `contest`='' WHERE `contest` = ?", [contest[i].id]);
            }
        }
        io.emit('update', contest, Date.now());
    })
}, 2000);

setInterval(() => {
    connection.query("SELECT * FROM `nopbai` ORDER BY `id` DESC LIMIT 10", (error, results, fields) => {
        io.emit('nopbai_table', results);
        // console.log(typeof(results))
    })
}, 1000);

// io.on('connection', socket=>{
//         socket.on('onload', ()=>{
//                 connection.query("SELECT * FROM `nopbai` ORDER BY `id` DESC LIMIT 10", (error, results, fields)=>{
//                         socket.emit('nopbai_table', results);
//                 })
//         })
// })