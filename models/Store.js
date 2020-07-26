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
            default : 'Point'
        },  
        coordinates: [{
            type: Number,
            required: "You must supply coordinates!"
        }],
        address: {
            type:String,
            required : 'You must supply an address'
        }
    },
    photo: String,
    author : {
        type : mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    }
}, 
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

storeSchema.index({
    name: 'text',
    description: 'text'
})

storeSchema.index({location: '2dsphere'})

storeSchema.pre('save', function(next){
    if(!this.isModified('name')){
        next();
        return;
    }
    this.slug = slug(this.name);
    next();
})

storeSchema.virtual('reviews',{
    ref: 'Review',
    localField: '_id',
    foreignField: 'store'
})

storeSchema.statics.getTopStores = function(){
    return this.aggregate([
        {$lookup: {from: 'reviews',localField: '_id',foreignField: 'store',as: 'reviews'}},
        {$match: {'reviews.1':{$exists:true}}},
        {$addFields: {averageRating: {$avg: '$reviews.rating'}}},
        {$sort: {averageRating: -1}},
        {$limit: 10}
    ])
}

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind: '$tags'},
        { $group: {_id:'$tags',count: {$sum:1} }},
        { $sort: {count:-1}}
    ]);
}

function autoPopulate(next){
    this.populate('reviews')
    next()
}

storeSchema.pre('find',autoPopulate)
storeSchema.pre('findOne',autoPopulate)

module.exports = mongoose.model('Store',storeSchema)