const router = require('express').Router();
const multer = require('multer');
const os = require('os');
// validation

const productController = require('./controller');

router.get('/product', productController.index);

router.post('/product',
    multer({ dest: os.tmpdir() }).single('image'),
    productController.store
);

router.put('/product/:id',
    multer({ dest: os.tmpdir() }).single('image'),
    productController.update
);

router.delete('/product/:id',
    productController.destroy
);

module.exports = router;