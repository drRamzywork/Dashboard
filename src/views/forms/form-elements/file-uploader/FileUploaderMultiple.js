import { Fragment, useEffect, useState } from 'react'
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const newFileData = acceptedFiles.map((file, index) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: file.name + '_' + index // create a unique id for each file
      }))
      setFileData(currentData => [...currentData, ...newFileData])
    }
  })

  useEffect(() => {
    if (onFilesSelected) {
      onFilesSelected(fileData.map(f => f.file))
    }

    return () => {
      fileData.forEach(f => URL.revokeObjectURL(f.previewUrl))
    }
  }, [fileData, onFilesSelected])

  const renderFilePreview = fData => {
    if (fData.file.type.startsWith('image')) {
      return <img width={38} height={38} alt={fData.file.name} src={fData.previewUrl} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = targetFileData => {
    URL.revokeObjectURL(targetFileData.previewUrl)
    setFileData(currentData => currentData.filter(f => f.id !== targetFileData.id))
  }

  const fileList = fileData.map(fData => (
    <ListItem key={fData.id}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(fData)}</div>
        <Typography className='file-name'>{fData.file.name}</Typography>
        <Typography className='file-size' variant='body2'>
          {Math.round(fData.file.size / 100) / 10 > 1000
            ? `${(Math.round(fData.file.size / 100) / 10000).toFixed(1)} mb`
            : `${(Math.round(fData.file.size / 100) / 10).toFixed(1)} kb`}
        </Typography>
        <IconButton onClick={() => handleRemoveFile(fData)}>
          <Icon icon='tabler:x' fontSize={20} />
        </IconButton>
      </div>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    fileData.forEach(f => URL.revokeObjectURL(f.previewUrl))
    setFileData([])
  }

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Box
            sx={{
              mb: 8.75,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
            }}
          >
            <Icon icon='tabler:upload' fontSize='1.75rem' />
          </Box>
          <Typography variant='h4' sx={{ mb: 2.5 }}>
            Drop files here or click to upload.
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            (This is just a demo drop zone. Selected files are not actually uploaded.)
          </Typography>
        </Box>
      </div>{' '}
      {fileData.length ? (
        <Fragment>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default FileUploaderMultiple

// import { Fragment, useEffect, useState } from 'react'
// import Box from '@mui/material/Box'
// import List from '@mui/material/List'
// import Button from '@mui/material/Button'
// import ListItem from '@mui/material/ListItem'
// import Typography from '@mui/material/Typography'
// import IconButton from '@mui/material/IconButton'
// import Icon from 'src/@core/components/icon'
// import { useDropzone } from 'react-dropzone'

// const FileUploaderMultiple = ({ onFilesSelected }) => {
//   const [files, setFiles] = useState([])
//   const [previewUrls, setPreviewUrls] = useState({})

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: acceptedFiles => {
//       setFiles(prevFiles => [...prevFiles, ...acceptedFiles])
//     }
//   })

//   useEffect(() => {
//     // Create blob URLs for new files
//     const newUrls = files.reduce((acc, file) => {
//       if (!previewUrls[file.name]) {
//         acc[file.name] = URL.createObjectURL(file)
//       }
//       return acc
//     }, {})

//     setPreviewUrls(prevUrls => ({ ...prevUrls, ...newUrls }))

//     // Notify parent component
//     if (onFilesSelected) {
//       onFilesSelected(files)
//     }

//     // Clean up blob URLs when files are removed or when the component unmounts
//     return () => {
//       Object.values(newUrls).forEach(url => URL.revokeObjectURL(url))
//     }
//   }, [files, onFilesSelected, previewUrls])

//   const renderFilePreview = file => {
//     if (file.type.startsWith('image')) {
//       return <img width={38} height={38} alt={file.name} src={previewUrls[file.name]} />
//     } else {
//       return <Icon icon='tabler:file-description' />
//     }
//   }

//   const handleRemoveFile = file => {
//     setFiles(prevFiles => prevFiles.filter(f => f.name !== file.name))
//     setPreviewUrls(prevUrls => {
//       const newUrls = { ...prevUrls }
//       URL.revokeObjectURL(newUrls[file.name])
//       delete newUrls[file.name]
//       return newUrls
//     })
//   }

//   const fileList = files.map(file => (
//     <ListItem key={file.name}>
//       <div className='file-details'>
//         <div className='file-preview'>{renderFilePreview(file)}</div>
//         <div>
//           <Typography className='file-name'>{file.name}</Typography>
//           <Typography className='file-size' variant='body2'>
//             {/* File size calculation */}
//           </Typography>
//         </div>
//       </div>
//       <IconButton onClick={() => handleRemoveFile(file)}>
//         <Icon icon='tabler:x' fontSize={20} />
//       </IconButton>
//     </ListItem>
//   ))

//   const handleRemoveAllFiles = () => {
//     Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url))
//     setPreviewUrls({})
//     setFiles([])
//   }

//   return (
//     <Fragment>
//       <div {...getRootProps({ className: 'dropzone' })}>
//         <input {...getInputProps()} />
//         <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
//           <Box
//             sx={{
//               mb: 8.75,
//               width: 48,
//               height: 48,
//               display: 'flex',
//               borderRadius: 1,
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
//             }}
//           >
//             <Icon icon='tabler:upload' fontSize='1.75rem' />
//           </Box>
//           <Typography variant='h4' sx={{ mb: 2.5 }}>
//             Drop files here or click to upload.
//           </Typography>
//           <Typography sx={{ color: 'text.secondary' }}>
//             (This is just a demo drop zone. Selected files are not actually uploaded.)
//           </Typography>
//         </Box>
//       </div>{' '}
//       {files.length ? (
//         <Fragment>
//           <List>{fileList}</List>
//           <div className='buttons'>
//             <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
//               Remove All
//             </Button>
//           </div>
//         </Fragment>
//       ) : null}
//     </Fragment>
//   )
// }

// export default FileUploaderMultiple
