const express=require('express')
const routor=express.Router();
const path=require('path');
const bodyParser = require('body-parser');
const cookieparser=require('cookie-parser')
const urlencoded = bodyParser.urlencoded({extended : false})
const moment = require('moment')
const MongoControl = require('./tools/packagDB').MongoControl;
const pages = new MongoControl('test', 'pages');
const token='ssdasd';
const cookieControl=require('./tools/cookie')
const cookiess=new cookieControl();
const comment=new MongoControl('test','comment')
const mogodb=require('mongodb');
const ObjectId=mogodb.ObjectId;
const ejs = require('ejs');

routor.get('/',function(req,res){
    if(cookiess.checkToken(req.cookies.token)){
    res.sendFile(path.resolve('./static/writepage.html'))
    }
    else{
        res.redirect('/admin/login')
    }
})
routor.post('/submit',urlencoded,function(req,res){
    if(cookiess.checkToken(req.cookies.token)){
        var title=req.body.title;
        var intor=req.body.intor;
        var author=req.body.author;
        var content=req.body.content;
        var now=moment().format('YYYY-MM-DD')
        pages.insert({
            title:title,
            intor:intor,
            author:author,
            content:content,
            date:now
        },function(){
            res.redirect('/');
        })
    }
    else{
       res.redirect('/admin/login')
    }
   
})

routor.get('/login',function(req,res){   
        res.sendFile(path.resolve('./static/login.html'))
  
})

routor.post('/login',urlencoded,function(req,res){
    if(req.body.username=='admin' && req.body.password=='123456')
    {
        res.cookie('token',cookiess.getToken());
        res.redirect('/admin');
        
    }
    else{
        res.status(403).send('用户名密码错误')
    }
})
//删除 修改
routor.get('/remove', function (req, res) {
    if(cookiess.checkToken(req.cookies.token)){
    var id = req.query.id;
    pages.remove({
        _id: ObjectId(id)
    }, function (err, res) {

    })
    comment.remove({
        formId: id
    }, function (err, res) {

    })

    res.redirect("/")
}
else{
    res.redirect('/admin/login')
}
})

routor.get('/change', function (req, res) {
    if(cookiess.checkToken(req.cookies.token)){
        var id = req.query.id;
        pages.find({
            _id: ObjectId(id)
        }, function (err, dataa) {
            var result = dataa[0]
            ejs.renderFile('./ejs/change.ejs', { data: result }, function (err, datas) {

                res.send(datas)
            })
        })
    }
    else{
        res.redirect('/admin/login')
    }
})

routor.post('/changesubmit', urlencoded, function (req, res) {

    var id = req.query.id;
    var title = req.body.title;
    var content = req.body.content;
    var author = req.body.author;
    var intor = req.body.intor;
    console.log(id)
    pages.update({
        _id: ObjectId(id)
    }, {
            title: title,
            content: content,
            author: author,
            intor: intor
        }, function () {
            res.redirect(
                "/"
            )
        })


})


//审核评论
routor.get('/getComment',function(req,res){
   comment.find({
       state:0
   },function(err,result){
       res.send(result)
   })
})

routor.get('/passComment',function(req,res){
    var id=req.query.id;
    comment.update({
        _id:ObjectId(id)
    },{
        state:1
    },function(){
       res.redirect('/')
    })
})
routor.get('/nopassComment',function(req,res){
    var id=req.query.id;
    comment.update({
        _id:ObjectId(id)
    },{
        state:2
    },function(){
        
    })
})
//点赞
routor.get('/zan',function(req,res){
    var id=req.query.id;
    comment.update({
        _id:ObjectId(id)
    },{
        key:1
    },function(){
        
    })
})
routor.get('/nozan',function(req,res){
    var id=req.query.id;
    comment.update({
        _id:ObjectId(id)
    },{
        key:0
    },function(){
        
    })
})

module.exports=routor;
