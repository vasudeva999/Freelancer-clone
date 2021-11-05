const path = require("path")
const multer = require("multer")


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
        let ext = path.extname(file.originalname)
		cb(null, file.fieldname + '-' + Date.now() + "." + file.mimetype.split("/")[1])
	}
});

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
        callback(null, true)
        // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
        //     callback(null, true)
        // }else {
        //     console.log("only jpg and png file supported!");
        //     callback(null, false)
        // }
    }
})

module.exports = upload