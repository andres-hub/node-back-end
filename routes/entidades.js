/*
    Ruta: /api/entidades
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');

const {getEntidades, crearEntidad, actualizarEntidad} = require('../controllers/entidades');

const router = Router();

router.get('/',
    [
        // validarJWT
    ],
    getEntidades
);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('moduloId', 'El modulo no es valido').isMongoId(),
        check('url', 'La url es obligatorio').not().isEmpty(),
        check('acciones', 'Las acciones son obligatorias').not().isEmpty(),
        validarCampos
    ]
    , crearEntidad
);

router.put('/:id',
    [
        // validarJWT,
        // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        // check('email', 'El emial es obligatorio').isEmail(),
        // validarCampos
    ]    
    , actualizarEntidad
);

module.exports = router;
