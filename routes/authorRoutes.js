
const express= require("express");
const router = express.Router();


const { authorForm, storePost1, authors, details, updateForm, postUpdate, postValidations, deletePost } = require("../controllers/authorController")
const { auth } = require("../middlewares/auth")

router.get('/createauthor', auth, authorForm)
router.post('/createauthor', auth, storePost1)
router.get('/authors/:page', auth, authors)
router.get("/details/:id", auth, details);
router.get('/update/:id', auth, updateForm);
router.post('/update', [postValidations, auth], postUpdate);
router.post('/delete', auth, deletePost);

module.exports = router;