import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { getActivityById, getActivityDetail } from '../services/api'

const ActivityDetail = () => {

  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    
    const fetchActivityDetail = async () => {
      try {
        const activityData = await getActivityById(id);
        setActivity(activityData);

        const recommendationData = await getActivityDetail(id);
        setRecommendation(recommendationData);
      } catch (error) {
        console.error('Error fetching activity detail:', error);
      }
    };

    fetchActivityDetail();
  }, [id]);

  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Activity Detail</h2>
      <pre>{JSON.stringify(activity, null, 2)}</pre>
      {recommendation && (
        <div>
          <h3>Recommendation</h3>
          <pre>{JSON.stringify(recommendation, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default ActivityDetail