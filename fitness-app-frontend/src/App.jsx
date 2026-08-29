import { useEffect, useState } from 'react'
import { setCredentials, logout } from './store/authSlice'
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router' 
import { Button, Box, Typography } from '@mui/material'
import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { AuthContext } from 'react-oauth2-code-pkce'
import ActivityForm from './components/ActivityForm'
import ActivityList from './components/ActivityList'
import ActivityDetail from './components/ActivityDetail'

const ActivitiesPage = () => {
  return (
    <div component="section" sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '4px', mb: 2 }}>
      <ActivityForm onActivityAdded={() => window.location.reload()} />
      <ActivityList />
    </div>
  )
}

function App() {

  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token && tokenData) {
      // const user = {
      //   username: tokenData.preferred_username,
      //   email: tokenData.email,
      //   roles: tokenData.realm_access.roles,
      // };
      dispatch(setCredentials({ user: tokenData, token, userId: tokenData.sub }));
      setAuthReady(true);
    } else {
      dispatch(logout());
    }
  }, [token, tokenData, dispatch]);

  return (
    <>
      <Router>
          {!token ? (
            <>
            <center>
            <Typography variant="h2" component="div" sx={{ flexGrow: 1, mb: 2 }}>
              Fitness Tracker App
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, mb: 2 }}>
              Welcome, please login to access your activities.
            </Typography>
            <Button variant="contained" color="#dc004e" onClick={() => logIn()}>
              Login
            </Button>
            </center>
            </>
          ) : (
            <>
            {/* <div>
              <pre>{JSON.stringify(tokenData, null, 2)}</pre>
              <pre>{JSON.stringify(token, null, 2)}</pre>
            </div> */}
            <Box component="section" sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '4px', mb: 2 }}>
              <Routes>
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/activities/:id" element={<ActivityDetail />} />
                <Route path="/activities/new" element={<ActivitiesPage />} />
                <Route path="/" element={token ? <Navigate to="/activities" replace /> : <div>Welcome, please login.</div> } />
              </Routes>
            </Box>
            <Button variant="contained" color="#dc004e" onClick={() => logOut()}>
               Logout
            </Button>
            </>
          )}
      </Router>
    </>
  )
}

export default App
 