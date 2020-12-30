/*
    Ruta: /api/permisos
*/

const {Router} = require('express');

const {validarJWT} = require('../middlewares/validar-jwt');

const { getPermisos, postPermisos } = require('../controllers/permisos');

const router = Router();

router.get('/',
    [
        validarJWT
    ],
    getPermisos
);

router.post('/:id',
    [
        validarJWT
    ],
    postPermisos    
)

module.exports = router;