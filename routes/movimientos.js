/*
    Ruta: /api/movimientos
*/

const {Router} = require('express');

const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const { getMovimientos, pagarMovimiento, eliminarPago } = require('../controllers/movimientos');

const router = Router();

router.get('/:tipo/:quincena',
    [
        validarJWT
    ],
    getMovimientos
);

router.put('/:id',
    [   
        validarJWT,
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    pagarMovimiento
);

router.delete('/:id',
    [
        validarJWT
    ],
    eliminarPago
)

module.exports = router;