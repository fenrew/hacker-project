var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Crime = require("../models/Crime")
const Alliance = require("../models/Alliance")
const Item = require("../models/Item")
const uploadCloud = require('../utils/cloudinary.js');

/* GET all routes. */
router.get("/index", (req, res, next) => {
  res.render("index", { title: "Express" });
});
// npm install ensureLogin see 
//atm ensureAuthenticated is not doing anything
router.get("/create-hacker", ensureAuthenticated, (req, res, next) => { // ensure user is logged in
  res.render("create-hacker", { title: "Express" });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/sign-in')
  }
}

router.post("/create-hacker", uploadCloud.single("photo"), (req, res, next) => {
  const { title, description } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;

  console.log('req user consolelog',req.user)
  //User.findById /// add { title, description, imgPath, imgName });
  User.findByIdAndUpdate(req.user._id, { title, description, imgPath, imgName }).then((result) => {
    console.log(result);
    res.render('index')
  })

  // const newUser = new User({ title, description, imgPath, imgName });
  // newUser
  //   .save()
  //   .then(user => {
  //     res.redirect("/");
  //   })
    .catch(error => {
      console.log(error);
      res.redirect('error');
    });
});

router.get("/", (req, res, next) => {
  res.render("menu/home");
});

router.get("/home", (req, res, next) => {
  res.render("menu/home");
});

router.get("/hack/crimes", (req, res, next) => {
  // TODO list all crimes with link to GET /hack/crimes/:id
  res.render("menu/hack-crimes");
});

router.get("/hack/crimes/:id", (req, res, next) => {
  let userIdThing = User.findById(req.user._id)
  let crimeIdThing = Crime.findById(req.params.id)

  Promise.all([userIdThing, crimeIdThing]).then((result) => {
    let player = result[0];
    let crimeToCommit = result[1];
    let resultCrime = player.fightCrime(crimeToCommit);
    console.log(resultCrime); 
  })
});

  // Crime.findById(req.params.id).then(result => {
  //   crimeToCommit = result;
  //   res.render("menu/hack-crimes-id", {
  //     result: JSON.stringify(crimeToCommit)
  //   });
  // });

// TODO get the user from req.user
// get the crime from db
// do the actual fight: let result = fight()
// render the result page with the result

//   res.render("menu/hack-crimes", {
//     result: JSON.stringify({ rounds: [{dodged: true}], won: true})
//   })
// })

router.get("/hack/hack-player", (req, res, next) => {
  User.find({}).then((user) => {
    res.render("menu/hack-player", {user});
  })
});

router.get("/hack/hack-player/:id", (req, res, next) => {
  let newReq = req.params.id.slice(1)
  let userIdThing = User.findById(req.user._id)
  let opponentIdThing = User.findById(newReq)

  Promise.all([userIdThing, opponentIdThing]).then((result) => {
   // let resultHack = result[0].hackPlayer(result[1]);
    res.render("menu/hack-player-id", {result: JSON.stringify(resultHack)})
  })
});

router.get("/hack/wanted-list", (req, res, next) => {
  User.find({})
    .then(user => {
      res.render("menu/hack-wanted-list", { user });
    })
    .catch(console.error);
});

router.get("/alliance/forum", (req, res, next) => {
  res.render("menu/alliance-forum");
});

router.get("/alliance/group-kill", (req, res, next) => {
  res.render("menu/alliance-group-kill");
});

router.get("/alliance/hideout", (req, res, next) => {
  res.render("menu/alliance-hideout");
});

router.get("/marketplace", (req,res, next) => {
  Item.find()
  .then(items => {
    res.render("menu/marketplace", { 
      items,
      cpuItems: items.filter(i => i.type === "cpu"),
      firewallItems: items.filter(i => i.type === "firewall"),
      avsItems: items.filter(i => i.type === "avs"),
      encryptionItems: items.filter(i => i.type === "encryption"),
    });
   
  })
  .catch(error => {
    console.log(error)
  })
});
router.get("/system-repair", (req, res, next) => {
  res.render("menu/system-repair");
});

router.get("/ladder", (req, res, next) => {
  User.find({})
    .then(user => {
      res.render("menu/ladder", { user });
    })
    .catch(console.error);
});

router.get("/information", (req, res, next) => {
  res.render("menu/information");
});

router.get("/arcade", (req, res, next) => {
  res.render("menu/arcade");
});

router.get("/logout", (req, res, next) => {
  res.render("menu/logout");
});

router.post("/upload", (req, res) => {
  console.log(req.files)
  res.send("we got the file")
})

module.exports = router;
