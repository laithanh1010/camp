const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp.reviews.length) {
    const res = await Review.deleteMany({
      _id: {
        $in: camp.reviews,
      },
    });
    console.log(res);
  }
});

const Campground = mongoose.model("campground", CampgroundSchema);
module.exports = Campground;
