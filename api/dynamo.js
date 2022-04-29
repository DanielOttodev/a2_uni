const AWS = require("aws-sdk");
const REGION = "ap-southeast-2";
const seedData = require("../a2.json");
const ddbImp = require("../db.js");
const ddb = ddbImp.ddbClient;
AWS.config.update({ region: REGION });
const ddbDoc = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

exports.createTable = (req, res) => {
  // Create the DynamoDB service object

  var params = {
    AttributeDefinitions: [
      {
        AttributeName: "title",
        AttributeType: "S",
      },
      {
        AttributeName: "artist",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "title",
        KeyType: "HASH",
      },
      {
        AttributeName: "artist",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: "music",
    StreamSpecification: {
      StreamEnabled: false,
    },
  };

  // Call DynamoDB to create the table
  ddb.createTable(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table Created", data);
      res.send("Success, created table");
    }
  });
};

exports.delSong = (req, res) => {
  console.log(req.body);
  let upd = { BOOL: false };
  var params = {
    TableName: "music",
    Key: {
      title: { S: req.body.title },
      artist: { S: req.body.artist },
    },
    UpdateExpression: "set subscribed = :r",
    ExpressionAttributeValues: {
      ":r": upd,
    },
    //ProjectionExpression: req.body.email,
  };

  // Call DynamoDB to read the item from the table
  ddb.updateItem(params, function (err, data) {
    if (err) {
      console.log(err);
      res.send(err).status(500);
    } else {
      console.log("Success", data);
      res.send("true").status(200);
    }
  });
};
exports.addSong = (req, res) => {
  console.log(req.body);
  let upd = { BOOL: true };
  var params = {
    TableName: "music",
    Key: {
      title: { S: req.body.title },
      artist: { S: req.body.artist },
    },
    UpdateExpression: "set subscribed = :r",
    ExpressionAttributeValues: {
      ":r": upd,
    },
    //ProjectionExpression: req.body.email,
  };

  // Call DynamoDB to read the item from the table
  ddb.updateItem(params, function (err, data) {
    if (err) {
      console.log(err);
      res.send(err).status(500);
    } else {
      console.log("Updated Item");
      console.log("Success", data);
      res.send("true").status(200);
    }
  });
};

exports.getSongs = (req, res) => {
  console.log(req.method);
  let params;
  if (
    req.method === "POST" &&
    req.body != null &&
    Object.keys(req.body).length > 0
  ) {
    console.log(req.body);

    params = {
      TableName: "music",
      ExpressionAttributeValues: {
        ":s": { S: req.body.subscribed },
      },
      FilterExpression: "contains (year, :y) AND contains (artist, :a)",
    };
  } else {
    console.log("GET: /getSongs");
    params = {
      TableName: "music",
      // ProjectionExpression: "email",
    };
  }

  ddb.scan(params, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err).status(500);
    } else {
      // console.log(data.Items);
      res.send(data.Items).status(200);
    }
  });
};

exports.seedItems = (req, res) => {
  const songs = seedData.songs;
  let subbed = { subscribed: false };
  try {
    songs.forEach((element) => {
      element = Object.assign(element, subbed);
      let params = {
        TableName: "music",
        Item: element,
      };
      console.log("Start Write");
      ddbDoc.put(params, function (err, data) {
        console.log("Putting");
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
    });

    res.send("Success").status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};
