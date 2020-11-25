const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response)=>{

    const {email, password} = req.body;

    try {

        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no valida' 
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);

        if(!validPassword){
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no valida' 
            });
        }

        const token = await generarJWT(usuarioDB.id);

        // TODO: guardar log
        res.json({
            ok: true,
            token
        });
        
    } catch (error) {
         // TODO: guardar log
         res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }
}

module.exports = {
    login
}