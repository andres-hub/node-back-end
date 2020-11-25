/*
    Ruta: /api/usuarios
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const {getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario} = require('../controllers/usuarios');

const router = Router();

router.get('/',
    [
        validarJWT
    ],
    getUsuarios
);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El emial es obligatorio').isEmail(),  
        // TODO: validar carecteres minimos del password      
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ]
    , crearUsuario
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El emial es obligatorio').isEmail(),
        validarCampos
    ]    
    , actualizarUsuario);

router.delete('/:id',
        [
            validarJWT,
            check('estado', 'El estado es obligatorio').not().isEmpty(),
            validarCampos
        ]   
        , borrarUsuario);

module.exports = router;
