const {response} = require('express');

const { validyty } = require("../helpers/validity-objectid");
const { guardarLog } = require('../helpers/guardar-Log');
const Movimiento = require('../models/movimiento'); 

const getMovimientos = async(req, res = response) =>{
    try {

        
        // guardarLog(req,, ,);
        res.json({
            ok: true,
            
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

};

const crearMovimiento = async(req, res = response) =>{
    try {

        const {_id, ...campos} = req.body;
        campos.uid = req.uid;

        const movimiento = new Movimiento(campos);

        await movimiento.save();
        
        guardarLog(req,JSON.stringify(req.body), JSON.stringify(movimiento));
        res.json({
            ok: true,
            movimiento
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

};

const eliminarMovimiento = async(req, res = response) =>{
    try {

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){

            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req, id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }
        
        const movimiento = await Movimiento.findById(id);
        

        if(!movimiento){
        
            const msg = 'Error id no valido';
            const status = 404;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        await movimiento.deleteOne();

        guardarLog(req,id, JSON.stringify(movimiento));
        res.json({
            ok: true,
            movimiento
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

};

module.exports = {
    getMovimientos,
    crearMovimiento,
    eliminarMovimiento
}