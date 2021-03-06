const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registered = await User.register(user, password);
    console.log(registered);
    req.login(registered, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Camp");
      res.redirect("/campgrounds");
    });
    req.flash("success", "Welcome to Camp");
    res.redirect("/campgrounds");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/users/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logOut();
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
};
