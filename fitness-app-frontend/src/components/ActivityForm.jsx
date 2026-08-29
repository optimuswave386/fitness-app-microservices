import React from 'react'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { AddActivity } from '../services/api'

const ActivityForm = () => {

    const [activity, setActivity] = React.useState({
        type: 'RUNNING',
        duration: '',
        caloriesBurned: '',
        additionalMetrics: {}
    });

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await AddActivity(activity);
        //onActivityAdded(); // Call the callback function to notify the parent component
        setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} }); // Reset the form fields
    } catch (error) {
        console.error('Error submitting form:', error);
    }
    console.log('Form submitted');
    };

  return (
    <>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '4px', mb: 2 }}>  
            
            <FormControl fullWidth margin="normal">
               
                <InputLabel id="activity-type-label">Activity Type</InputLabel>
                <Select
                    labelId="activity-type-label"
                    value={activity.type}
                    onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                >
                    <MenuItem value="RUNNING">Running</MenuItem>
                    <MenuItem value="CYCLING">Cycling</MenuItem>
                    <MenuItem value="SWIMMING">Swimming</MenuItem>
                </Select>
            </FormControl>

            <TextField
                label="Duration (minutes)"
                type="number"
                fullWidth
                margin="normal"
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
            />

            <TextField
                label="Calories Burned"
                type="number"
                fullWidth
                margin="normal"
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
            />

            <Button type="submit" variant="contained" color="primary">
                Add Activity
            </Button>

        </Box>
    </>
  )
}
    
export default ActivityForm