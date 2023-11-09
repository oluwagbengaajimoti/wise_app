const express = require("express");
const cors = require("cors");
const payRoutes = require("./routes/pay");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/", payRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);