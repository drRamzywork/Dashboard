// import { useEffect, useState } from 'react'
// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
// import Icon from 'src/@core/components/icon'
// import { useDropzone } from 'react-dropzone'

// const FileUploaderSingle = ({ onFilesSelected, mainImage }) => {
//   const [previewUrl, setPreviewUrl] = useState(null)
//   const { getRootProps, getInputProps } = useDropzone({
//     multiple: false,

//     accept: {
//       'image/*': ['.png', '.jpg', '.jpeg', '.gif']
//     },
//     onDrop: acceptedFiles => {
//       // Create a blob URL only when a new file is dropped

//       if (acceptedFiles.length > 0) {
//         const newFile = acceptedFiles[0]
//         const newPreviewUrl = URL.createObjectURL(newFile)

//         // Clean up the previous blob URL

//         if (previewUrl) {
//           URL.revokeObjectURL(previewUrl)
//         }
//         setPreviewUrl(newPreviewUrl)

//         onFilesSelected(newFile)

//         // Notify parent component with the new file
//         if (onFilesSelected) {
//           onFilesSelected(newFile)
//         }
//       }
//     }
//   })

//   useEffect(() => {
//     // Clean up the blob URL when the component unmounts

//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl)
//       }
//     }
//   }, [previewUrl])

//   return (
//     <Box {...getRootProps({ className: 'dropzone' })}>
//       <input {...getInputProps()} />
//       {previewUrl ? (
//         <img key={previewUrl} alt='Preview' src={previewUrl} className='single-file-image' />
//       ) : (
//         <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
//           <Icon icon='tabler:upload' fontSize='1.75rem' />
//           <Typography variant='h4'>Drop Main Image here or click to upload.</Typography>
//         </Box>
//       )}
//     </Box>
//   )
// }

// export default FileUploaderSingle

import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import { useDropzone } from 'react-dropzone'

const FileUploaderSingle = ({ onFilesSelected, mainImage }) => {
  // Ensure previewUrl is initialized correctly based on mainImage being undefined or empty
  const initialPreviewUrl = mainImage && mainImage.length > 0 ? `/api/images/${mainImage[0]}` : ''
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const newFile = acceptedFiles[0]
        const newPreviewUrl = URL.createObjectURL(newFile)

        setPreviewUrl(newPreviewUrl)

        // Ensure this is called to notify the parent component
        onFilesSelected(newFile)
      }
    }

    // onDrop: acceptedFiles => {
    //   if (acceptedFiles.length > 0) {
    //     const newFile = acceptedFiles[0]
    //     const newPreviewUrl = URL.createObjectURL(newFile)

    //     // Revoke the object URL to avoid memory leaks
    //     if (previewUrl) {
    //       URL.revokeObjectURL(previewUrl)
    //     }
    //     setPreviewUrl(newPreviewUrl)

    //     // Notify parent component with the new file
    //     if (onFilesSelected) {
    //       onFilesSelected(newFile)
    //     }
    //   }
    // }
  })

  useEffect(() => {
    // Clean up the blob URL when the component unmounts
    return () => {
      if (previewUrl && !initialPreviewUrl.includes(previewUrl)) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, initialPreviewUrl])

  return (
    <Box {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {previewUrl ? (
        <img key={previewUrl} alt='Preview' src={previewUrl} style={{ maxWidth: '100%', maxHeight: '300px' }} />
      ) : (
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Icon icon='tabler:upload' fontSize='1.75rem' />
          <Typography variant='h4'>Drop Main Image here or click to upload.</Typography>
        </Box>
      )}
    </Box>
  )
}

export default FileUploaderSingle
