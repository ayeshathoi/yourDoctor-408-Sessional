const router = require('express-promise-router')();

router.use("/user", require('./user'))
router.use("/patient", require('./patient'))
router.use("/review", require('./review_complaint'))
router.use("/doctor", require('./doctor'))
router.use("/hospital", require('./hospital'))
router.use("/nurse", require('./nurse'))
router.use("/driver", require('./driver'))
router.use("/booking", require('./booking'))
router.use("/auth", require('./auth'))
router.use("/comment", require('./commentBox'))
router.use("/search", require('./search'))
module.exports = router;

