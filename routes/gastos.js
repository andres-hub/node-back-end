/*
    Ruta: /api/gastos
*/


const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');

const {crearGasto, getGastos, getGasto, actualizarGasto, eliminarGasto} = require('../controllers/gastos');


const router = Router();

router.get('/',
    [
        validarJWT
    ],
    getGastos
);

router.get('/:id',
    [
        validarJWT
    ],
    getGasto
);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo es obligatorio').not().isEmpty(),
        check('frecuencia', 'La frecuencia es obligatoria').not().isEmpty(),        
        check('fechaPago', 'La fecha de Pago es obligatoria').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearGasto
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo es obligatorio').not().isEmpty(),
        check('frecuencia', 'La frecuencia es obligatoria').not().isEmpty(),        
        check('fechaPago', 'La fecha de Pago es obligatoria').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarGasto
);

router.delete('/:id',
    [
        validarJWT
    ],
    eliminarGasto
);

module.exports = router;