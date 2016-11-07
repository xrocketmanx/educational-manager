var multer = require('multer');
var fs = require('fs');

module.exports = function(destinationPath) {
    var FILENAME_TEMPLATE = /(.*)(\..*)/;

    var upload = multer({ storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
            var filename = file.originalname.match(FILENAME_TEMPLATE);
            cb(null, filename[1] + '-' + Date.now() + filename[2]);
        }
    })});
    var remove = function(filename) {
        if (filename) {
            fs.unlinkSync(destinationPath + filename);
        }
    };

    return {
        upload: upload,
        remove: remove
    };
};