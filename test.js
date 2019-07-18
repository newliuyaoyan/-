const MongoControl = require('./tools/packagDB').MongoControl;
const pages = new MongoControl('test' , 'pages');
const comment = new MongoControl('test' , 'comment');
const moment = require('moment')

// pages.insert({
//     title : '海绵宝宝坑章鱼哥',
//     content : '今天看到章鱼哥吃了不干净的汉堡，是海绵宝宝给的。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。',
//     date : moment().format('YYYY-MM-DD'),
//     intor : '章鱼哥拉肚子了'
// },function(err,data){

// })



comment.find({},function(err,data){
    console.log(data)
})


// comment.remove({},function(err,data){
//     console.log(data)
// })


// pages.find({} , function(err,data){
//     console.log(data)
// })

// pages.remove({} , function(err,data){
//     console.log(data)
// })