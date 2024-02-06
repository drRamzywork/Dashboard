import dbConnect from '@server/utils/dbConnect'
import Blog from '@server/models/Blog'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  const {
    query: { id },
    method
  } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const blog = await Blog.findById(id)
        if (!blog) {
          return res.status(404).json({ success: false, error: 'Blog not found' })
        }
        res.status(200).json({ success: true, data: blog })
      } catch (error) {
        res.status(400).json({ success: false, error: error.message })
      }
      break

    case 'PUT':
      try {
        // Note: Consider validation for req.body here
        const blog = await Blog.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        })
        if (!blog) {
          return res.status(404).json({ success: false, error: 'Blog not found' })
        }
        res.status(200).json({ success: true, data: blog })
      } catch (error) {
        res.status(400).json({ success: false, error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).json({ success: false, error: `Method ${method} Not Allowed` })
  }
}
