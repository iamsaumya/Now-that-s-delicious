const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')
const userController = require('../controllers/userController')
const {catchErrors} = require('../handlers/errorHandlers')

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores',catchErrors(storeController.getStores));
router.get('/stores/:id/edit',catchErrors(storeController.editStore))
router.get('/stores/:slug',catchErrors(storeController.getStoreBySlug))

router.get('/add',storeController.upload,catchErrors(storeController.resize),storeController.addStore);
router.post('/add',storeController.upload,catchErrors(storeController.resize),catchErrors(storeController.createStore));
router.post('/add/:id',catchErrors(storeController.updateStore));

router.get('/tags',catchErrors(storeController.getStoresByTag))
router.get('/tags/:tag',catchErrors(storeController.getStoresByTag))

router.get('/login',userController.loginForm)

router.post('/register',userController.validateRegister,userController.registerForm)
router.get('/register',userController.registerForm)

module.exports = router;
