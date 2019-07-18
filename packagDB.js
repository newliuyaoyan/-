const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const ObjectId = mongodb.ObjectId;

class MongoControl  {
    constructor(dbName , TableName){
        this.dbName = dbName;
        this.TableName = TableName;
    }
    
    insert (data, callback) {
        MongoClient.connect(url, {useNewUrlParser: true}, (err, client) =>{    //会出现this丢失
            if (err) {
                console.log(err)
            }
            else {
                var db = client.db(this.dbName);
                db.collection(this.TableName).insert(data, function (err, res) {
                    callback(err, res);
                    client.close()
                })
            }
        })
    }
    remove(data, callback){
        MongoClient.connect(url, {useNewUrlParser: true},(err, client) => {    //会出现this丢失
            if (err) {
                console.log(err)
            }
            else {
                var db = client.db(this.dbName);
                db.collection(this.TableName).remove(data, function (err, res) {
                    callback(err, res);
                    client.close()
                })
            }
        })
    }
    find(data,callback){
        MongoClient.connect(url, {useNewUrlParser: true}, (err, client)=> {    //会出现this丢失
            if (err) {
                console.log(err)
            }
            else {
                var db = client.db(this.dbName);
                db.collection(this.TableName).find(data).toArray((err,res)=>{
                    callback(err,res);
                    client.close()
                })
            }
        })
    }
    update (data,changeData,callback){
        MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {    //会出现this丢失
            if (err) {
                console.log(err)
            }
            else {
                var db = client.db(this.dbName);
                db.collection(this.TableName).update(data,{$set : changeData} , function(err,res){
                    callback(err,res)
                    client.close()
                })
            }
        })
    }
}


exports.MongoControl = MongoControl;
