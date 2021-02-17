/*
    Ruta: /api/movimientos
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');
const { getMovimientos, crearMovimiento, eliminarMovimiento } = require('../controllers/movimientos');

const router = Router();

router.get('/',
    [
        validarJWT
    ],
    getMovimientos
);

router.post('/',
    [   
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),       
        check('tipo', 'El tipo es obligatorio').not().isEmpty(),
        check('arquetipoId', 'El arquetipoId no es valido').isMongoId(),
        check('valor', 'El valor no es valido').isInt(),
        validarCampos
    ],
    crearMovimiento
);

router.delete('/:id',
    [
        validarJWT
    ],
    eliminarMovimiento
)

module.exports = router;