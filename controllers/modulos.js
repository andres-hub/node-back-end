const {response} = require('express');
const { Model } = require('mongoose');

const Modulo = require('../models/modulo');

const getModulos = async(req, res = response) =>{

    try {
    
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;

        const [modulos, total] = await Promise.all([

            Modulo
                .find()
                .skip(desde)
                .limit(limite),
            
            Modulo.count()

        ]);
        
        res.json({
            ok: true,
            modulos,
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

const crearModulo = async(req, res = response) =>{

    const modulo = new Modulo(req.body);

    try {
        
        await modulo.save();
        
        // TODO: guardar log
        res.json({
            ok: true,
            modulo
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const actualizarModulo = (req, res = response) =>{

    res.json({
        ok: true,
        msg: "actualizarModulo"
    });

};


module.exports = {
    getModulos,
    crearModulo,
    actualizarModulo
}