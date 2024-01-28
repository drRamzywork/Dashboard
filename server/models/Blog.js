import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema({
  title: String,
  brefDesc: String,
  fullDesc: String,
  quote: String,
  contentWriter: String,
  secTitle: String,
  secDesc: String,
  category: String,
  youtubeURL: String,
  qoute: String,
  mainImage: [String],
  blogImagesGallery: [String]
})

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
