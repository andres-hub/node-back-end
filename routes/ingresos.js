/*
    Ruta: /api/ingresos
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');

const { crearIngreso, getIngresos, getIngreso, actualizarIngreso, eliminarIngreso } = require('../controllers/ingresos');


const router = Router();

router.get('/',
    [
        validarJWT
    ],
    getIngresos
)

router.get('/:id',
    [
        validarJWT
    ],
    getIngreso
);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('frecuencia', 'La frecuencia es obligatoria').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearIngreso
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('frecuencia', 'La frecuencia es obligatoria').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarIngreso
);

router.delete('/:id',
    [
        validarJWT
    ],
    eliminarIngreso
)

module.exports = router;