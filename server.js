const mongoose = require("mongoose");
const express = require("express")
const cloudinary = require("cloudinary").v2;
const bodyParser = require('body-parser');

const multer = require('multer');
var upload = multer({ dest: 'uploads/' })

cloudinary.config({
    cloud_name: 'tutotring',
    api_key: '274767948479987',
    api_secret: '288eL9odJfgTrBDzm-839pqPXSQ'
});

mongoose.connect('mongodb://localhost:27017/testImage', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const schema = new mongoose.Schema({ link: { type: String } });
const Image = mongoose.model('image', schema);

const app = express();
app.set('view engine', 'pug')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const uploadSingle = (file) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, {
                folder: 'single'
            })
            .then(result => {
                if (result) {
                    const fs = require('fs')
                    fs.unlinkSync(file)
                    resolve({
                        url: result.secure_url
                    })
                }
            })
    })
}




app.get("/upload", (req, res) => {
    res.render("upload.pug")
});



app.post("/upload", upload.single("image"), async(req, res) => {
    console.log(req.files);
    const re = await uploadSingle(req.file.path);
    var image = await Image.create({ link: re.url });
    res.status(200).json({
        status: 200,
        image
    })


});


app.listen(80, () => console.log("app run port 80"))