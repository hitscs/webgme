/**
 * Created by tamas on 1/9/15.
 */
//these tests intended to ensure that every used feature of mongodb and its used client is work as expected

describe('MONGO',function(){
  var MONGO = require('mongodb'),
    db,collection,collName = 'mongotest___test',
    fsyncDatabase = function(callback) {

      var error = null;
      var synced = 0;

      function fsyncConnection (conn) {
        db.lastError({
          fsync: true
        }, {
          connection: conn
        }, function (err, res) {
          // ignoring the last error, just forcing all commands through
          error = error || err;

          if (++synced === conns.length) {
            callback(error);
          }
        });
      }

      var conns = db.serverConfig.allRawConnections();
      if (conns instanceof Array && conns.length >= 1) {
        for ( var i = 0; i < conns.length; ++i) {
          fsyncConnection(conns[i]);
        }
      } else {
        callback(new Error("not connected"));
      }
    };
  before(function(done){
    console.warn
    MONGO.MongoClient.connect("mongodb://127.0.0.1/mongotest",{
      'w':1,
      'native-parser':true,
      'auto_reconnect': true,
      'poolSize': 20,
      socketOptions: {keepAlive: 1}
    },function(err,d){
      if(!err && d){
        db = d;

        db.collection(collName, function (err, result) {
          if (err) {
            done(err);
          } else {
            collection = result;
            done();
          }
        });
      } else {
        db = null;
        done(err);
      }
    });
  });
  after(function(done){
    db.dropCollection(collName, function (err) {
      db.close(done);
    });
  });
  it('insert some objects and in a parallel insertion uses fsync and checks if really everything is in place',function(done){
    var i,filler="",normalItemCount = 100,error=null,
      finishedAll = function(){
        done(error);
      }
    ;
    for(i=0;i<1000;i++){
      filler+=String.fromCharCode(Math.floor(Math.random()*255));
    }

    for(i=0;i<99;i++){
      collection.insert({data:filler},function(err){
        error = error ||err;
        if(--normalItemCount === 0){
          finishedAll();
        }
      });
    }
    fsyncDatabase(function(err){
      error = error || err;
      collection.insert({data:filler,extra:'should be the last element'},function(err){
        error = error || err;
        if(--normalItemCount !== 0){
          error = new Error('fsync not functioning!!! '+normalItemCount);
        } else {
          finishedAll();
        }
      });
    });
  });
});