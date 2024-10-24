// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserListTable from './UserListTable'
import UserListCards from './UserListCards'
import ViewUserDrawer from './ViewUserDrawer'
import UpdateUserDrawer from './UpdateUserDrawer'

const UserList = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListCards />
      </Grid>
      <Grid item xs={12}>
        <UserListTable tableData={userData} />
      </Grid>
      <Grid item xs={12}>
        < ViewUserDrawer/>
      </Grid>
      <Grid item xs={12}>
        < UpdateUserDrawer/>
      </Grid>
    </Grid>
  )
}

export default UserList
