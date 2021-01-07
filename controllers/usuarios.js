const {response} = require('express');
const bcryptjs = require('bcryptjs');


const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
const Usuario = require('../models/usuario');
const Permiso = require('../models/permiso');

const getUsuarios = async(req, res)=>{

    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        
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
    
    try {

        const {email, password} = req.body;

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

        const token = await generarJWT(usuario.id);
        
        const menu = await getMenuFrontEnd(usuario.id);

        // TODO: guardar log
        res.json({
            ok: true,
            token,
            menu
        });
        
    } catch (error) {
        console.log(error);
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }
    
}

const actualizarUsuario = async(req, res = response)=>{    

    const uid = req.uid;
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
        
        if(!usuarioDB.google)
            campos.email = email;
        else if(usuarioDB.email !== email){
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Los usuarios de google no pueden cambiar su correo'
            });
        }


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

        const estado = (usuarioDB.estado)? false : true;
         
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, {estado}, {new: true});

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

const buscarUsuario = async(req, res = response) =>{
    try {
        
        const termino = req.params.termino;
        const regex    = new RegExp( termino, 'i' );
        
        const usuarios = await Usuario.find({nombre: regex, email: regex});

        res.json({
            ok: true,
            usuarios,
            total: usuarios.length
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }
}

const actualizarRol = async(req, res = response)=>{
    
    try {

        const uid = req.params.id;
        const {role, ...campos} = req.body;
        const usuarioDB = await Usuario.findById(uid);
        
        if(!usuarioDB){
            // TODO: guardar log
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe' 
            });
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, {role}, {new: true});

        usuarioActualizado.password = ':)';

        const permisos = await Permiso.find({'asignado': usuarioActualizado.role});
        
        // await Permiso.deleteMany({'asignado': uid });

        // await Promise.all(permisos.map( async (permiso)=>{    
            
        //     const {modulo, entidad, accion} = permiso;

        //     const _permiso = new Permiso({modulo,entidad, accion, asignado: uid});
        //     await _permiso.save(); 

        // }));

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
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
    borrarUsuario,
    buscarUsuario,
    actualizarRol
}