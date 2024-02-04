import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { toast } from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import axios from 'axios';

const EditBlog = ({ initialBlogData }) => {
  const [formData, setFormData] = useState(initialBlogData)
  const router = useRouter()
  const { id } = router.query // Assuming you're using the blog ID in the URL

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Define other handlers like handleFileUpload, resizeAndConvertImage, etc.

  const handleSubmit = async (e) => {
    e.preventDefault()

  }

  // Populate the form with the initial data
  useEffect(() => {
    if (initialBlogData) {
      setFormData(initialBlogData)
    }
  }, [initialBlogData])

  // Render your form with pre-populated data
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields and uploaders similar to your original setup, but initialized with existing data */}
    </form>
  )
}

// Fetch blog data for editing
export async function getServerSideProps(context) {
  const { id } = context.params

  const data = JSON.stringify({
    collection: 'blogs',
    database: 'dashboard-db',
    dataSource: 'Cluster0'
  })

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://data.mongodb-api.com/app/data-yhygn/endpoint/data/v1/action/find',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': 'Mmg9Q0QiZkSIpthlGX1zIYY7GS2NHj7iEtz16skuqlbCIJGDDIUDmyw1xLLmAGkL'
    },
    data: data
  }

  const response = await axios.request(config)
  const initialBlogData = response.data.documents // Assuming the response has a 'documents' field


  return {
    props: { initialBlogData }, // will be passed to the page component as props
  }
}

export default EditBlog
