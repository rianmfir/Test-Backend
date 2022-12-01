const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const userDetailController = require('./controller');

router.get('/user', userDetailController.index);
router.post('/user',
    multer({ dest: os.tmpdir() }).single('image'),
    userDetailController.store
);
// router.put('/user/:id',
//     multer({ dest: os.tmpdir() }).single('image'),
//     userDetailController.update
// );
// router.delete('/user/:id',
//     productController.destroy);

module.exports = router;