/*
    Ruta: /api/permisos
*/

const {Router} = require('express');

const {validarJWT} = require('../middlewares/validar-jwt');

const { getPermisos, getAcciones, postPermisos } = require('../controllers/permisos');

const router = Router();

router.get('/:id',
    [
        validarJWT
    ],
    getPermisos
)

router.get('/acciones/:id',
    [
        validarJWT
    ],
    getAcciones
);

router.post('/:id',
    [
        validarJWT
    ],
    postPermisos    
)

module.exports = router;