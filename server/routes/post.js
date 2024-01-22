import dbConnect from '../../../utils/dbConnect'
import Post from '../models/Post'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'POST') {
    try {
      const post = await Post.create(req.body)
      res.status(201).json({ success: true, data: post })
    } catch (error) {
      res.status(400).json({ success: false })
    }
  } else {
    res.status(405).json({ success: false })
  }
}
