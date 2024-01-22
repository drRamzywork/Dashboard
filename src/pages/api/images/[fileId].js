import { GridFSBucket, ObjectId } from 'mongodb'
import dbConnect from '@server/utils/dbConnect'

export default async function handler(req, res) {
  try {
    const { fileId } = req.query
    const { connClient } = await dbConnect()

    const bucket = new GridFSBucket(connClient.db('blog'), {
      bucketName: 'uploads'
    })

    if (!ObjectId.isValid(fileId)) {
      res.status(400).send('Invalid file ID')

      return
    }

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))

    downloadStream.on('data', chunk => {
      res.write(chunk)
    })

    downloadStream.on('error', () => {
      res.status(404).send('File not found')
    })

    downloadStream.on('end', () => {
      res.end()
    })
  } catch (error) {
    console.error('Image Retrieval Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}
