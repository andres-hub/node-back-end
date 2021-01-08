const {response, urlencoded} = require('express');
const { validyty } = require('../helpers/validity-ObjectID');

const Modulo = require('../models/modulo');
const Entidad = require('../models/entidad');
const Accion = require('../models/accion');

const getEntidades = async(req, res = response) =>{

    try {

        const id = req.params.id;
        
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        
        const validarId = await validyty(id);
        if(!validarId){
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        }
            
        const entidadesDB = await Entidad.find({modulo: id}).skip(desde).limit(limite);

        let entidades = [];

        await Promise.all(entidadesDB.map(async (entidad)=>{

            const {_id,nombre, url,modulo} = entidad;

            const acciones = await Accion.find({'entidad': _id});
            entidades.push({
                _id,
                nombre,
                url,
                modulo,
                acciones
            });

        }));

        res.json({
            ok: true,
            entidades,
            total: entidadesDB.length
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

        const entidadDB = await Entidad.findById(id);
        

        if(!entidadDB){
        
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        
        }

        const {_id,nombre, url,modulo} = entidadDB;

        const acciones = await Accion.find({'entidad': _id});

        // TODO: guardar log
        res.json({
            ok: true,
            entidad:{
                _id,
                nombre,
                url,
                modulo,
                acciones
            }
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

const crearEntidad = async(req, res = response) =>{
    
    try {

        const body = req.body;
        const acciones = body.acciones;        

        let validarCampos = true;
        
        await Promise.all(acciones.map( x =>{
        
            if (!x.accion || !x.alias || !x.url){
                validarCampos = false;
                return;
            }
        
        }));
        
        if(!validarCampos){
            // TODO: guardar log
            return res.status(404).json({
                ok: false,
                msg: 'Datos incompletos'
            });
        }

        const entidad = new Entidad(body);        
        
        const modulo = await Modulo.findById(body.modulo);
        
        if(!modulo){
            // TODO: guardar log
            return res.status(404).json({
                ok: false,
                msg: 'El modulo no es valido' 
            });
        }

        await entidad.save();

        Promise.all(acciones.map(async x =>{
        
            const accion = new Accion(x);
            accion.entidad = entidad._id;
            await  accion.save(); 
        
        }));
        
        // TODO: guardar log
        res.json({
            ok: true,
            entidad: body
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
        
        const validarId = await validyty(id);
        if(!validarId){
        
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        
        }

        const entidadDB = await Entidad.findById(id);
        
        if(!entidadDB){
            return res.status(404).json({
                ok:false,
                msg: 'La entidad no existe'
            });
        }

        const cambios = {...req.body}

        let validarCampos = true;
        
        
        await Promise.all(cambios.acciones.map( x =>{
            
            if (!x.accion || !x.alias || !x.url){
                validarCampos = false;
                return;
            }
        
        }));
        
        if(!validarCampos){
            // TODO: guardar log
            return res.status(404).json({
                ok: false,
                msg: 'Datos incompletos'
            });
        }

        const entidad = await Entidad.findByIdAndUpdate(id,cambios, {new:true});

        Promise.all(cambios.acciones.map(async x =>{
            
            if(x._id){
                const accion = await Accion.findByIdAndUpdate(x._id, x);
            }else{
                const accion = new Accion(x);
                accion.entidad = entidad._id;
                await  accion.save(); 
            }

        }));        

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


module.exports = {
    getEntidades,
    getBuscar,
    getEntidadId,
    crearEntidad,
    actualizarEntidad
}