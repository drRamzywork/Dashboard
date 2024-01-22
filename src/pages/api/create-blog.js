import Blog from '@server/models/Blog'
import dbConnect from '@server/utils/dbConnect'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'POST') {
    try {
      const blog = new Blog(req.body) // Assuming the body has all the necessary blog data
      const savedBlog = await blog.save()
      res.status(201).json(savedBlog)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
