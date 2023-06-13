import Tweet from "../models/tweets.js";
import User from "../models/users.js";
import admin from "firebase-admin";
import driver from "../connections/neo4j.js";
import serviceAccount from "../connections/firebaseAdmin.js";

// <-- Firebase admin SDK Initialization-->
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// <-- End of Firebase admin SDK Initialization-->

// <-- PROFILE PARAMETER UPDATE FUNCTIONS -->

//Update Location
const updateLocation = (req, res) => {
  const uid = req.userId.id;
  const { location } = req.body;

  User.findOneAndUpdate({ uid }, { location }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(200).json({ message: "Location updated successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Error updating location" });
    });
};

//Update Birth Date
const updateBirthdate = (req, res) => {
  const uid = req.userId.id;
  const { birthdate } = req.body;

  User.findOneAndUpdate({ uid }, { birthdate }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(200).json({ message: "Birthdate updated successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Error updating birthdate" });
    });
};


//Update Bio
const updateBio = (req, res) => {
  const uid = req.userId.id;
  const { bio } = req.body;

  User.findOneAndUpdate({ uid }, { bio }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(200).json({ message: "Bio updated successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Error updating bio" });
    });
};

// <-- End of PROFILE PARAMETER UPDATE FUNCTIONS -->

// <-- DELETE USER FUNCTION -->

//Deleting user
const deleteUser = async (req, res) => {
  const uid = req.userId.id;
  const session = driver.session(); // Assuming you have the Neo4j driver instance available

  try {
    await User.deleteOne({ uid });
    await Tweet.deleteOne({ uid });

    await admin.auth().deleteUser(uid);

    const result = await session.run("MATCH (u:User {uid: $uid}) DELETE u", {
      uid,
    });

    session.close();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    session.close();
    res.status(500).json({ error: "Error deleting user" });
  }
};

// <-- End of DELETE USER FUNCTION -->

export { deleteUser, updateBio, updateLocation, updateBirthdate };
