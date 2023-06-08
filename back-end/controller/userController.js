import User from "../models/users.js"

const checkAvailability = (email, userHandle) => {
    try {
      User.findOne({
        userHandle:userHandle
      }).then(
        (user) => {
            if(user){
                return false;
            }
        }
      )
    } catch (error) {
      console.log(error);
    }

    
  }

const registerUser = (uid) => {
    const newUser = new User({
        uid,
        userHandle
      });
    
    try {
        const savedUser = newUser.save();
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

export {registerUser};