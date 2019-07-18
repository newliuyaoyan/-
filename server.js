const express = require('express');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser')
const ejs = require('ejs');
const app = express();
const MongoControl = require('./tools/packagDB').MongoControl;
const pages = new MongoControl('test', 'pages');
const comment = new MongoControl('test', 'comment');
const urlencoded = bodyParser.urlencoded({ extended: false })
const moment = require('moment')

app.use(cookieparser());
app.use('/admin', express.static('./static'))
app.use('/admin', require('./admin'))

app.use('/', express.static('./static'))

app.get('/', function (req, res) {
    pages.find({}, function (err, mongoData) {
        ejs.renderFile('./ejs/home.ejs', { data: mongoData }, function (err, result) {
            res.send(result)
        })
    })
})


app.get('/page', function (req, res) {
    var id = req.query.id;
    pages.find({
        _id: ObjectId(id)
    }, function (err, mongoData) {
        var result = mongoData[0];


        comment.find({
            formId: id,
            state: 1
        }, function (err, mongoDate2) {
            
            ejs.renderFile('./ejs/page.ejs', { data: result, comment: mongoDate2 }, function (err, datas) {
            
                res.send(datas)
            })
        })

    })
})


app.post('/commendSubmit', urlencoded, function (req, res) {
    console.log(req.query)
    var id = req.query.id;
    var title = req.query.title;
    var content = req.body.content;
    comment.insert({
        state: 0,
        key:0,
        formId: id,
        content: content,
        date: moment().format('YYYY-MM-DD'),
        title: title
    }, function (err, data) {
        res.redirect(
            "/page?id=" + id
        )
    })
})



app.listen(3008)