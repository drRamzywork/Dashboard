import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { useDropzone } from 'react-dropzone'

const FileUploaderMultiple = ({ onFilesSelected }) => {
  const [fileData, setFileData] = useState([])

  const onDrop = acceptedFiles => {
    const newFileData = acceptedFiles.map((file, index) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: file.name + '_' + index
    }))

    setFileData(currentData => {
      const updatedFileData = [...currentData, ...newFileData]

      setTimeout(() => {
        if (onFilesSelected) {
          onFilesSelected(updatedFileData.map(f => f.file))
        }
      }, 0)

      return updatedFileData
    })
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleRemoveFile = targetFileData => {
    URL.revokeObjectURL(targetFileData.previewUrl)
    setFileData(currentData => {
      const updatedFileData = currentData.filter(f => f.id !== targetFileData.id)

      setTimeout(() => {
        if (onFilesSelected) {
          onFilesSelected(updatedFileData.map(f => f.file))
        }
      }, 0)

      return updatedFileData
    })
  }
  useEffect(() => {
    return () => {
      fileData.forEach(f => URL.revokeObjectURL(f.previewUrl))
    }
  }, [])

  const handleRemoveAllFiles = () => {
    fileData.forEach(f => URL.revokeObjectURL(f.previewUrl))
    setFileData([])
  }

  const renderFileList = () =>
    fileData.map(fData => (
      <ListItem key={fData.id}>
        <div className='file-details'>
          <div className='file-preview'>
            <img width={38} height={38} alt={fData.file.name} src={fData.previewUrl} />
          </div>
          <Typography className='file-name'>{fData.file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(fData.file.size / 1024)} kb
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
