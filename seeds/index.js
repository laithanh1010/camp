const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");

mongoose
  .connect("mongodb://localhost:27017/camp")
  .then(() => {
    console.log("connection open");
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDb = async () => {
  for (let i = 0; i < 50; i++) {
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${sample(cities).city}, ${sample(cities).state}`,
      images: [
        {
          url: "https://source.unsplash.com/collection/483251",
          filename: "",
        },
        {
          url: "https://source.unsplash.com/collection/483251",
          filename: "",
        },
      ],
      description: "Have a nice day !",
      price: Math.floor(Math.random() * 50),
      author: "61985d46b7d5159c2155a62d",
    });
    await camp.save();
  }
};
const a = async () => {
  await Campground.deleteMany({});
};
a();
seedDb();
