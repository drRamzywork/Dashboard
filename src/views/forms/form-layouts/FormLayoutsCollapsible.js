// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Accordion from '@mui/material/Accordion'
import FormLabel from '@mui/material/FormLabel'
import Typography from '@mui/material/Typography'
import RadioGroup from '@mui/material/RadioGroup'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import Payment from 'payment'
import Cards from 'react-credit-cards'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import CardSnippet from 'src/@core/components/card-snippet'
import * as source from 'src/views/forms/form-elements/file-uploader/FileUploaderSourceCode'
import FileUploaderSingle from 'src/views/forms/form-elements/file-uploader/FileUploaderSingle'
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import FileUploaderRestrictions from 'src/views/forms/form-elements/file-uploader/FileUploaderRestrictions'

const FormLayoutsCollapsible = () => {
  // ** States
  const [cvc, setCvc] = useState('')

  const [focus, setFocus] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cardNumber, setCardNumber] = useState('')

  const [expanded, setExpanded] = useState('panel1')

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const handleBlur = () => setFocus('')

  // ==============================================================
  const [selectedFiles, setSelectedFiles] = useState({
    mainImage: null,
    galleryImages: []
  })

  // const handleFilesSelected = (files, type) => {
  //   if (type === 'mainImage' && files[0] !== selectedFiles.mainImage) {
  //     setSelectedFiles({ ...selectedFiles, mainImage: files[0] })
  //   } else if (type === 'galleryImages' && files !== selectedFiles.galleryImages) {
  //     setSelectedFiles({ ...selectedFiles, galleryImages: files })
  //   }
  // }

  const handleFilesSelected = (files, type) => {
    if (type === 'mainImage') {
      setSelectedFiles({ ...selectedFiles, mainImage: files[0] || null })
    } else if (type === 'galleryImages') {
      setSelectedFiles({ ...selectedFiles, galleryImages: files })
    }
  }

  const [formData, setFormData] = useState({
    title: '',
    brefDesc: '',
    fullDesc: '',
    qoute: '',
    contentWriter: '',
    secTitle: '',
    secDesc: '',
    category: '',
    mainImage: [],
    blogImagesGallery: []
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileUpload = async file => {
    const formData = new FormData()
    formData.append('file', file)

    console.log(file, 'FILELEEE')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload Error Response:', errorText)
        throw new Error(`File upload failed: ${response.statusText}`)
      }

      console.log(response)
      const data = await response.json()
      return data.fileId
    } catch (error) {
      console.error('Error in file upload:', error)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log('Gallery Images Before Upload:', selectedFiles.galleryImages)

    try {
      // Initialize an object to collect the final data
      let finalData = { ...formData }

      // Handle main image upload
      if (selectedFiles.mainImage) {
        const mainImageId = await handleFileUpload(selectedFiles.mainImage)
        finalData.mainImage = mainImageId
      }

      // Handle gallery images upload
      if (selectedFiles.galleryImages.length > 0) {
        const galleryImageIds = await Promise.all(selectedFiles.galleryImages.map(file => handleFileUpload(file)))
        finalData.blogImagesGallery = galleryImageIds
      }

      // Now, finalData contains all text fields and image IDs/URLs
      console.log(finalData, 'finalData')
      // Send the complete form data to your API
      const response = await fetch('/api/create-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalData)
      })

      const responseData = await response.json()
      console.log(responseData, 'response')
    } catch (error) {
      console.error('Error in form submission:', error)
      // Handle submission error
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
              name='qoute'
              value={formData.qoute}
              onChange={handleInputChange}
              fullWidth
              label='Quote'
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
                <Grid item xs={6}>
                  <CardSnippet
                    title='Upload Blog gallery Images '
                    code={{
                      tsx: null,
                      jsx: source.FileUploaderMultipleJSXCode
                    }}
                  >
                    <FileUploaderMultiple onFilesSelected={files => handleFilesSelected(files, 'galleryImages')} />
                  </CardSnippet>
                </Grid>
                <Grid item xs={6}>
                  <CardSnippet
                    title='Upload Blog Main Image '
                    code={{
                      tsx: null,
                      jsx: source.FileUploaderSingleJSXCode
                    }}
                  >
                    <FileUploaderSingle onFilesSelected={files => handleFilesSelected(files, 'mainImage')} />
                  </CardSnippet>
                </Grid>
              </Grid>
            </DropzoneWrapper>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Button variant='contained' endIcon={<Icon icon='tabler:send' />} onClick={handleSubmit}>
              Save & uplpoad
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

export default FormLayoutsCollapsible
