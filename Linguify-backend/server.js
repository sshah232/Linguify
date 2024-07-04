// var Express = require("express");
// var Mongoclient = require("mongodb").MongoClient;
// var cors = require("cors");
// const multer = require("multer");

// var app = Express();
// app.use(cors());
// app.use(Express.json()); // Ensure the body parser is included

// var CONNECTION_STRING = "mongodb+srv://admin:BuildspaceS5@cluster0.ubs5hkl.mongodb.net/";
// var DATABASE_NAME = "linguifydb";
// var database;

// app.listen(5038, () => {
//     Mongoclient.connect(CONNECTION_STRING, (error, client) => {
//         database = client.db(DATABASE_NAME);
//         console.log("MongoDB connection successful!");
//     });
// });

// app.get('/api/linguify/GetUser', (request, response) => {
//     database.collection('linguifycollection').find({}).toArray((error, result) => {
//         response.send(result);
//     });
// });

// app.post('/api/linguify/AddUser', multer().none(), (request, response) => {
//     database.collection('linguifycollection').count({}, function(error, numOfDocs) {
//         database.collection("linguifycollection").insertOne({
//             id: (numOfDocs + 1).toString(),
//             topic: request.body.topic,
//             name: request.body.name,
//             surname: request.body.surname,
//             email: request.body.email,
//             phone: request.body.phone,
//             message: request.body.message
//         });
//         response.json("Added Successfully");
//     });
// });

// app.delete('/api/linguify/DeleteUser', (request, response) => {
//     database.collection("linguifycollection").deleteOne({
//         id: request.query.id
//     });
//     response.json("Deleted Successfully");
// });
