
const FormData = require('form-data');
const dotenv = require('dotenv');
dotenv.config();

exports.upload = (req, res) => {
    const fd = new FormData();
    fd.append("file", Buffer.from(req.file.buffer.toString(), 'base64'), { filename: req.file.originalname });
    var bearer = 'Bearer ' + process.env.nft_api_key;
    const axios = require('axios');
    axios.post(process.env.nft_api_endpoint + "/upload", fd, {
        withCredentials: false,
        headers: {
            'Authorization': bearer,
            'content-type': 'multipart/form-data'
        },
    }).then((response) => {
        res.json(response.data);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err)
    });
};