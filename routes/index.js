const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')
const {catchErrors} = require('../handlers/errorHandlers')

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores',catchErrors(storeController.getStores));
router.get('/stores/:id/edit',catchErrors(storeController.editStore))
router.get('/stores/:slug',catchErrors(storeController.getStoreBySlug))

router.get('/add',storeController.upload,catchErrors(storeController.resize),storeController.addStore);
router.post('/add',storeController.upload,catchErrors(storeController.resize),catchErrors(storeController.createStore));
router.post('/add/:id',catchErrors(storeController.updateStore));

module.exports = router;
