var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('admin/adminHome',{admin:true});
});

router.get('/applications', function(req, res) {
  res.render('admin/applications',{admin:true});
});

router.get('/blogs', function(req, res) {
  res.render('admin/blogs',{admin:true});
});

router.get('/queries', function(req, res) {
  res.render('admin/queries',{admin:true});
});

router.get('/testimonials', function(req, res) {
  res.render('admin/testimonials',{admin:true});
});

router.get('/applications', function(req, res) {
  res.render('admin/applications',{admin:true});
});


router.get('/logout', function(req, res) {
  res.render('admin/applications',{admin:true});
});



module.exports = router;
