// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import CardSnippet from 'src/@core/components/card-snippet'
import * as source from 'src/views/forms/form-elements/file-uploader/FileUploaderSourceCode'
import FileUploaderSingle from 'src/views/forms/form-elements/file-uploader/FileUploaderSingle'
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import { toast } from 'react-hot-toast'
import CircularProgress from '@mui/material/CircularProgress'
import { useRouter } from 'next/router'
import Pica from 'pica'

const FormLayoutsCollapsible = () => {
  // ** States

  const router = useRouter()

  const [selectedFiles, setSelectedFiles] = useState({
    mainImage: [],
    galleryImages: []
  })

  const [loader, setLoader] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    brefDesc: '',
    fullDesc: '',
    qoute: '',
    contentWriter: '',
    secTitle: '',
    secDesc: '',
    category: '',
    youtubeURL: '',
    mainImage: [],
    blogImagesGallery: []
  })

  const handleMainImageSelected = file => {
    setSelectedFiles({ ...selectedFiles, mainImage: file }) // Pass the single file directly
  }

  const handleGalleryImagesSelected = files => {
    setSelectedFiles({ ...selectedFiles, galleryImages: files })
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  function fetchWithTimeout(resource, options = {}) {
    const { timeout = 120000 } = options // Extend timeout to 2 minutes as an example
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    return fetch(resource, {
      ...options,
      signal: controller.signal
    })
      .then(response => {
        clearTimeout(id)
        return response
      })
      .catch(error => {
        clearTimeout(id)
        throw error
      })
  }

  const resizeAndConvertImage = async file => {
    const pica = Pica()

    // Create an off-screen canvas
    const offScreenCanvas = document.createElement('canvas')
    const ctx = offScreenCanvas.getContext('2d')

    // Load the image
    const image = new Image()
    const reader = new FileReader()

    // This will return a promise that resolves with the resized and converted blob
    return new Promise((resolve, reject) => {
      reader.onload = e => {
        image.onload = async () => {
          // Set canvas size to the target size
          offScreenCanvas.width = 1024 // or whatever size you need
          offScreenCanvas.height = (image.height / image.width) * 1024 // Maintain aspect ratio

          // Resize the image using Pica
          await pica.resize(image, offScreenCanvas, {
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2
          })

          // Convert canvas to WebP blob
          offScreenCanvas.toBlob(
            blob => {
              resolve(blob)
            },
            'image/webp',
            0.9
          ) // Adjust quality as needed
        }

        image.src = e.target.result
      }

      reader.onerror = error => reject(error)

      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = async file => {
    try {
      const resizedImageBlob = await resizeAndConvertImage(file)
      if (!resizedImageBlob) {
        console.error('Failed to resize and convert image')
        return null
      }

      const formData = new FormData()
      formData.append('file', resizedImageBlob, 'image.webp')

      const response = await fetchWithTimeout('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        console.error('Network response was not ok.', response.statusText)
        return null
      }

      const data = await response.json()
      if (data.fileIds && data.fileIds.length > 0) {
        console.log('File uploaded successfully:', data.fileIds[0])
        return data.fileIds[0] // Assuming you want the first file ID
      } else {
        console.error('File IDs not found in response:', data)
        return null
      }
    } catch (error) {
      console.error('Error in file processing or upload:', error)
      return null
    }
  }

  // const handleFileUpload = async file => {
  //   const formData = new FormData()
  //   formData.append('file', file)

  //   try {
  //     const response = await fetchWithTimeout('/api/upload', {
  //       method: 'POST',
  //       body: formData
  //     })

  //     console.log(response, 'RESSSSSSSSSS')

  //     const data = await response.json()

  //     return data.fileId
  //   } catch (error) {
  //     if (error.name === 'AbortError') {
  //       console.error('File upload aborted due to timeout')
  //     } else {
  //       console.error('Error msg in file upload:', error)
  //     }
  //     throw error
  //   }
  // }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoader(true)

    try {
      const uploadPromises = selectedFiles.mainImage ? [handleFileUpload(selectedFiles.mainImage)] : []
      uploadPromises.push(...selectedFiles.galleryImages.map(file => handleFileUpload(file)))

      const uploadResults = await Promise.all(uploadPromises)

      // Assuming uploadResults contains IDs or paths for the uploaded files
      let finalData = { ...formData }
      if (selectedFiles.mainImage) {
        finalData.mainImage = uploadResults.shift() // Adjust based on your API response structure
      }
      if (selectedFiles.galleryImages.length > 0) {
        finalData.blogImagesGallery = uploadResults
      }

      // Now, proceed to create the blog post with the finalData including uploaded file references
      const response = await fetch('/api/create-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalData)
      })
      console.log(finalData, 'RORORORO')

      console.log(response, 'RORORORO')
      if (response.status === 201) {
        setLoader(false)
        toast.success('Blog submitted successfully!')
      }
      // router.reload()
    } catch (error) {
      console.error('Error during form submission:', error)
      toast.error('Blog submission failed. Please try again.')
      setLoader(false)
    }
  }

  return (
    <form>
      <Grid sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              label='Blog title'
              placeholder='Blog title'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              name='brefDesc'
              value={formData.brefDesc}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              label='Blog short descreption'
              placeholder='short descreption'
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              value={formData.fullDesc}
              name='fullDesc'
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              label='Blog descreption'
              placeholder='Long descreption'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              name='qoute'
              value={formData.qoute}
              onChange={handleInputChange}
              fullWidth
              label='qoute'
              placeholder='qoute'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              name='contentWriter'
              value={formData.contentWriter}
              onChange={handleInputChange}
              fullWidth
              label='Content Writer name'
              placeholder='Content Writer name'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              name='secTitle'
              value={formData.secTitle}
              onChange={handleInputChange}
              fullWidth
              label='Second title'
              placeholder='Second  title'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              name='youtubeURL'
              value={formData.youtubeURL}
              onChange={handleInputChange}
              fullWidth
              label='Youtube Url'
              placeholder='Youtube Url'
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              name='secDesc'
              value={formData.secDesc}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              label='Second Desc '
              placeholder='Second Desc '
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              name='category'
              value={formData.category}
              onChange={handleInputChange}
              select
              fullWidth
              label='Category'
              id='form-layouts-collapsible-select'
              defaultValue=''
            >
              <MenuItem value='TEAMWORK'>TEAMWORK</MenuItem>
              <MenuItem value='IDEAS'>IDEAS</MenuItem>
              <MenuItem value='WORKSPACE'>WORKSPACE</MenuItem>
              <MenuItem value='BUSINESS TIPS'>BUSINESS TIPS</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid item xs={12} sm={12}>
            <DropzoneWrapper>
              <Grid container spacing={6} className='match-height'>
                <Grid item xs={12}>
                  <CardSnippet
                    title='Upload Blog gallery Images '
                    code={{
                      tsx: null,
                      jsx: source.FileUploaderMultipleJSXCode
                    }}
                  >
                    <FileUploaderMultiple onFilesSelected={handleGalleryImagesSelected} />
                  </CardSnippet>
                </Grid>

                <Grid item xs={12}>
                  <CardSnippet
                    title='Upload Blog Main Image '
                    code={{
                      tsx: null,
                      jsx: source.FileUploaderSingleJSXCode
                    }}
                  >
                    <FileUploaderSingle onFilesSelected={handleMainImageSelected} />
                  </CardSnippet>
                </Grid>
              </Grid>
            </DropzoneWrapper>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Button variant='contained' endIcon={<Icon icon='tabler:send' />} onClick={handleSubmit}>
              {loader ? <CircularProgress color='inherit' /> : 'Save & uplpoad'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

export default FormLayoutsCollapsible
