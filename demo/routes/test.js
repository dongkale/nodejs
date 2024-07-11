var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  var mascots = [
    { name: "Sammy", organization: "DigitalOcean", birth_year: 2012 },
    { name: "Tux", organization: "Linux", birth_year: 1996 },
    { name: "Moby Dock", organization: "Docker", birth_year: 2013 },
  ];

  var tagline =
    "No programming concept is complete without a cute animal mascot.";

  res.render("test.ejs", {
    mascots: mascots,
    tagline: tagline,
  });
});

router.get("/api", function (req, res, next) {
  var mascots = [
    { name: "Sammy", organization: "DigitalOcean", birth_year: 2012 },
    { name: "Tux", organization: "Linux", birth_year: 1996 },
    { name: "Moby Dock", organization: "Docker", birth_year: 2013 },
    { name: "Moby Dock2", organization: "Docker2", birth_year: 2014 },
  ];

  res.json(mascots);
});

module.exports = router;
