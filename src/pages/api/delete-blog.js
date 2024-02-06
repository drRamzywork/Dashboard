import { ObjectId } from 'mongodb'
import dbConnect from '@server/utils/dbConnect'
import Blog from '@server/models/Blog'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'DELETE') {
    const { id } = req.query

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' })
    }

    try {
      const blog = await Blog.findById(id)

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' })
      }

      await blog.remove()
      res.status(204).end() // Successful deletion with no content to return
    } catch (error) {
      console.error('Error deleting blog:', error.stack) // Log the error stack for more details
      res.status(500).json({ error: 'Internal Server Error' }) // You might want to generalize the error message
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
