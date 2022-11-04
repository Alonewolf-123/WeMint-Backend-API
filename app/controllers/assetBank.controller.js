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

    // (deleted == deleted) && (name like search && user == user && date=date)

    let deleted = false;
    if (req.query.deleted != undefined) {
        if (req.query.deleted == true || req.query.deleted.toLowerCase().trim() == 'true') {
            deleted = true;
        }
    }
    const search = req.query.search ? req.query.search : '';
    const user = req.query.user ? req.query.user : '';
    const date = req.query.date ? req.query.date : '';
    let query;

    let conditions = [{ deleted: deleted }];

    if (!utils.isEmpty(search)) {
        conditions.push({ name: { '$regex': search } });
    }

    if (!utils.isEmpty(user)) {
        conditions.push({ user: user });
    }

    if (!utils.isEmpty(date)) {
        conditions.push({ '$where': 'this.created_at.toJSON().slice(0, 10) == "' + date + '"' });
    }

    query = { $and: conditions };

    AssetBank.find(query).populate("user").populate("category").then((assetBanks) => {
        res.status(200).send({ result: 1, data: assetBanks });
    }).catch((err) => {
        if (err) {
            if (err.name && err.name == 'CastError') {
                res.status(500).send({ result: 1, data: [] });
                return;
            }
            res.status(500).send({ result: 0, message: err });
            return;
        }
    });
};

exports.delAssetBank = (req, res) => {
    const assetBank = req.body.id;
    AssetBank.updateMany({ _id: assetBank }, { deleted: true }, {
        new: false
    }, function (err, assetBank) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'AssetBank was deleted successfully!' });
    });
};

exports.changeUser = (req, res) => {
    const user = req.body.user;
    // user
    User.findOne({
        _id: user
    }).exec((err, userItem) => {

        if (err || !userItem) {
            res.status(400).send({ result: 0, message: "User is not valid!" });
            return;
        }

        const assetBank = req.body.id;
        AssetBank.updateMany({ _id: assetBank }, { user: user }, {
            new: false
        }, function (err, assetBank) {
            if (err) {
                res.status(500).send({ result: 0, message: err });
                return;
            }
            res.status(200).send({ result: 1, message: 'AssetBank User was updated successfully!' });
        });

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
            }).exec((err, userItem) => {

                if (err || !userItem) {
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

exports.updateAssetBank = (req, res) => {
    upload(req, res, function (err) {

        if (err instanceof multer.MulterError) {
            res.status(500).send({ result: 0, message: err.message });
            return;
        } else if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }

        const assetBank = req.body.id;
        AssetBank.find({
            _id: assetBank
        }).exec((err, assetBank) => {
            if (err || assetBank == null || assetBank == undefined || assetBank.length == 0) {
                res.status(404).send({ result: 0, message: "AssetBank Not found!" });
                return;
            }
            
            if (assetBank) {
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
                    }).exec((err, userItem) => {

                        if (err || !userItem) {
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
                                    console.log(req.file);

                                    let update = {
                                        name: req.body.name,
                                        externalLink: req.body.externalLink,
                                        description: req.body.description,
                                        user: req.body.user,
                                        category: req.body.category,
                                        attributeValues: attributeValues,
                                        artist: req.body.artist,
                                        supply: req.body.supply,
                                        blockchain: req.body.blockchain,
                                    };

                                    if (req.file != undefined && req.file.filename == undefined) {
                                        update['asset'] = req.file.filename;
                                    }

                                    AssetBank.findOneAndUpdate({ _id: assetBank }, update, {
                                        new: false
                                    }, function (err, data) {
                                        if (err) {
                                            res.status(500).send({ result: 0, message: err });
                                            return;
                                        }
                                        res.status(200).send({ result: 1, message: 'AssetBank was updated successfully!' });
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
                return;
            }
            res.status(404).send({ result: 0, message: "AssetBank Not found!" });
        });

    })
};