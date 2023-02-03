const { addMessage, getMessages, attachmentfind } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.use("/images/:id",attachmentfind);

module.exports = router;
