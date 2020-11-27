/*
    Ruta: /api/modulos
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');

const {getModulos, crearModulo, actualizarModulo} = require('../controllers/modulos');

const router = Router();

router.get('/',
    [
        // validarJWT
    ],
    getModulos
);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('icono', 'El icono es obligatorio').not().isEmpty(),
        validarCampos
    ]
    , crearModulo
);

router.put('/:id',
    [
        // validarJWT,
        // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        // check('email', 'El emial es obligatorio').isEmail(),
        // validarCampos
    ]    
    , actualizarModulo
);

module.exports = router;
