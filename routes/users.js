var express = require('express');
var router = express.Router();
const { doSignup, doLogin } = require('../helpers/authHelpers')
const { createllpservice, getAmount ,addAddons} = require('../helpers/userHelpers')

const verifylogin = (req, res, next) => {
  console.log(req.session.userDetails);
  if (req.session.userDetails) {
    next()
  } else {
    res.redirect('/login')
  }

}

const verifylogout = (req, res, next) => {
  if (req.session.userDetails) {
    res.redirect('/')

  } else {
    next()

  }
}



/* GET users listing. */
router.get('/', function (req, res) {
  res.render('user/userHome');
});


router.get('/login', verifylogout, function (req, res) {
  res.render('user/UserLogin');
});

router.get('/signup', verifylogout, function (req, res) {
  res.render('user/UserSignup');
});



router.get('/plc', function (req, res) {
  res.render('user/PLC');
});
router.get('/llp', function (req, res) {
  res.render('user/LLP');
});

router.get('/llpform/:id', function (req, res) {
  let id =req.params.id;
  getAmount(id).then(()=>{

  })


  res.render('user/LLPform',{id});
});

router.get('/llpformaddon/:id/:addonId', function (req, res) {
  let id =req.params.id;
  let addonId=req.params.addonId;
  console.log(id,addonId);
  addAddons(id,addonId).then(()=>{

  }).catch(()=>{

  })


});

router.get('/ps', function (req, res) {
  res.render('user/PS');
});
router.get('/Servicedetails', function (req, res) {
  res.render('user/ServiceDetails');
});

router.get('/checkout', verifylogin, function (req, res) {
  res.render('user/Checkout');
});

router.get('/addLLpservice', verifylogin, (req, res) => {

  let user = req.session.userDetails
  console.log(user);
  if (user) {
    console.log(user);

    createllpservice(user).then((data) => {
      res.redirect(`/llpform/${data}`)

    }).catch((err) => {
      res.redirect('/llp')
    })

  }



})

router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/')
})





router.post('/signup', (req, res) => {
  const userData = req.body

  doSignup(userData).then((data) => {

    console.log("Data : ", data);

    req.session.user = data.user

    req.session.userLoggedIn = true

    res.json({ message: "signup sccsuss" })
  }).catch((err) => {

    res.status(403).json(err)

  })
})

router.post('/login', (req, res) => {

  const { email, password } = req.body

  doLogin({ email, password }).then((data) => {

    req.session.userDetails = data.user

    req.session.userLoggedIn = true

    res.json({ message: "signup sccsuss" })

  }).catch((err) => {

    res.status(401).json(err)


  })

})

module.exports = router;
