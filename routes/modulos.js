/*
    Ruta: /api/modulos
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');

const {getModulos, crearModulo, actualizarModulo, buscarModulo, getId} = require('../controllers/modulos');

const router = Router();

router.get('/',
    [
        // validarJWT
    ],
    getModulos
);

router.get('/buscar/:termino',
    [
        validarJWT
    ],
    buscarModulo
);

router.get('/:id',
    [
        validarJWT
    ],
    getId
)

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
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('icono', 'El icono es obligatorio').not().isEmpty(),
        validarCampos
    ]    
    , actualizarModulo
);



module.exports = router;
