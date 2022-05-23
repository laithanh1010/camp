if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");

const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");
const User = require("./models/user");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const MongoDBStore = require("connect-mongo")(session);

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/camp";
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("connection open");
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const store = new MongoDBStore({
  url: dbUrl,
  secret: "thisshouldbeabettersecret",
  touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
  console.log("session store error", e);
});
const sessionConfig = {
  store,
  name: "session",
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});
app.use("/users", usersRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { message = "Something went wrong", status = 500 } = err;

  res.status(status).render("error", { message });
});
app.listen(3000, () => {
  console.log("Running at port 3000");
});

// them 1 campgrond- > post : /campgrounds -> new
// add 1 reviews -> post: /campgrounds/:id/reviews

// khi mk dang nhap thanh cong -> luu no lai 1 bien la cai gi = true dung khong
// vi no la bien moi khi reff
// khong dung cai nay
// khi dang nhap thanh cong -> add vao LocalStorage
// cho dau tien => minh luon goi cai getStorage

// hien thi get
// them moi la: post
