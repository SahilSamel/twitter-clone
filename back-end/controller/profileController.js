import Tweet from "../models/tweets.js";
import User from "../models/users.js";
import admin from "firebase-admin";
import driver from "../connections/neo4j.js";
import serviceAccount from "../connections/firebaseAdmin.js";
const session = driver.session(); //neo4j session creation

// <-- Firebase admin SDK Initialization-->
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
// <-- End of Firebase admin SDK Initialization-->

const deleteUser = async (req, res) => {
    const  uid  = req.userId.id;
    console.log(req.userId.id)
    try {
      await User.deleteOne({ uid });
      await Tweet.deleteOne({ uid });
  
      await admin.auth().deleteUser(uid);
  
      const result = await session.run("MATCH (u:User {uid: $uid}) DELETE u", { uid });
  
      session.close();
  
      console.log("User deleted successfully");
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Error deleting user" });
    }
  };
  

export {deleteUser}
