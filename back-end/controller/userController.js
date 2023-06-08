import User from "../models/users.js"

const registerUser = (uid) => {
    const newUser = new User({
        uid
      });
    
    try {
        const savedUser = newUser.save();
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

export {registerUser};