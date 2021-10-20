import crypto from "crypto";
import multer from "multer";
import path from "path";

import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

const upload = multer({
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),

  fileFilter: (request, file, callback) => {
    const filetypes = /jpeg|jpg|png/;

    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return callback(null, true);
    }

    return callback(
      new ErrorWithStatus(
        400,
        `File upload only supports the following filetypes - ${filetypes}`
      )
    );
  },

  limits: {
    fileSize: 2 * (1024 * 1024),
  },
});

export { tmpFolder, upload };
