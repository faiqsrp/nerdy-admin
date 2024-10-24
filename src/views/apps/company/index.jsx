// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserListTable from '../user/list/UserListTable'
import UserListCards from '../user/list/UserListCards'
import ViewUserDrawer from '../user/list/ViewUserDrawer'
import UpdateUserDrawer from '../user/list/UpdateUserDrawer'

const CompanyList = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListCards />
      </Grid>
      <Grid item xs={12}>
        <UserListTable tableData={userData} />
      </Grid>
      <Grid item xs={12}>
        <ViewUserDrawer />
      </Grid>
      <Grid item xs={12}>
        <UpdateUserDrawer />
      </Grid>
    </Grid>
  )
}

export default CompanyList
