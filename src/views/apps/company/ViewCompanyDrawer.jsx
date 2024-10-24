'use client'

// React Imports
import React, { useState, useEffect } from 'react'

import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// ViewUserDrawer Component
const ViewUserDrawer = ({ open, handleClose, userId }) => {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)

  // Function to fetch user data by ID
  const fetchUserData = async id => {
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/users/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        }
      })

      if (!response.ok) {
        const errorData = await response.json()

        console.error('Error fetching user:', errorData.message || 'Failed to fetch user data')
        setLoading(false)

        return
      }

      const user = await response.json()

      setUserData(user)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user:', error)
      setLoading(false)
    }
  }

  // Fetch user data when the drawer opens
  useEffect(() => {
    if (open && userId) {
      fetchUserData(userId)
    }
  }, [open, userId])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>View User Details</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        {loading ? (
          <Typography variant='body1'>Loading...</Typography>
        ) : userData ? (
          <div className='flex flex-col gap-4'>
            <Typography variant='subtitle1'>Full Name: {userData.name}</Typography>
            <Typography variant='subtitle1'>Employee ID: {userData.employeeId}</Typography>
            <Typography variant='subtitle1'>Email Address: {userData.email}</Typography>
            <Typography variant='subtitle1'>Company: {userData.company}</Typography>
            <Typography variant='subtitle1'>Department: {userData.department}</Typography>
            <Typography variant='subtitle1'>Role: {userData.roleName}</Typography>
            <Typography variant='subtitle1'>Country: {userData.country}</Typography>
            <Typography variant='subtitle1'>Date of Joining: {userData.doj}</Typography>
            <Typography variant='subtitle1'>Line Manager: {userData.manager}</Typography>
          </div>
        ) : (
          <Typography variant='body1'>No user data available.</Typography>
        )}
        <div className='flex items-center gap-4 mt-4'>
          <Button variant='outlined' color='primary' onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default ViewCompanyDrawer
