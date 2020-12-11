/*
    Ruta: /api/usuarios
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const {getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, buscarUsuario, actualizarRol} = require('../controllers/usuarios');

const router = Router();

router.get('/',
    [
        validarJWT
    ],
    getUsuarios
);

router.get('/buscar/:termino',
    [
        validarJWT
    ],
    buscarUsuario
);

router.post('/',
    [        
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El emial es obligatorio').isEmail(),  
        // TODO: validar carecteres minimos del password      
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ]
    , crearUsuario
);

router.put('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo no es valido').isEmail(),
        validarCampos
    ]    
    , actualizarUsuario);

router.put('/role/:id',
[
    validarJWT,
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos
]    
, actualizarRol);

router.delete('/:id',
        [
            validarJWT
        ]   
        , borrarUsuario);

module.exports = router;
