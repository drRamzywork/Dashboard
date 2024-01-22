import { useState } from 'react'

const BlogForm = () => {
  const [uploadedImageId, setUploadedImageId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    brefDesc: '',
    mainImage: '',
    blogImagesGallery: [],
    hashContent: ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleGalleryChange = e => {
    setFormData({
      ...formData,
      blogImagesGallery: e.target.files
    })
  }

  const handleFileUpload = async file => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      // Adjust the endpoint as needed
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text() // Fetching more detailed error message
      console.error('Upload Error Response:', errorText)
      throw new Error(`File upload failed: ${response.statusText}`)
    }

    const data = await response.json()

    return data.fileId // Use the fileId returned by the API
  }

  const handleSubmit = async e => {
    e.preventDefault()

    let imageIds = []
    if (formData.blogImagesGallery.length > 0) {
      imageIds = await Promise.all([...formData.blogImagesGallery].map(file => handleFileUpload(file)))
    }

    if (imageIds.length > 0) {
      setUploadedImageId(imageIds[0])
    }

    const completeFormData = {
      ...formData,
      blogImagesGallery: imageIds
    }

    // Finally, send the complete form data to your API
    const response = await fetch('/api/create-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(completeFormData)
    })

    const responseData = await response.json()
    console.log(responseData, 'response')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type='text' name='title' value={formData.title} onChange={handleInputChange} placeholder='Blog Title' />

      <input type='file' name='blogImagesGallery' multiple onChange={handleGalleryChange} />
      <hr />
      {uploadedImageId && <img width={200} height={200} src={`/api/images/${uploadedImageId}`} alt='Uploaded' />}
      <hr />

      {console.log(uploadedImageId, 'uploadedImageIduploadedImageIduploadedImageId')}
      <button type='submit'>Create Blog</button>
    </form>
  )
}

export default BlogForm
