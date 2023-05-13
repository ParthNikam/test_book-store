import express from "express";
import expressLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();


const app = express();
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Mongoose."));


app.set("view engine", "ejs");
app.set("views", "./views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"))
app.use(bodyParser.urlencoded({limit: "10mb", extended: false}));

import indexRoute from "./routes/index.js"
import authorRoute from "./routes/authors.js"


app.use('/', indexRoute);
app.use('/authors', authorRoute);


app.listen(3000, () => {console.log("Server listening on port 3000.")});