// In one of your Next.js pages/components
import { useEffect, useState } from 'react'

const BlogPage = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch('/api/blogs')
      if (!response.ok) {
        console.error('Failed to fetch blogs')
        return
      }
      const data = await response.json()
      setBlogs(data.data)
    }

    fetchBlogs()
  }, [])

  return (
    <div>
      <h1>Blogs</h1>
      {/* Render blogs here */}
      {blogs.map(blog => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
          {/* Other blog details */}
        </div>
      ))}
    </div>
  )
}

export default BlogPage
