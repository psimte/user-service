require("dotenv").config();
const mongoose = require("mongoose");

//const uri = `mongodb+srv://tga-foodapp:${process.env.DB_PASS}@cluster0.dfw0mzj.mongodb.net/${process.env.DB_COLL}?retryWrites=true&w=majority`;

const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/users`;

const dbConnection = async () => {
  await mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    async (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(
          `Connected to 'user-service' Database in port ${process.env.PORT}`
        );
      }
    }
  );
};

module.exports = dbConnection;
