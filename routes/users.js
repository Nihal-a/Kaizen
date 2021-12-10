var express = require('express');
var router = express.Router();
const { doSignup, doLogin } = require('../helpers/authHelpers')
const { createService, getAmount, addAddons, addAddress } = require('../helpers/userHelpers')

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

router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/')
})




router.get('/plc', function (req, res) {
  res.render('user/PLC');
});
router.get('/llp', function (req, res) {
  res.render('user/LLP');
});
router.get('/ps', function (req, res) {
  res.render('user/PS');
});
router.get('/oppl', function (req, res) {
  res.render('user/PS');
});
router.get('/pf', function (req, res) {
  res.render('user/PS');
});


router.get('/addservice/:service', verifylogin, (req, res) => { 

  let service = req.params.service
  let user = req.session.userDetails

  if (user) {

    createService(user,service).then((data) => {
      res.redirect(`/form/${service}/${data}`)

    }).catch((err) => {
      res.redirect(`/${service}`)
    })

  }
})

router.get('/form/:service/:id', function (req, res) {
  let id = req.params.id;
  getAmount(id).then((Totel) => {
    res.render('user/LLPform', { id,Totel });
  })
});

router.get('/addon/:id/:addon', function (req, res) {
  let id = req.params.id;
  let addon = req.params.addon;
  console.log(id, addon);
  addAddons(id, addon).then(() => {

  }).catch(() => {

  })


});






router.get('/checkout', verifylogin, function (req, res) {
  res.render('user/Checkout');
});

























module.exports = router;
