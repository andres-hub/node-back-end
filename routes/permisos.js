/*
    Ruta: /api/permisos
*/

const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');

const { getPermisos, getAcciones, postPermisos, getVerificarRuta } = require('../controllers/permisos');

const router = Router();

router.get('/:id',
    [
        validarJWT
    ],
    getPermisos
)

router.get('/acciones/:id',
    [
        validarJWT
    ],
    getAcciones
);

router.put('/ruta',
    [
        check('ruta', 'La ruta es obligatoria').not().isEmpty(),
        validarCampos,
        validarJWT
    ],
    getVerificarRuta
)

router.post('/:id',
    [
        validarJWT
    ],
    postPermisos    
)

module.exports = router;