const mongoose = require("mongoose");
async function main() {
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

main().catch((err) => console.log(err));

module.exports = mongoose;
