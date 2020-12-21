/*
    Ruta: /api/parametros
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');

const { getParametros, crearParametro, getParametroId, actualizarParametro, buscarParametro } = require('../controllers/parametros');

const router = Router();

router.get('/',
    [
        validarJWT
    ],
    getParametros
);

router.get('/buscar/:termino',
    [
        validarJWT
    ],
    buscarParametro
)

router.get('/:id',
    [
        validarJWT
    ],
    getParametroId
)

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        check('estado', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarParametro
)

router.post('/',
    [    
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearParametro
)

module.exports = router;