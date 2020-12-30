const {response} = require('express');

const {validyty} = require('../helpers/validity-objectid');

const Rol = require('../models/rol');
const router = require('../routes/roles');

const getRoles = async(req, res = response) =>{
    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        
        const [roles, total] = await Promise.all([
        
            Rol
                .find()
                .skip(desde)
                .limit(limite),
        
            Rol.countDocuments()
        
        ]);

        // TODO: guardar log
        res.json({
            ok: true,
            roles,
            total
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const getRolId = async(req, res = response) =>{
    try {

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){
        
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        
        }

        const rol = await Rol.findById(id);

        if(!rol){

            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });

        }

        // TODO: guardar log
        res.json({
            ok: true,
            rol
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const actualizarRol = async(req, res = response) =>{
    try {

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){
        
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        
        }
        
        const rolDB = await Rol.findById(id);

        if(!rolDB){
        
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'El rol no exite'
            });
        
        }

        const cambios = {...req.body}

        const rol = await Rol.findByIdAndUpdate(id,cambios,{new:true});

        // TODO: guardar log
        res.json({
            ok: true,
            rol
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const crearRol = async(req, res = response) =>{
    try {

        const rol = await new Rol(req.body);

        await rol.save();

        // TODO: guardar log
        res.json({
            ok: true,
            rol
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};


module.exports = {
    getRoles,
    getRolId,
    actualizarRol,
    crearRol   
}