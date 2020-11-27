const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const getUsuarios = async(req, res)=>{

    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;
        
        const [usuarios, total] = await Promise.all([

            Usuario
                .find()
                .skip(desde)
                .limit(limite),
            
            Usuario.countDocuments()

        ]);

        res.json({
            ok: true,
            usuarios,
            total
        });    

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }
}

const crearUsuario = async(req, res = response)=>{

    const {email, password} = req.body;

    try {

        const exitsteEmail = await Usuario.findOne({email});

        if(exitsteEmail){
            // TODO: guardar log
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya se encuentre registrado' 
            });
        }

        const usuario = new Usuario(req.body);

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();
        
        // TODO: guardar log
        res.json({
            ok: true,
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

const actualizarUsuario = async(req, res = response)=>{    

    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            // TODO: guardar log
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe' 
            });
        }

        const {password, google, role, estado, email, ...campos} = req.body;

        if( usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email: email});
            if(existeEmail){
                // TODO: guardar log
                return res.status(400).json({
                    ok: false,
                    msg: 'El email ya existe'
                });
            }
        }
        
        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        // TODO: guardar log
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }
}

const borrarUsuario = async(req, res = response)=>{

    const uid = req.params.id;

    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            // TODO: guardar log
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe' 
            });
        }

        const campos = req.body; 
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        // TODO: guardar log
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }
}

module.exports ={
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}