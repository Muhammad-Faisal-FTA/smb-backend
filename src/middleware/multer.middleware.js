import multer from "multer";

const Storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, "./public/temp")
  },


  filename: function (req, file, callBack) {
    callBack(null, file.originalname);
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // callBack(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: Storage, })
 
export default  upload  