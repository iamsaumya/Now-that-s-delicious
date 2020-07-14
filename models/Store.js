const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trime: true,
        required: 'Please endter a store name'
    },
    slug: String,
    description: {
        type: String,
        trim: true, 
    },
    tags: [String],
    location:{
        type:{
            type: String,
            default : 'point'
        },
        coordinates: [{
            type: Number,
            required: "You must supply coordinates!"
        }],
        address: {
            type:String,
            required : 'You must supply an address'
        }
    }
});

storeSchema.pre('save', function(next){
    if(!this.isModified('name')){
        next();
        return;
    }
    this.slug = slug(this.name);
    next();
})

module.exports = mongoose.model('Store',storeSchema)