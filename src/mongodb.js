const {MongoClient, ObjectID} = require('mongodb');

// const id = new ObjectID();
// console.log(id, id.getTimestamp());

const databaseName = 'task-manager';

MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('unable to connect ' + error)
    }

    const db = client.db(databaseName);

    // db.collection('users').insertOne(
    //     {
    //         name: 'Prathesh B',
    //         age: 25
    //     }, (error, result) => {
    //         if(error){
    //             return console.log(error);
    //         }

    //         console.log(result.insertedCount)
    //     }
    // );
    // db.collection('tasks').insertMany([
    //     {
    //         'desc': 'jogging',
    //         'completed': false
    //     },
    //     {
    //         'desc': 'washing clothes',
    //         'completed': true
    //     },
    //     {
    //         'desc': 'Reading',
    //         'completed': false
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('unable to insert documents');
    //     }
    //     console.log(result.insertedCount);
    //     console.log(result.ops);
    // });

    // db.collection('tasks').find({completed : false}).toArray((error, users) => {
    //     console.log(users);
    // });

    // db.collection('tasks').findOne({_id: new ObjectID('5e9accb09fc83e22d09e1e6f')}, (error, user) => {
    //     console.log(user);
    // })

    // db.collection('tasks').updateMany(
    //     { completed: false},
    //     {
    //         '$set' : {
    //             completed: true
    //         }
    //     }
    // ).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(err);
    // });

})