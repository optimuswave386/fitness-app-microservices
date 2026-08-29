import { React } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import Grid from '@mui/material/Grid' // Grid version 2
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { getActivities } from '../services/api'

const ActivityList = () => {

  const [activities, setActivities] = useState([]);

  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities({});
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleActivityClick = (id) => {
    navigate(`/activities/${id}`);
  };

  return (
    <>
    <div>
      <h2>Activity List</h2>
      {/* <pre>{JSON.stringify(activities, null, 2)}</pre> */}
      <Grid container spacing={2}>
        { activities.length > 0 ? activities.map((activity, index) => (
          <>
        <Grid item="true" key={index} xs={12} sm={6} md={4} columnSpacing={2} >
          <Card onClick={() => handleActivityClick(activity.id)} style={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h6">{activity.type}</Typography>
              <Typography variant="body2">Duration: {activity.duration} minutes</Typography>
              <Typography variant="body2">Calories Burned: {activity.caloriesBurned}</Typography>
            </CardContent>
          </Card>
        </Grid>
        </>
        )) : (<><Typography>No activities available.</Typography></>)}
      </Grid>
    </div>
    </>
  )
}

export default ActivityList