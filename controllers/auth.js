const {response} = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
const { guardarLog } = require('../helpers/guardar-Log');

const Usuario = require('../models/usuario');

const login = async(req, res = response)=>{

    try {

        const {email, password} = req.body;

        const usuarioDB = await Usuario.findOne({email});
       
        if(!usuarioDB){
            const msg = 'Usuario o contraseña no valida';
            const status = 400;
            guardarLog(req,JSON.stringify(req.body), msg, status);    
            return res.status(400).json({
                ok: false,
                msg
            });
        }

        if(!usuarioDB.estado){
            const msg = 'Error: Usuario inactivo.';
            const status = 400;
            guardarLog(req,JSON.stringify(req.body), msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);

        if(!validPassword){
            const msg = 'Usuario o contraseña no valida';
            const status = 400;
            guardarLog(req,JSON.stringify(req.body), msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const token = await generarJWT(usuarioDB.id, usuarioDB.role);
        const menu = await getMenuFrontEnd(req,usuarioDB.id);

        req.uid = usuarioDB.id;

        guardarLog(req,email,`ok`);
        res.json({
            ok: true,
            token,
            menu
        });
        
    } catch (error) {
         const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
         const status = 500;
         guardarLog(req,error, msg, status);
         res.status(status).json({
            ok: false,
            msg
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
                const msg = 'Error: Usuario inactivo.';
                const status = 400;
                guardarLog(req,error, msg, status);
                return res.status(status).json({
                    ok: false,
                    msg
                });
            }

            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();
        
        const token = await generarJWT(usuario.id, usuario.role);

        const menu = await getMenuFrontEnd(req,usuario.id);

        guardarLog(req,JSON.stringify(usuario),token );
        res.json({
            ok: true,
            token,
            menu
        });
        
    } catch (error) {
        const msg = 'El token no es correcto.';
        const status = 401;
        guardarLog(req,error, msg, status);
        res.status(401).json({
            ok: false,
            msg
        });
    }

}

const renewToken = async(req, res = response)=>{

    try {

        const uid = req.uid;
        const role = req.role;

        const token = await generarJWT(uid, role);

        const usuario = await Usuario.findById(uid);

        const menu = await getMenuFrontEnd(req,usuario.id);
        
        res.json({
            ok: true,
            token,
            usuario,
            menu
        });
        
    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req,error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }


}

module.exports = {
    login,
    googleSingIn,
    renewToken
}