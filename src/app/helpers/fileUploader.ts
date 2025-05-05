import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import * as fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      '/server/morfitter-backend-deploy/uploads'
      // '/web-development/Back End/shiloh-morfitter-backend/uploads',
    )
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

export const upload = multer({ storage: storage })
