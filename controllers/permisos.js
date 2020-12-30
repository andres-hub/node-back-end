const {response} = require('express');
const { set } = require('mongoose');

const {validyty} = require('../helpers/validity-objectid');
const Entidad = require('../models/entidad');
const Modulo = require('../models/modulo');
const Permiso = require('../models/permiso')

const getPermisos = async(req, res = response) =>{
    try {

        const modulos = await Modulo.find();

        let menu = [];        

        await Promise.all(modulos.map(async (modulo)=>{

            const permisos = await Entidad.find({'moduloId': modulo._id});

            menu.push({ modulo, entidades: permisos});

        }));

        // TODO: guardar log
        res.json({
            ok: true,
            menu
        });

    } catch (error) {
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

module.exports = {
    getPermisos,
    postPermisos
}