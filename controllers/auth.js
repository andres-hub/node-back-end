const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

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

        const token = await generarJWT(usuarioDB.id, usuarioDB.role);
        const menu = await getMenuFrontEnd(usuarioDB.id);

        // TODO: guardar log
        res.json({
            ok: true,
            token,
            menu
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
        
        const token = await generarJWT(usuario.id, usuario.role);

        const menu = await getMenuFrontEnd(usuario.id);

        // TODO: guardar log
        res.json({
            ok: true,
            token,
            menu
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
        const role = req.role;

        const token = await generarJWT(uid, role);

        const usuario = await Usuario.findById(uid);

        const menu = await getMenuFrontEnd(usuario.id);
        
        res.json({
            ok: true,
            token,
            usuario,
            menu
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