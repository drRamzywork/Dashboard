// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import axios from 'axios'
import toast from 'react-hot-toast'

// ** renders client column

// ** renders client column
const renderClient = row => {
  if (row?.mainImage?.length) {
    return <CustomAvatar src={`/api/images/${row.mainImage}`} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    //

    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const RowOptions = ({ id }) => {
  // ** Hooks
  console.log(id, 'SSSSS')
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  const deleteBlog = async blogId => {
    try {
      const response = await fetch(`/api/delete-blog?id=${blogId}`, {
        method: 'DELETE'
      })

      if (response.status === 204) {
        toast.success('Blog deleted successfully')
      } else if (response.status === 404) {
        console.error('Blog not found')
        toast.error('Blog not found')
      } else {
        console.error('Failed to delete blog')
        toast.error('Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem component={Link} sx={{ '& svg': { mr: 2 } }} href={`/blog/${id}`} onClick={handleRowOptionsClose}>
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem component={Link} href={`/blog/${id}`} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => deleteBlog(id)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.25,
    minWidth: 280,
    field: 'title',
    headerName: 'Blog',
    renderCell: ({ row }) => {
      const { title, secTitle, _id } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href={`/blog/${_id}`}
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {title}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {secTitle}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'secTitle',
    minWidth: 170,
    headerName: 'Second title',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.secTitle}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Category',
    field: 'category',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.category}
        </Typography>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row._id} />
  }
]

const UserList = ({ blogs }) => {
  // ** State
  const [selectedCategory, setSelectedCategory] = useState('Select Category')

  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const [filteredBlogs, setFilteredBlogs] = useState(blogs)
  useEffect(() => {
    setFilteredBlogs(blogs)
  }, [blogs])

  useEffect(() => {
    let filtered = blogs
    if (value) {
      const lowercasedValue = value.toLowerCase()
      filtered = filtered.filter(blog => blog.title.toLowerCase().includes(lowercasedValue))
    }
    if (selectedCategory && selectedCategory !== 'Select Category') {
      filtered = filtered.filter(blog => blog.category === selectedCategory)
    }
    setFilteredBlogs(filtered)
  }, [blogs, value, selectedCategory])

  const handleCategoryChange = e => {
    setSelectedCategory(e.target.value)
  }

  const handleFilter = useCallback(
    val => {
      //

      setValue(val)

      if (!val) {
        // If the search value is empty, reset to show all blogs

        setFilteredBlogs(blogs)

        return
      }

      // Convert the input value to lowercase for case-insensitive comparison
      const lowercasedValue = val.toLowerCase()

      // Filter blogs based on the input value
      const filtered = blogs.filter(blog => blog.title.toLowerCase().includes(lowercasedValue))

      // Update the filteredBlogs state with the filtered results
      setFilteredBlogs(filtered)
    },
    [blogs]
  )
  const uniqueCategories = Array.from(new Set(blogs.map(blog => blog.category))).filter(category => category !== '')

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <CustomTextField select fullWidth value={selectedCategory} onChange={handleCategoryChange}>
                  <MenuItem value='Select Category'>Select Category</MenuItem>
                  {uniqueCategories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ m: '0 !important' }} />

          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />

          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={row => row._id}
            rows={filteredBlogs}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export default UserList

export async function getStaticProps() {
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
  const blogs = response.data.documents // Assuming the response has a 'documents' field

  return {
    props: {
      blogs
    },
    revalidate: 5
  }
}
