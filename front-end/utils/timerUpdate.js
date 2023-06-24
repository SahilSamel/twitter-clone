const calculateTimerValue = (activityNumber) => {
    // Define the maximum and minimum timer values
    const maxTimerValue = 60000; // Maximum timer value (60 seconds)
    const minTimerValue = 20000; // Minimum timer value (20 seconds)
  
    // Calculate the timer value based on the activity number
    let timer = maxTimerValue - (activityNumber * (maxTimerValue - minTimerValue));
  
    // Ensure the timer value is within the valid range
    timer = Math.max(timer, minTimerValue);
  
    return timer;
};
  