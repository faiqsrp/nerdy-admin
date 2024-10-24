'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useSession } from 'next-auth/react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Vars
const initialData = {
  email: '',
  password: '',
  name: '',
  doj: '',
  manager: '',
  company: '',
  department: '',
  country: '',
  employeeId: ''
}

const UpdateUserDrawer = props => {
  // Props
  const { open, handleClose, userData, setData } = props

  // States
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(true)

  // Hooks
  const { data: session } = useSession()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: initialData
  })

  const createUser = async newUser => {
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/users/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `${session?.user?.token}`
        },
        body: JSON.stringify(newUser)
      })

      if (!response.ok) {
        const errorData = await response.json()

        console.error('Error creating user:', errorData.message || 'Failed to create user')
        setLoading(false)

        return
      }

      const result = await response.json()

      setData([...(userData ?? []), result])
      setLoading(false)
      handleClose()
      setFormData(initialData)
      resetForm(initialData)
    } catch (error) {
      console.error('Error creating user:', error)
      setLoading(false)
    }
  }

  const onSubmit = data => {
    const newUser = {
      email: data.email,
      password: data.password,
      name: data.name,
      doj: data.doj,
      manager: data.manager,
      company: data.company,
      department: data.department,
      country: data.country,
      employeeId: data.employeeId
    }

    createUser(newUser)
  }

  const handleReset = () => {
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Update User Details</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='text'
                label='Full Name'
                placeholder='Enter Full Name'
                {...(errors.name && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='employeeId'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Employee ID'
                type='number'
                placeholder='Enter Employee ID'
                {...(errors.employeeId && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Email Address'
                placeholder='Enter Email Address'
                {...(errors.email && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='company'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='text'
                label='Company'
                placeholder='Select Company'
                {...(errors.company && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='department'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='text'
                label='Department'
                placeholder='Select Department'
                {...(errors.department && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='roleName'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='text'
                label='Role'
                placeholder='Select Role'
                {...(errors.roleName && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='country'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='text'
                label='Country'
                placeholder='Select Country'
                {...(errors.country && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='doj'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='date'
                label='Date of joining'
                placeholder='Select Date of joining'
                {...(errors.doj && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='manager'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='text'
                label='Line Manager'
                placeholder='Select Line Manager'
                {...(errors.manager && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Save
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default UpdateUserDrawer
