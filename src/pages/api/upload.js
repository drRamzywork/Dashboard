import { IncomingForm } from 'formidable'
import fs from 'fs'
import { GridFSBucket } from 'mongodb'
import dbConnect from '@server/utils/dbConnect'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function uploadHandler(req, res) {
  const { connClient } = await dbConnect()

  const bucket = new GridFSBucket(connClient.db('blog'), {
    bucketName: 'uploads'
  })

  const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true })

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err)
      res.status(500).json({ error: 'Error parsing the files' })

      return
    }

    // Handle file processing
    if (files.file) {
      const file = Array.isArray(files.file) ? files.file[0] : files.file
      const readStream = fs.createReadStream(file.filepath)
      const uploadStream = bucket.openUploadStream(file.originalFilename)

      readStream.pipe(uploadStream)

      uploadStream.on('error', () => {
        res.status(500).send('Error uploading file to GridFS')
      })

      uploadStream.on('finish', () => {
        fs.unlink(file.filepath, err => {
          if (err) console.error('Error deleting temp file', err)
        })
        res.status(201).send({ message: 'File uploaded successfully to GridFS', fileId: uploadStream.id })
      })
    } else {
      res.status(400).json({ error: 'No file uploaded' })
    }
  })
}
