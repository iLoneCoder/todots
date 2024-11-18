import multer from "multer"
import path from "path"
import { v4 as uuidv4 } from "uuid"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../static") )
    },
    filename: (req, file, cb) => {
        const originalname = file.originalname
        const extention = path.extname(originalname)
        const name = originalname.replace(extention, "")

        const newName = `${name}_${uuidv4()}${extention}`
        cb(null, newName)
    }
})


export const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if (file.size > 5 * 1024 * 1024) {
          // If any file exceeds the size limit
          cb(null, false);
        } else {
          cb(null, true); // Allow upload
        }
      },
})