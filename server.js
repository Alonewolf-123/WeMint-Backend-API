const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

let corsOptions = {
  origin: process.env.FRONT_ORIGIN.split(' ')
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to wemint application." });
});

const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/dataType.routes")(app);
require("./app/routes/attributes.routes")(app);
require("./app/routes/assetBank.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      db.ROLES.forEach(role => {
        new Role({
          name: role
        }).save(err => {
          if (err) {
            console.log("error", err);
          }

          console.log("added '" + role + "' to roles collection");
        });
      });
    }
  });
}
