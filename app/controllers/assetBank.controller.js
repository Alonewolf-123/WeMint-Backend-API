const multer = require('multer');
const path = require('path');
const db = require("../models");
const Attribute = require('../models/attribute/attribute.model');
const Category = require('../models/category/category.model');
const User = require('../models/user/user.model');
const utils = require('../utils/utils');
const AssetBank = db.assetBank;

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (_req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({
    storage: storage,
    limits: {
        fieldNameSize: 50, // TODO: Check if this size is enough
        // TODO: Change this line after compression
        fileSize: 10485760 // 100 MB
    },
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
}).single('asset');

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpg|jpeg|png|gif|svg|mp4|wabm|mp3|wav|ogg|glb|gltf|json|gif|json/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    let mimetype = filetypes.test(file.mimetype);

    // Need to check mimetype
    mimetype = true;

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Invalid Asset');
    }
}

exports.allAssetBanks = (req, res) => {
    AssetBank.find({deleted: false}).populate("user").populate("category").then((assetBanks) => {
        res.status(200).send({ result: 1, data: assetBanks });
    }).catch((err) => {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
    });
};

exports.delAssetBank = (req, res) => {
    const assetBank = req.body.id;
    AssetBank.findOneAndUpdate({ _id: assetBank }, { deleted: true }, {
        new: true
    }, function (err, assetBank) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'AssetBank was deleted successfully!' });
    });
};

exports.createAssetBank = (req, res) => {
    upload(req, res, function (err) {

        if (err instanceof multer.MulterError) {
            res.status(500).send({ result: 0, message: err.message });
            return;
        } else if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }

        if (req.file == undefined || req.file.filename == undefined) {
            res.status(500).send({ result: 0, message: 'Invalid Asset' });
            return;
        }

        const category = req.body.category;
        const user = req.body.user;

        let invalidMessage = "";

        // category
        Category.findOne({
            _id: category
        }).exec((err, cateogry) => {
            if (err || !cateogry) {
                invalidMessage = "Category is not valid!";
            }

            // user
            User.findOne({
                _id: user
            }).exec((err, dataType) => {

                if (err || !dataType) {
                    invalidMessage += utils.isEmpty(invalidMessage) ? "User is not valid!" : "\n" + "User is not valid!";
                }

                if (!utils.isEmpty(invalidMessage)) {
                    res.status(400).send({ result: 0, message: invalidMessage });
                    return;
                }
                let attributeValues;
                try {
                    attributeValues = JSON.parse(req.body.attributeValues);
                } catch (err) {
                    console.log(err);
                    res.status(400).send({ result: 0, message: "Attribute Values are not valid" });
                    return;
                }
                let attributeIds = Object.keys(attributeValues);
                if (attributeIds.length == 0) {
                    res.status(400).send({ result: 0, message: "Attribute Values are not valid" });
                    return;
                } else {
                    Attribute.find({ category: category }).where('_id').in(attributeIds).then((attributes) => {
                        if (attributes.length == attributeIds.length) {
                            attributeIds.forEach(element => {
                                if (utils.isEmpty(attributeValues[element])) {
                                    res.status(400).send({ result: 0, message: "Attribute Values are not valid" });
                                    return;
                                }
                            });
                            const assetBank = new AssetBank({
                                asset: req.file.filename,
                                name: req.body.name,
                                externalLink: req.body.externalLink,
                                description: req.body.description,
                                user: req.body.user,
                                category: req.body.category,
                                attributeValues: attributeValues,
                                artist: req.body.artist,
                                supply: req.body.supply,
                                blockchain: req.body.blockchain,
                            });

                            assetBank.save((err, result) => {
                                if (err) {
                                    res.status(500).send({ result: 0, message: err.message });
                                    return;
                                }

                                res.send({ result: 1, message: "AssetBank was created successfully!", data: result });
                            });
                        } else {
                            res.status(400).send({ result: 0, message: "Attribute Values are not valid" });
                            return;
                        }
                    }).catch((err) => {
                        if (err) {
                            res.status(400).send({ result: 0, message: "Attribute Values are not valid" });
                            return;
                        }
                    });
                }



            });

        });


    })
};