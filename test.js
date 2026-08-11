const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://root:YOUR_REAL_PASSWORD@airbnb.phlibpw.mongodb.net/?retryWrites=true&w=majority&appName=airBnb";

async function run() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected successfully");
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

run();