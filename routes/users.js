var express = require('express');
var router = express.Router();
const { doSignup, doLogin } = require('../helpers/authHelpers')
const { createService, getAmount, addAddons, addAddress, saveData, checkout } = require('../helpers/userHelpers')

const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    fs.mkdir(path.join(__dirname, `../public/uploads/${req.params.id}`), (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('Directory created successfully!');
    })
    cb(null, `public/uploads/${req.params.id}`)
  },
  filename: function (req, file, cb) {
    var filename = file.originalname;
    var fileExtension = filename.split(".")[1];
    cb(null, filename);
  }
});

const upload = multer({ storage: storage })

const cpUpload = upload.fields([{ name: 'photo', maxCount: 10 }, { name: 'id' }, { name: 'proof' }])



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

    req.session.userDetails = data.user

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


router.get('/ourServices',function (req,res) {

  res.render('user/ourServices')
 
})



router.get('/PrivateLimitedCompany', function (req, res) {
  res.render('user/PrivateLimitedCompany');
});
router.get('/LimitedLiabilityPartnership', function (req, res) {
  res.render('user/LimitedLiabilityPartnership');
});
router.get('/OnePersonCompany', function (req, res) {
  res.render('user/OnePersonCompany');
});
router.get('/Proprietorship', function (req, res) {
  res.render('user/Proprietorship');
});
router.get('/PartnershipFirm', function (req, res) {
  res.render('user/PartnershipFirm');
});



router.get('/addservice/:service', verifylogin, (req, res) => {

  let service = req.params.service
  let user = req.session.userDetails

  if (user) {

    createService(user, service).then((data) => {
      res.redirect(`/form/${service}/${data}`)

    }).catch((err) => {
      res.redirect(`/${service}`)
    })

  }
})

router.get('/form/:service/:id', function (req, res) {
  let id = req.params.id;
  let serviceName = req.params.service

  getAmount(id).then((service) => {
    if(serviceName==='LimitedLiabilityPartnership'){

      res.render('user/Form/LimitedLiabilityPartnershipForm', { id, Totel: service[0].total });
      
    }else if(serviceName==='PrivateLimitedCompany'){
      res.render('user/Form/PrivateLimitedCompanyForm', { id, Totel: service[0].total });

    }
    else if(serviceName==='OnePersonCompany'){
      res.render('user/Form/OnePersonCompanyForm', { id, Totel: service[0].total });

    }
    else if(serviceName==='Proprietorship'){
      res.render('user/Form/ProprietorshipForm', { id, Totel: service[0].total });

    }
    else if(serviceName==='PartnershipFirm'){
      res.render('user/Form/PartnershipFirmForm', { id, Totel: service[0].total });

    }
  })
});

router.post('/addon/:id/:addon', function (req, res) {
  let id = req.params.id;
  let addon = req.params.addon;
  console.log(id, addon);
  addAddons(id, addon).then((data) => {
    getAmount(id).then((service) => {
      res.json({ id, Totel: service[0].total });
    })

  }).catch(() => {

  })


});

router.post('/form/:id', cpUpload, function (req, res, next) {

  const id = req.params.id
  console.log(req.body);

  console.log(req.files);
  let data = { ...req.body }

  saveData(id, data).then(() => {
    res.redirect(`/checkout/${id}`)

  }).catch(() => {
    res.redirect('/')

  })


})


router.get('/checkout/:id', verifylogin, function (req, res) {
  let id = req.params.id
  getAmount(id).then((service) => {
    res.render('user/Checkout', { id, Totel: service[0].total });
  }).catch((err) => {
    res.redirect('/404')
  })
});

router.post('/checkout/:id', verifylogin, function (req, res) {
  let id = req.params.id
  let data = { ...req.body }
  checkout(id, data).then((service) => {
    req.redirect('/')
  }).catch((err) => {
    res.redirect('/404')
  })


})






















router.get('/form', (req, res) => {
  res.render('user/form')
})
router.get('/form2', (req, res) => {
  res.render('user/form2')
})



router.get("/files/downloads/:id", (req, res) => {
  console.log("Dfasdf");
  let location = path.join(__dirname, `../public/uploads/${req.params.id}/download.jpg`)

  console.log(location);
  res.download(location);
});

module.exports = router;
