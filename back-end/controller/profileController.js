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

// <-- USER DATA RETRIEVAL FUNCTIONS -->

// Get user data
const getProfile = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findOne({ uid: userId }).exec();
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const year = user.joinDate.getFullYear();
    const month = user.joinDate.toLocaleString("default", { month: "long" });;
    const profileData = {
      userName: user.userName,
      userHandle: user.userHandle,
      followersCount: user.followersCount,
      followeesCount: user.followeesCount,
      bio: user.bio,
      location: user.location,
      profileImageURL: user.profileImageURL,
      bgImageURL: user.bgImageURL,
      joinDate: month + " " + year
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.log("Error retrieving profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// <-- End of USER DATA RETRIEVAL FUNCTIONS -->

// <-- SELF TWEET LISTING FUNCTIONS -->

// Get Self tweets
const selfTweets = (req, res) => {
  const {userId} = req.query;
  Tweet.findOne({ userId }, "tweets", (err, tweetDocument) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!tweetDocument) {
      return res.status(404).json({ error: "No tweets found for the user" });
    }

    const profileDisplayTweets = tweetDocument.tweets.map((tweet) => ({
      userId: userId,
      tweetId: tweet._id,
    }));

    return res.status(200).json({profileDisplayTweets});
  });
};

// Get self replies
const selfReplies = (req, res) => {
  const {userId} = req.query;
  
  Tweet.findOne({ userId }, "tweets", (err, tweetDocument) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!tweetDocument) {
      return res.status(404).json({ error: "No tweets found for the user" });
    }

    const profileDisplayTweets = tweetDocument.tweets
      .filter((tweet) => tweet.type !== 1)
      .map((tweet) => ({
        userId: userId,
        tweetId: tweet._id,
      }));

    return res.status(200).json({profileDisplayTweets});
  });
};

// Get self liked tweets
const selfLiked = (req, res) => {
  const {userId} = req.query;
  User.findOne({ uid:userId }, "liked", (err, userDocument) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!userDocument) {
      return res.status(404).json({ error: "User not found" });
    }

    const profileDisplayTweets = userDocument.liked;

    return res.status(200).json({profileDisplayTweets});
  });
};


// <-- End of SELF TWEET LISTING FUNCTIONS -->


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

export { getProfile, selfTweets, selfReplies, selfLiked, deleteUser, updateBio, updateLocation, updateBirthdate };
