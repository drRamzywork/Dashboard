import Blog from '@server/models/Blog'
import dbConnect from '@server/utils/dbConnect'
export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const blogs = await Blog.find({}) // Fetch all blogs
      res.status(200).json({ success: true, data: blogs })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }
}
