const {Schema, model} = require('mongoose');

const QuincenaSchema = Schema({

    quincena:{
        type: String,
        required: true
    },
    mes:{
        type: String,
        required: true
    },
    uid:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

QuincenaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object; 
});

module.exports = model('Quincena', QuincenaSchema);