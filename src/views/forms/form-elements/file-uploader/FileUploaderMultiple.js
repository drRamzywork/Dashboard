import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

// Helper function to convert image ID to URL
const getImageUrlById = id => `/api/images/${id}`

const FileUploaderMultiple = ({ onFilesSelected, galleryImages = [] }) => {
  // Initialize fileData with galleryImages if provided
  const initialFileData = galleryImages.map((id, index) => ({
    id: `existing_${id}_${index}`, // Create a unique ID for key prop
    previewUrl: getImageUrlById(id), // Convert ID to URL
    isExisting: true // Flag to indicate this is an existing image, not a new upload
  }))

  const [fileData, setFileData] = useState(initialFileData)

  const onDrop = acceptedFiles => {
    const newFileData = acceptedFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: `new_${file.name}_${Date.now()}`, // Ensure unique ID for new uploads
      isExisting: false
    }))

    setFileData(currentData => [...currentData, ...newFileData])
    onFilesSelected([...galleryImages, ...acceptedFiles]) // Update parent component with new files
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  useEffect(() => {
    // Cleanup URLs for new uploads only
    return () =>
      fileData.forEach(f => {
        if (!f.isExisting) URL.revokeObjectURL(f.previewUrl)
      })
  }, [fileData])

  // const handleRemoveFile = async targetFileData => {
  //   if (targetFileData.isExisting) {
  //     const result = await deleteImageById(targetFileData.id)
  //     if (result) {
  //       // Successfully deleted from the server, now update local state
  //       const remainingFiles = fileData.filter(file => file.id !== targetFileData.id)
  //       setFileData(remainingFiles) // Update with remaining files

  //       // Convert remainingFiles to the expected format for the parent component
  //       const updatedIds = remainingFiles
  //         .filter(file => file.isExisting)
  //         .map(file => file.id.replace(/^existing_/, '').replace(/_\d+$/, ''))
  //       onFilesSelected(updatedIds) // Inform parent component
  //     } else {
  //       console.error('Failed to remove image from the server:', targetFileData.id)
  //     }
  //   } else {
  //     // For newly added files, just update the local state
  //     const remainingFiles = fileData.filter(file => file.id !== targetFileData.id)
  //     setFileData(remainingFiles) // This won't affect the backend or the initial galleryImages state in the parent component
  //   }
  // }

  const handleRemoveFile = async targetFileData => {
    if (targetFileData.isExisting) {
      const result = await deleteImageById(targetFileData.id)
      if (result) {
        // Successfully deleted from the server, now update local state
        const updatedFileData = fileData.filter(file => file.id !== targetFileData.id)
        setFileData(updatedFileData) // Update local component state

        // Prepare IDs for the parent component. Ensure this step accurately reflects the remaining file IDs.
        const remainingIds = updatedFileData
          .filter(file => file.isExisting) // Consider only existing files that are kept
          .map(file => file.id.replace(/^existing_/, '').split('_')[0]) // Adjust ID extraction based on your ID format

        onFilesSelected(remainingIds) // Update the parent component
      } else {
        console.error('Failed to remove image from the server:', targetFileData.id)
      }
    } else {
      // Handle newly added files that haven't been saved to the server
      const updatedFileData = fileData.filter(file => file.id !== targetFileData.id)
      setFileData(updatedFileData)

      // If you need to update the parent about newly added files as well, repeat the ID preparation and update here
    }
  }

  const handleRemoveAllFiles = async () => {
    // Filter out existing images for deletion
    const existingImages = fileData.filter(f => f.isExisting)

    // Assuming file IDs need cleanup to extract the actual MongoDB ObjectId
    const existingImageIds = existingImages.map(file => file.id.replace(/^existing_/, '').replace(/_\d+$/, ''))

    // Map each file ID to a fetch call to your DELETE endpoint
    const deletePromises = existingImageIds.map(fileId =>
      fetch(`/api/images/${fileId}`, {
        method: 'DELETE'
      })
    )

    try {
      // Await all fetch calls
      const results = await Promise.all(deletePromises)

      // Check all responses for success
      const allDeleted = results.every(response => response.ok)

      if (allDeleted) {
        setFileData([])
      } else {
        console.error('Not all files were deleted successfully.')
      }
    } catch (error) {
      console.error('Failed to delete files:', error)
    }
  }

  const deleteImageById = async imageId => {
    const cleanImageId = imageId.replace(/^existing_/, '').replace(/_\d+$/, '')

    try {
      const response = await fetch(`/api/images/${cleanImageId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete the image.')
      console.log('Image deleted successfully:', cleanImageId)
      toast.success(`Image deleted successfully:${cleanImageId}`)

      return true
    } catch (error) {
      return false
    }
  }

  const renderFileList = () =>
    fileData.map(fData => (
      <ListItem key={fData.id}>
        <div className='file-details'>
          <div className='file-preview'>
            <img width={38} height={38} alt='Preview' src={fData.previewUrl} />
          </div>
          <Typography className='file-name'>{fData.file ? fData.file.name : 'Existing Image'}</Typography>
          <Typography className='file-size' variant='body2'>
            {fData.file ? `${Math.round(fData.file.size / 1024)} kb` : 'N/A'}
          </Typography>
          <IconButton onClick={() => handleRemoveFile(fData)}>
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </div>
      </ListItem>
    ))

  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Icon icon='tabler:upload' fontSize='1.75rem' />
          <Typography variant='h4'>Drop files here or click to upload.</Typography>
        </Box>
      </div>
      {fileData.length > 0 && (
        <>
          <List>{renderFileList()}</List>
          <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
            Remove All
          </Button>
        </>
      )}
    </>
  )
}

export default FileUploaderMultiple
