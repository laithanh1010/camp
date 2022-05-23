const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const {
  index,
  createCampground,
  renderNewForm,
  showCamground,
  renderEditForm,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds");

const { storage } = require("../cloudinary/index");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(createCampground)
  );
// .post(upload.array("image"), (req, res) => {
//   res.send(req.body, req.file);
// });

router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(catchAsync(showCamground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm));

module.exports = router;
