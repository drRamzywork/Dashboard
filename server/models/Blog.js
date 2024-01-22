import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema({
  title: String,
  brefDesc: String,
  mainImage: String, // URL to the main image
  blogImagesGallery: [String], // Array of URLs to the images in the gallery
  hashContent: String // The hash content of the blog
  // ... other fields ...
})

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
