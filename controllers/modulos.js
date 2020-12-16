const {response} = require('express');

const Modulo = require('../models/modulo');


const { validyty } = require("../helpers/validity-ObjectID");

const getModulos = async(req, res = response) =>{

    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;

        const [modulos, total] = await Promise.all([

            Modulo
                .find()
                .skip(desde)
                .limit(limite),
            
            Modulo.countDocuments()

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

const buscarModulo = async(req, res = response) =>{

    try {
        
        const termino = req.params.termino;
        const regex    = new RegExp( termino, 'i' );
        
        const modulos = await Modulo.find({nombre: regex});

        res.json({
            ok: true,
            modulos,
            total: modulos.length
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }
}

const getId = async(req, res = response)=>{
    try {
        
        const id = req.params.id;
        const validarId = await validyty(id);
        if(!validarId){
            // TODO: guardar log
            res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        }else{

            const modulo = await Modulo.findById(id);

            res.json({
                ok: true,
                modulo
            });

        }
        
    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }
}

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

const actualizarModulo = async(req, res = response) =>{

    try {

        const id = req.params.id;

        const moduloDB = await Modulo.findById(id);

        if(!moduloDB){
            return res.status(404).json({
                ok:false,
                msg: 'El modulo no existe'
            });
        }

        const cambios = {...req.body}

        const modulo = await Modulo.findByIdAndUpdate(id,cambios, {new:true});

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

module.exports = {
    getModulos,
    crearModulo,
    actualizarModulo,
    buscarModulo,
    getId
}