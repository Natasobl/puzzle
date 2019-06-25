const  express = require('express');
const router = express.Router();
const accountSettings = require('../controllers/accountSettingsController');


router.get('/', accountSettings.authenticate)
router.get('/:action', accountSettings.doChanges)
router.post('/:action', accountSettings.saveNewEmail);


module.exports= router;