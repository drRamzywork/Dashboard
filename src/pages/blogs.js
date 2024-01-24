import React from 'react'
import dbConnect from '../../server/utils/dbConnect'
import Blog from '../../server/models/Blog'

const BlogPage = ({ blogs }) => {
  //

  return (
    <div>
      <h1>Blogs</h1>
      {blogs.map(blog => (
        <div key={blog._id}>
          <img width={200} height={200} src={`/api/images/${blog.mainImage}`} alt='Uploaded' />
          <img width={200} height={200} src={`/api/images/${blog.blogImageGallery}`} alt='Uploaded' />

          <h2>{blog.title}</h2>

          <p>{blog.content}</p>
          {/* Render other blog details */}
        </div>
      ))}
    </div>
  )
}

export async function getServerSideProps() {
  await dbConnect()

  const result = await Blog.find({})

  const blogs = result.map(doc => {
    const blog = doc.toObject()
    blog._id = blog._id.toString()

    if (blog.createdAt) blog.createdAt = blog.createdAt.toISOString()
    if (blog.updatedAt) blog.updatedAt = blog.updatedAt.toISOString()

    return blog
  })

  return { props: { blogs } }
}

export default BlogPage
