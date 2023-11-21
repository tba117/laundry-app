const express = require('express');  //expressの読み込み
const app = express();  //expressを使うための準備
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var router = express.Router();

require('dotenv').config();
const Host = process.env.HOST;
const User = process.env.USER;
const Pass = process.env.PASS;
const Form = process.env.FORM;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.set('view engine', 'ejs');  //htmlプレートエンジンをejsを使用
app.use(express.static('views'));

app.use('/mail',router);

app.get('/', (req,res) => {
    res.render('top.ejs');
});

app.get('/about', (req,res) => {
    res.render('about.ejs');
});

app.get('/disclaimer', (req,res) => {
    res.render('disclaimer.ejs');
});

app.get('/privacy', (req,res) => {
    res.render('privacy.ejs');
});

app.get('/mail', (req, res,next) => {
    res.render('mail.ejs',{
        title:'お問い合わせ'
    });
});

router.post('/',(req,res,next) => {
    var types = req.body.types;
    var name = req.body.name;
    var email = req.body.mail;
    var message = req.body.message;

    var transporter = nodemailer.createTransport(smtpTransport({
        host: Host,
        port: "587",
        tls: true,
        auth:{
            user: User,
            pass: Pass
        }
    }));

    transporter.sendMail({
        from: 'お問い合わせ<' + Form + '>',
        to: Form,
        subject: types,
        text: message + "/" + name + "/" + email,
        html: message + "<br>" + name + "<br>" + email
        },function(err){
            if(err) return next(err);
            console.log("お問い合わせメール送信完了");
            res.redirect('/done');
    })
});

app.get('/done',(req,res) => {
    res.render('contact_done.ejs',{
        tilte:'お問い合わせを受け付けました'
    });
});

module.exports = router;


app.listen(process.env.PORT || 3004, () => {
    console.log('Server is running on port ${PORT}');
});