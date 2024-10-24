'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { NextResponse } from 'next/server';

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'
import UpdateUserDrawer from './UpdateUserDrawer'
import ViewUserDrawer from './ViewUserDrawer'
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import axios from 'axios'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars
const userRoleObj = {
  admin: { icon: 'ri-vip-crown-line', color: 'error' },
  author: { icon: 'ri-computer-line', color: 'warning' },
  editor: { icon: 'ri-edit-box-line', color: 'info' },
  maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
  subscriber: { icon: 'ri-user-3-line', color: 'primary' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const UserListTable = ({ tableData }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [viewUserOpen, setViewUserOpen] = useState(false)
  const [updateUserOpen, setUpdateUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState()
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [openUpdateDrawer, setOpenUpdateDrawer] = useState(false);
  const [openDeleteDrawer, setOpenDeleteDrawer] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [viewUserId, setViewUserId] = useState(null);

  // Hooks
  const { lang: locale } = useParams() 
  const { data: session} = useSession()

  // Fetch users data
  useEffect(() => {
      const fetchAllUsers = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/users/AllUsers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               token: `${session?.user?.token}`,
            },
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message || 'Failed to fetch users' }, { status: response.status });
          }

          const data = await response.json();
          setData(data.data);
          // setFilteredData(data); 
          setLoading(false);

          return NextResponse.json(data);
        } catch (error) {
          return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
      }
      fetchAllUsers();
    }, [session?.user]);

    const deleteUser = async () => {    
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get('id');
        console.log('id:', id);
    
        if (!id) {
          return NextResponse.json({ error: 'No user ID provided' }, { status: 400 });
        }
    
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/delete/${id}`, {
          headers: {
            'Content-Type': 'application/json',
             token: `${session?.user?.token}`, 
          },
        });
        console.log('Response:', response.data);
    
        if (!response.ok) {
          const errorData = await response.json();
          return NextResponse.json({ error: errorData.message || 'Failed to delete user' }, { status: response.status });
        }
    
        return NextResponse.json(response.data, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    };

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('uniqueID', {
        header: 'Employee ID',
        cell: ({ row }) => <Typography>{row.original.uniqueID ? row.original.uniqueID : 'N/A'}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Typography>{row.original.name}</Typography>
      }),
      columnHelper.accessor('roleName', {
        header: 'Role',
        cell: ({ row }) => <Typography>{row.original.roleName}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email Address',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.email}
          </Typography>
        )
      }),
      columnHelper.accessor('company.companyName', {
        header: 'Company',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.company ? row.original.company.companyName : 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.department ? row.original.department : 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.isActive}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            {/* Delete button */}
            <IconButton
              size='small'
              // onClick={deleteUser(id)}
              onClick={() => setData((prevData) => prevData?.filter(product => product.id !== row.original.id))}
            >
              <i className='ri-delete-bin-7-line text-textSecondary' />
            </IconButton>
            {/* View button */}
            <IconButton
              size='small'
              onClick={() => {
                setOpenViewDrawer(true); 
                setViewUserId(row.original.id); 
              }}>
            <i className='ri-eye-line text-textSecondary' />
            </IconButton>
            {/* Edit button */}
            <IconButton
              size='small'
              onClick={() => {
                setOpenUpdateDrawer(true); 
                setUpdateUserOpen(row.original.id); 
              }}>
            <i className='ri-edit-box-line text-textSecondary' />
            </IconButton>
            {/* Option menu */}
            <OptionMenu
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Download',
                  icon: 'ri-download-box-line',
                },
              ]}
            />
          </div>
        ),
        enableSorting: false,
      })     
      
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, 
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName)}
        </CustomAvatar>
      )
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        <Divider />
        <div className='flex justify-between gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <Button
            color='secondary'
            variant='outlined'
            startIcon={<i className='ri-upload-2-line' />}
            className='max-sm:is-full'
          >
            Export
          </Button>
          <div className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
              className='max-sm:is-full'
            />
            <Button variant='contained' onClick={() => setAddUserOpen(!addUserOpen)} className='max-sm:is-full'>
              Add New User
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
      />
      <ViewUserDrawer
        open={openViewDrawer}
        handleClose={() => setViewUserOpen(!viewUserOpen)}
        userId={viewUserId}
      />
      <UpdateUserDrawer
        open={openUpdateDrawer}
        handleClose={() => setUpdateUserOpen(!editUserOpen)}
        user={userData}
      />
    </>
  )
}

export default UserListTable
