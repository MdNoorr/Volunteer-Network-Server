const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjved.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World! Noor Muhammad");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
	const Collection = client.db("network").collection("product");
	const NumCollection = client.db("network").collection("number");

  console.log("Data Base Connected");
  // const product = {name : "Noor", price : 34}
  // Collection.insertOne(product)
  //   .then(result => {
  //     console.log(result)
  //   })

  //     console.log(process.env.DB_PASS)

  app.post("/addBaseData", (req, res) => {
    const baseData = req.body;
    Collection.insertMany(baseData).then((result) => {
      console.log(result);
      console.log(result.insertedCount, "All Data Inserted");
      res.send(result.insertedCount);
    });
  });

  app.get("/home", (req, res) => {
    Collection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

    app.post("/registerVolunteer", (req, res) => {
  		const newVolunteer = req.body;
  		NumCollection.insertOne(newVolunteer).then((result) => {
  			console.log(result, "Task Inserted");
  			res.send(result.insertedCount > 0);
  		});
    });

    app.get("/events", (req, res) => {
  		console.log(req.query.email);
  		NumCollection.find({ }).toArray((error, documents) => {
  			res.send(documents);
  			console.log(error);
  		});
  	});

  	app.delete("/deleteTask/:id", (req, res) => {
  		console.log(req.params.id);
  		NumCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
  			console.log(result, "Deleted");
  			res.send(result.deletedCount > 0);
  		});
    });

    app.post("/admin/addEvent", (req, res) => {
  		const newTask = req.body;
  		Collection.insertOne(newTask).then((result) => {
  			console.log(result, "Task Inserted");
  			res.send(result.insertedCount > 0);
  		});
    });

    app.get("/loadVolunteerList", (req, res) => {
  		NumCollection.find({}).toArray((err, docs) => {
  			res.send(docs);
  			console.log(docs);
  		});
  	});

  	app.delete("/admin/deleteTask/:id", (req, res) => {
  		console.log(req.params.id);
  		NumCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
  			console.log(result, "Task deleted");
  			res.send(result.deletedCount > 0);
  		});
  	});
});

app.listen(process.env.PORT || port);
// app.listen(port)
// app.listen(port, () => {
// 	console.log(`Example app listening at http://localhost:${port}`)
//   })
