const {response} = require('express');
const { set } = require('mongoose');

const {validyty} = require('../helpers/validity-objectid');

const Entidad = require('../models/entidad');
const Modulo = require('../models/modulo');
const Permiso = require('../models/permiso');
const Parametro = require('../models/parametro');

const getPermisos = async(req, res = response) =>{
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

        const permisos = await Permiso.find({'asignado': id});

        // TODO: guardar log
        res.json({
            ok: true,
            permisos
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const getAcciones = async(req, res = response) =>{
    try {

        const modulos = await Modulo.find();

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){
        
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        
        }

        let menu = [];        

        await Promise.all(modulos.map(async (modulo)=>{

            const entidades = await Entidad.find({'moduloId': modulo._id});

            await Promise.all(entidades.map(async (entidad)=>{
                
                await Promise.all(entidad.acciones.map(async (accion)=>{

                    const permiso = await Permiso.find({'accion': accion._id, 'asignado': id});
                    
                    if(permiso != null && permiso.length > 0 ){                        
                        accion.check = true;
                    }

                }))
            }))
            
            menu.push({ modulo, entidades: entidades});



        }));

        // TODO: guardar log
        res.json({
            ok: true,
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

};

const postPermisos = async(req, res = response) =>{
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

        const body = req.body;

        await Permiso.deleteMany({'asignado': id });

        await Promise.all(body.map( async (permiso)=>{    
            const {modulo, entidad, accion} = permiso;
            if(validyty(modulo) && validyty(entidad) && validyty(accion)){

                const _permiso = new Permiso({modulo,entidad, accion, asignado: id});
                await _permiso.save();

            }

        }));

        res.json({
            ok: true,
            body
        });
        
    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const getVerificarRuta = async(req, res = response) =>{
    try {
        
        const superUser = await Parametro.findOne({ 'nombre' :'SUPE_USUARIO', 'valor': req.uid});
        
        if(superUser){

            return res.json({
                ok: true           
            });
        }

        const ruta = req.body.ruta;

        const entidad = await Entidad.findOne({'url': ruta});

        if(!entidad){
            // TODO: guardar log
            return res.status(404).json({
                ok: false,
                msg: 'Ruta no valida' 
            });
        }

        const permiso = await Permiso.findOne({'asignado': req.uid, 'entidad': entidad._id});

        if(!permiso){
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Acceso denegado' 
            });
        }

        // TODO: guardar log
        res.json({
            ok: true           
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

module.exports = {
    getPermisos,
    getAcciones,
    getVerificarRuta,
    postPermisos
}