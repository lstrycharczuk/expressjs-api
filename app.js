const express = require('express')
require("dotenv").config();

const bodyParser = require("body-parser");

const connectToDatabase = () => {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_DB);
}
connectToDatabase();

const port = process.env.PORT || 3000;
const generateNameRouter = require("./random-name");
const tasksRouter = require("./models/todos");

const app = express();


app.use(bodyParser.json());
app.use("/", generateNameRouter);
app.use("/", tasksRouter);

app.get("/", (req, resp) => {
  resp.json({ message: "hi, go to /random-name to get a random name!" });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
