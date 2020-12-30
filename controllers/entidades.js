const {response} = require('express');
const { validyty } = require('../helpers/validity-ObjectID');

const Entidad = require('../models/entidad');
const Modulo = require('../models/modulo');

const getEntidades = async(req, res = response) =>{

    try {

        const id = req.params.id;
        
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        
        const validarId = await validyty(id);
        if(!validarId){
            // TODO: guardar log
            res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        }else{
            
            const entidades = await Entidad.find({moduloId: id}).skip(desde).limit(limite);
            
            res.json({
                ok: true,
                entidades,
                total: entidades.length
            });
        }
        
    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const getBuscar = async(req, res = response) =>{
    
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

        const termino = req.params.termino;
        const regex    = new RegExp( termino, 'i' );

        const entidades = await Entidad.find({moduloId: id, nombre: regex});
               
        // TODO: guardar log
        res.json({
            ok: true,
            entidades,
            total: entidades.length
        });
        



    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const getEntidadId = async(req, res = response) =>{
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

        const entidad = await Entidad.findById(id);

        if(!entidad){
        
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        
        }

        // TODO: guardar log
        res.json({
            ok: true,
            entidad
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const crearEntidad = async(req, res = response) =>{
    
    try {

        const entidad = new Entidad(req.body);
        
        const modulo = await Modulo.findById(entidad.moduloId);

        if(!modulo){
            // TODO: guardar log
            return res.status(404).json({
                ok: false,
                msg: 'El modulo no es valido' 
            });
        }



        await entidad.save();
        
        // TODO: guardar log
        res.json({
            ok: true,
            entidad
        });

    } catch (error) {
        console.log(error);
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const actualizarEntidad = async(req, res = response) =>{

    try {

        const id = req.params.id;

        const entidadDB = await Entidad.findById(id);
        
        if(!entidadDB){
            return res.status(404).json({
                ok:false,
                msg: 'La entidad no existe'
            });
        }

        const cambios = {...req.body}

        const entidad = await Entidad.findByIdAndUpdate(id,cambios, {new:true});

        res.json({
            ok: true,
            entidad
        });

        res.json({
            ok: true,
            entidad
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
    getEntidades,
    getBuscar,
    getEntidadId,
    crearEntidad,
    actualizarEntidad
}