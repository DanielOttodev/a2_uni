const AWS = require("aws-sdk");
const { time } = require("console");
const res = require("express/lib/response");
const REGION = "ap-southeast-2";
const fs = require("fs");
const https = require("https");
const ddb = require("../db");
const db = ddb.ddbClient;
const s3 = new AWS.S3();

exports.getImages = async (req, res) => {
  const mydata = await getUrls();
  let urls = mydata.Items;
  for (i = 0; i < urls.length; i++) {
    await saveImage(urls[i]);
  }
  res.send("Images Uploaded to S3 Bucket").status(200);
};

function getUrls() {
  return db.scan({
    TableName: "music",
    ProjectionExpression: "img_url",
  });
}

async function saveImage(element) {
  console.log("Hit Route");
  new Promise((resolve, reject) => {
    if (res.statusCode === 200) {
      https.get(element.img_url.S, (res) => {
        res
          .pipe(
            fs.createWriteStream(
              element.img_url.S.split("/")[
                element.img_url.S.split("/").length - 1
              ]
            )
          )
          .on("error", function () {
            reject("error");
          })
          .once("close", function () {
            console.log("File saved to tmp");
            const file = fs.readFileSync("./tmp.jpg");
            console.log(file);
            let len = element.img_url.S.split("/").length;
            const params = {
              Bucket: "a2-uni",
              Key: element.img_url.S.split("/")[len - 1],
              Body: file,
            };
            s3.upload(params, (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log(resolve(data));
                // console.log("finished upload");
              }
            });
          });
      });
    } else {
      res.resume();
      reject(new Error(`Failed request : ${res.statusCode}`));
    }
  }).then(console.log);
}
