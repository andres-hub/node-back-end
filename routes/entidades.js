/*
    Ruta: /api/entidades
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');

const {getEntidades, crearEntidad, actualizarEntidad, getBuscar, getEntidadId} = require('../controllers/entidades');

const router = Router();

router.get('/:id',
    [
        validarJWT
    ],
    getEntidades
);

router.get('/:id/buscar/:termino',
    [
        validarJWT
    ],
    getBuscar
);

router.get('/buscarId/:id',
    [
        validarJWT
    ],
    getEntidadId
)

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('modulo', 'El modulo no es valido').isMongoId(),
        check('url', 'La url es obligatorio').not().isEmpty(),
        check('acciones', 'Las acciones son obligatorias').not().isEmpty(),
        validarCampos
    ]
    , crearEntidad
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('modulo', 'El modulo no es valido').isMongoId(),
        check('url', 'La url es obligatorio').not().isEmpty(),
        check('acciones', 'Las acciones son obligatorias').not().isEmpty(),
        validarCampos
    ]    
    , actualizarEntidad
);

module.exports = router;
