const multer = require('multer');
const path = require('path');
const db = require("../models");
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
    res.status(200).send({ result: 1 });
};

exports.delAssetBank = (req, res) => {
    res.status(200).send({ result: 1 });
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

        console.log(req.file);
        if(req.file == undefined || req.file.filename == undefined) {
            res.status(500).send({ result: 0, message: 'Invalid Asset' });
            return;
        }

        const assetBank = new AssetBank({
            asset: req.file.filename,
            name: req.body.name,
            externalLink: req.body.externalLink,
            description: req.body.description,
            userId: req.body.userId,
            categoryId: req.body.categoryId,
            attributeValues: req.body.attributeValues,
            artist: req.body.artist,
            supply: req.body.supply,
            blockchain: req.body.blockchain,
        });

        assetBank.save((err, category) => {
            if (err) {
                res.status(500).send({ result: 0, message: err.message });
                return;
            }

            res.send({ result: 1, message: "AssetBank was created successfully!" });
        });

    })
};