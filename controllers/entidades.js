const {response} = require('express');

const Entidad = require('../models/entidad');
const Modulo = require('../models/modulo');

const getEntidades = async(req, res = response) =>{

    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;

        const [entidades, total] = await Promise.all([

            Entidad
                .find()
                .skip(desde)
                .limit(limite),
            
            Entidad.count()

        ]);
        
        res.json({
            ok: true,
            entidades,
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

const crearEntidad = async(req, res = response) =>{

    const entidad = new Entidad(req.body);

    try {
        
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
        // TODO: guardar log
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

};

const actualizarEntidad = (req, res = response) =>{

    res.json({
        ok: true,
        msg: "actualizarEntidad"
    });

};


module.exports = {
    getEntidades,
    crearEntidad,
    actualizarEntidad
}