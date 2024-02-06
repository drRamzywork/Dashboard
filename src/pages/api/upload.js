// import { IncomingForm } from 'formidable'
// import fs from 'fs'
// import { GridFSBucket } from 'mongodb'
// import dbConnect from '@server/utils/dbConnect'

// export const config = {
//   api: {
//     bodyParser: false
//   }
// }

// export default async function uploadHandler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }

//   try {
//     const { connClient } = await dbConnect()

//     const bucket = new GridFSBucket(connClient.db('blog'), {
//       bucketName: 'uploads'
//     })

//     const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true, multiples: true })

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error parsing the form data' })
//       }

//       // Ensure there's at least one file uploaded
//       if (!files.file) {
//         return res.status(400).json({ error: 'No files uploaded' })
//       }

//       // Support for multiple file uploads
//       const fileList = Array.isArray(files.file) ? files.file : [files.file]

//       const uploadPromises = fileList.map(file => {
//         return new Promise((resolve, reject) => {
//           const readStream = fs.createReadStream(file.filepath)
//           const uploadStream = bucket.openUploadStream(file.originalFilename)

//           readStream.pipe(uploadStream)

//           uploadStream.on('error', error => {
//             console.error('Upload stream error:', error)
//             reject(error)
//           })

//           uploadStream.on('finish', () => {
//             fs.unlink(file.filepath, err => {
//               if (err) {
//                 console.error('Error deleting temp file:', err)
//               }
//               resolve(uploadStream.id)
//             })
//           })
//         })
//       })

//       // Await all files to be uploaded
//       try {
//         const fileIds = await Promise.all(uploadPromises)
//         res.status(201).json({ message: 'Files uploaded successfully to GridFS', fileIds })
//       } catch (uploadError) {
//         res.status(500).json({ error: 'Error uploading one or more files to GridFS' })
//       }
//     })
//   } catch (dbError) {
//     console.error('Database connection error:', dbError)
//     res.status(500).json({ error: 'Error connecting to database' })
//   }
// }

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log(req, res, 'SSSSSSSSSSSZZZZZ')

  try {
    const { connClient } = await dbConnect()

    const bucket = new GridFSBucket(connClient.db('blog'), {
      bucketName: 'uploads'
    })

    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true, multiples: true })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing the form data' })
      }

      if (!files.file) {
        return res.status(400).json({ error: 'No files uploaded' })
      }

      const fileList = Array.isArray(files.file) ? files.file : [files.file]

      const uploadPromises = fileList.map(
        file =>
          new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(file.filepath)
            const uploadStream = bucket.openUploadStream(file.originalFilename)

            uploadStream.on('error', error => reject(error))
            uploadStream.on('finish', () => {
              fs.unlink(file.filepath, err => {
                if (err) console.error('Error deleting temp file:', err)
                resolve(uploadStream.id.toString())
              })
            })

            readStream.pipe(uploadStream)
          })
      )

      try {
        const fileIds = await Promise.all(uploadPromises)
        res.status(201).json({ success: true, fileIds: fileIds })
      } catch (uploadError) {
        console.error('Upload error:', uploadError)
        res.status(500).json({ error: 'Error uploading one or more files to GridFS' })
      }
    })
  } catch (dbError) {
    console.error('Database connection error:', dbError)
    res.status(500).json({ error: 'Error connecting to database' })
  }
}
