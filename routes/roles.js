/*
    Ruta: /api/roles
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');

const {getRoles, crearRol, getRolId, actualizarRol} = require('../controllers/roles');
const validarJwt = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',
    [
        validarJWT
    ],
    getRoles
);

router.get('/:id',
    [
        validarJWT,
    ],
    getRolId
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarRol
)

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearRol
);

module.exports = router;