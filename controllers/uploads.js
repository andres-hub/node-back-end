const path = require('path');
const fs = require('fs');

const {response} = require('express');
const { v4: uuidv4 } = require('uuid');

const {actualizarImagen} = require("./actualizar-imagen");
const ArquetipoImg = require('../models/arquetipoImg');
const { validyty } = require("../helpers/validity-ObjectID");
const { patch } = require('../routes/uploads');

const fileUpload = async(req, res = response) => {

    try {

        const id = req.query.id || req.uid;
        const validarId = await validyty(id);
        if(!validarId){
            // TODO: guardar log
            res.status(400).json({
                ok: false,
                msg: 'Error id no valido'
            });
        }

        const arquetipo = req.params.arquetipo;

        // TODO: crear servicio pra crud de la coleccion
        const arquetipoValidos = await ArquetipoImg.findOne({'nombre': arquetipo});

        if(!arquetipoValidos){
            // TODO: guardar log
            res.status(400).json({
                ok: false,
                msg: 'Error arquetipo no valida'
            });
        }
                
        if (!req.files || Object.keys(req.files).length === 0) {
            // TODO: guardar log
            return res.status(400).json({
                ok: false,
                msg: 'Archivo guardado con éxito'
            });
        }

        const file = req.files.imagen;

        const nombreCortado = file.name.split('.');
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];

        const extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

        if(!extencionesValidas.includes(extensionArchivo)){
            // TODO: guardar log
            res.status(400).json({
                ok: false,
                msg: 'Error extensión de archivo no valida  no valida'
            });
        }

        const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

        const path = `./uploads/${arquetipo}/${nombreArchivo}`;
        const actulizardb = await actualizarImagen(arquetipo, id, nombreArchivo);
        if(!actulizardb){
            res.status(400).json({
                ok: false,
                msg: `El ${arquetipo} no se encontró en base de datos`
            });
        };

        // TODO: subir imagenes a firebase
        file.mv(path, (err) => {
            
            if(err){
                // TODO: guardar log
                res.status(500).json({
                    ok: false,
                    msg: 'Error inesperado... Comuníquese con el administrador del sistema'
                });
            }

            // TODO: guardar log
            res.json({
                ok: true,
                msg: "Archivo guardado con éxito",

            });
        });


    } catch (error) {
        // TODO: guardar log
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

}

const retornarArchivo = (req, res = response) => {

    try {
        
        const arquetipo = req.params.arquetipo;
        const file = req.params.file;
    
        let pathArchivo = path.join(__dirname, `../uploads/${arquetipo}/${file}`);

        if(!fs.existsSync(pathArchivo)){
            pathArchivo = path.join(__dirname,`../uploads/no_imagen.png`);
           res.sendFile(pathArchivo);  
        }else
            res.sendFile(pathArchivo);

    } catch (error) {
        // TODO: guardar log
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Comuníquese con el administrador del sistema'
        });
    }

}
module.exports = {
    fileUpload,
    retornarArchivo
}