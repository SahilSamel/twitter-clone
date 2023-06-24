const calculateActivityNumber = (previousActivityNumber, lastServedTimestamp) => {
    const MAX_ACTIVITY_NUMBER = 1.0; // Maximum activity number
    const MIN_ACTIVITY_NUMBER = 0.0; // Minimum activity number
  
    // Calculate the recency score based on the time since the last served timestamp
    const currentTimestamp = Date.now();
    const timeDiffInHours = (currentTimestamp - lastServedTimestamp) / (1000 * 60 * 60);
    const recencyScore = Math.max(1 - (timeDiffInHours / 24), 0);
  
    // Calculate the final activity number by combining the previous activity number and recency score
    const activityNumber = (previousActivityNumber + recencyScore) / 2;
  
    // Map the activity number to the range (0 to 1)
    const clampedActivityNumber = Math.max(Math.min(activityNumber, MAX_ACTIVITY_NUMBER), MIN_ACTIVITY_NUMBER);
  
    return clampedActivityNumber;
};