const {response} = require('express');

const { validyty } = require('../helpers/validity-objectid');

const Parametro = require('../models/parametro');

const getParametros = async(req, res = response) =>{
    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;

        const [parametros, total] = await Promise.all([

            Parametro
                .find()
                .skip(desde)
                .limit(limite),
            
            Parametro.countDocuments()

        ]);

        // TODO: guardar log
        res.json({
            ok: true,
            parametros,
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

const buscarParametro = async(req, res = response) =>{
    try {

        const termino = req.params.termino;
        const regex    = new RegExp( termino, 'i' );
        
        const parametros = await Parametro.find({nombre: regex});

        res.json({
            ok: true,
            parametros,
            total: parametros.length
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const getParametroId = async(req, res = response) =>{
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

        const parametro = await Parametro.findById(id);

        // TODO: guardar log
        res.json({
            ok: true,
            parametro
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const actualizarParametro = async(req, res = response) =>{
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

        
        const parametroDB = await Parametro.findById(id);

        if(!parametroDB){
            return res.status(404).json({
                ok:false,
                msg: 'El modulo no existe'
            });
        }

        const cambios = {...req.body};

        parametro = await Parametro.findByIdAndUpdate(id, cambios, {new:true});

        // TODO: guardar log
        res.json({
            ok: true,
            parametro
        });

    } catch (error) {
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const crearParametro = async(req, res = response) =>{
    try {

        let body = req.body

        if(body.estado)
            body.estado = body.estado.toUpperCase();
        if(body.estado == null){
            body.estado = 'ACTIVO';
        }
        
        const parametro = new Parametro(body);

        await parametro.save();

        // TODO: guardar log
        res.json({
            ok: true,
            parametro
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
    getParametros,
    getParametroId,
    buscarParametro,
    actualizarParametro,
    crearParametro
}