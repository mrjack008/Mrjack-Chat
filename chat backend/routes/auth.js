const { getAllGroups, addgroup, addmember, getOneGroup, invitegroup, exitgroup, deletegroup } = require("../controllers/groupController");
const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  clearchat,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.post("/addgroup",addgroup)
router.post("/addmember",addmember)
router.get("/allgroup/:id",getAllGroups)
router.post('/onegroup',getOneGroup)
router.post('/joingroup',invitegroup)
router.post('/exitgroup',exitgroup)
router.post('/deletegroup',deletegroup)
router.post('/clearchat',clearchat)


module.exports = router;