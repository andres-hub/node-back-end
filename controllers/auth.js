const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const usuarios = require('./usuarios');

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

        if(!usuarioDB.estado){
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Error: Usuario inactivo.'
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

const googleSingIn = async( req, res = response) => {

    try {

        const googleToken = req.body.token;
        const {name, email, picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: ':)',
                img: picture,
                google: true
            });
        }else{

            if(!usuarioDB.estado){
                // TODO: guardar log
                return res.status(400).json({
                    ok: false,
                    msg: 'Error: Usuario inactivo.'
                });
            }

            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();
        
        const token = await generarJWT(usuario.id);

        // TODO: guardar log
        res.json({
            ok: true,
            token
        });
        
    } catch (error) {
        // TODO: guardar log
        res.status(401).json({
            ok: false,
            msg: 'El token no es correcto.'
        });
    }

}

const renewToken = async(req, res = response)=>{

    try {

        const uid = req.uid;

        const token = await generarJWT(uid)

        const usuario = await Usuario.findById(uid);
    
        res.json({
            ok: true,
            token,
            usuario
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
    login,
    googleSingIn,
    renewToken
}