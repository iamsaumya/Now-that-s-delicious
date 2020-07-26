const mongoose = require('mongoose')
const Store = mongoose.model('Store')
const User = mongoose.model('User')
const multer = require('multer')
const jimp  = require('jimp')
const uuid = require('uuid')
const { render } = require('../app')

const multerOptions = {
    storage : multer.memoryStorage(),
    fileFilter(req,file,next){
        const isPhoto = file.mimeType.startsWith('image/')
        if(isPhoto){
            next(null,true);
        }
        else {
            next({message: 'That file type is not allowed!'},false)
        }
    }
};

exports.homePage = (req,res) => {
    res.render('index')
}

exports.addStore = (req,res) => {
    res.render('editStore',{title: 'Add Store'})
}

exports.createStore = async (req,res) => {
    req.body.author = req.user._id
    const store = await (new Store(req.body).save())
    req.flash('success',`Successfully created ${store.name}. Care to leave a review?`)
    res.redirect(`/stores/${store.slug}`)
}

exports.getStores = async (req,res) => {
    const page = req.params.page || 1
    const limit = 6
    const skip = (page * limit) - limit

    const storePromise = Store
    .find()
    .skip(skip)
    .limit(4)
    .sort({created: 'desc'})

    const countPromise = Store.count()

    const [stores,count] = await Promise.all([storePromise,countPromise])

    const pages = Math.ceil(count / limit);
    if (!stores.length && skip) {
      req.flash('info', `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`);
      res.redirect(`/stores/page/${pages}`);
      return;
    }

    res.render('stores',{title: `Stores` , stores, page, pages, count})
}

exports.confirmOwner = (store,user) => {
    if(!store.author.equals(user._id)){
        throw Error('You must own a store in order to edit it');
    }
}
exports.editStore = async (req,res) => {
    const store = await Store.findOne({_id: req.params.id})

    this.confirmOwner(store,req.user)
    res.render('editStore',{title: `Edit ${store.name}`, store})
}

exports.updateStore = async (req,res) => {
    req.body.location.type = 'point'
    const store = await Store.findOneAndUpdate({_id:req.params.id},req.body,{
        new:true,
        runValidators: true
    }).exec()

    req.flash('success',`Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`);
    res.redirect(`/stores/${store.id}/edit`)
}

exports.getStoreBySlug = async (req,res,next) => {
    const store = await Store.findOne({slug: req.params.slug}).populate('author reviews');
    if(!store){
        return next();
    }

    res.render('store',{title:store.name, store})
}

exports.getStoresByTag = async(req,res) => {
    tag = req.params.tag;
    tagQuery = tag || {$exists: true}
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({tags: tagQuery})

    const [tags,stores] = await Promise.all([tagsPromise,storesPromise])

    res.render('tags',{title:'Tags',tags,tag,stores})
}

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req,res,next) => {
    if(!req.file){
        next();
        return;
    }

    const extension = req.file.mimeType.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`
    
    const photo = jimp.read(req.file.buffer)
    await photo.resize(800,jimp.AUTO); 
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
}

exports.searchStores = async (req,res) => {
    const stores  = await Store.find({
        $text : {
            $search : req.query.q
        }
    },
    {
        score: {$meta: 'textScore'}
    })
    .sort({
        score: {$meta : 'textScore'}
    })
    .limit(5)
    res.json(stores)
}

exports.mapStores =  async (req,res) => {
    const coordinates = [req.query.lng,req.query.lat].map(parseFloat);
    const q = {
        location : {
            $near : {
                $geometry : {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000
            }
        }
    };
    const stores = await Store.find(q).select('name slug description photo location').limit(10)
    res.json(stores)
}   

exports.mapPage = (req,res) => {
    res.render('map',{title:'MAP'})
}

exports.heartStore = async (req,res) => {
    const hearts = req.user.hearts.map(obj => obj.toString())

    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User
    .findByIdAndUpdate(req.user._id,
        {[operator]: {hearts : req.params.id}},
        {new: true}
    );
    res.json(user)
}

exports.getHearts = async (req,res) => {
    const stores = await Store.find({
        _id : { $in: req.user.hearts}
    })

    res.render('stores',{title: 'Hearted Stores',stores})
}

exports.getTopStores = async (req,res) => {
    const stores = await Store.getTopStores()
    res.render('topStores',{stores,title:'Top Stores'})
}