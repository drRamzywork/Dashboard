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
    quote: '',
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

  const fetchWithTimeout = (resource, options = {}) => {
    const { timeout = 20000 } = options // 20 seconds timeout
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    return fetch(resource, { ...options, signal: controller.signal }).finally(() => clearTimeout(id))
  }

  const handleFileUpload = async file => {
    const formData = new FormData()
    formData.append('file', file)

    console.log(file, 'FFFFF')

    try {
      const response = await fetchWithTimeout('/api/upload', {
        method: 'POST',
        body: formData,
        timeout: 20000
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload Error Response:', errorText)
        throw new Error(`File upload failed: ${response.statusText}`)
      }

      const data = await response.json()

      return data.fileId
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('File upload aborted due to timeout')
      } else {
        console.error('Error in file upload:', error)
      }
      throw error
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoader(true)

    let finalData = { ...formData }

    try {
      const uploadPromises = []

      if (selectedFiles.mainImage) {
        uploadPromises.push(handleFileUpload(selectedFiles.mainImage))
      }

      if (selectedFiles.galleryImages.length > 0) {
        uploadPromises.push(...selectedFiles.galleryImages.map(file => handleFileUpload(file)))
      }

      const uploadResults = await Promise.all(uploadPromises)

      // Assign the results to finalData
      if (selectedFiles.mainImage) {
        finalData.mainImage = uploadResults.shift()
      }

      if (selectedFiles.galleryImages.length > 0) {
        finalData.blogImagesGallery = uploadResults
      }

      // Submit the final data
      try {
        const response = await fetch('/api/create-blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(finalData)
        })
        console.log(response, 'fileIdfileIdfileId2')

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error Response:', errorText)
          setLoader(false)
          throw new Error(`Requesssst failed: ${response.status}`)
        }

        const responseData = await response.json()
        if (responseData) {
          toast.success('Blog submitted successfully!')
          setLoader(false)
          setFormData([])
          router.push('/apps/user/list/')
        }
      } catch (error) {
        console.error('Error in form submission:', error)
        setLoader(false)
        toast.error('Blog submission failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setLoader(false)
      toast.error('Upload failed. Please try again.')
    }
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
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
              name='quote'
              value={formData.qoute}
              onChange={handleInputChange}
              fullWidth
              label='quote'
              placeholder='quote'
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
