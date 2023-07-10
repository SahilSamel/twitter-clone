import Tweet from "../models/tweets.js";
import User from "../models/users.js";
import admin from "firebase-admin";
import driver from "../connections/neo4j.js";
import serviceAccount from "../connections/firebaseAdmin.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
// <-- Firebase admin SDK Initialization-->
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// <-- End of Firebase admin SDK Initialization-->

// <-- USER DATA RETRIEVAL FUNCTIONS -->

// Get user data
const getProfile = async (req, res) => {
  const { userHandle } = req.query;

  try {
    const user = await User.findOne({ userHandle: userHandle }).exec();
    
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
      birthdate: user.birthdate,
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

    const displayTweets = tweetDocument.tweets.map((tweet) => ({
      userId: userId,
      tweetId: tweet._id,
    }));

    return res.status(200).json({displayTweets});
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

    const displayTweets = tweetDocument.tweets
      .filter((tweet) => tweet.type !== 1)
      .map((tweet) => ({
        userId: userId,
        tweetId: tweet._id,
      }));

    return res.status(200).json({displayTweets});
  });
};

const selfTweetsWithMedia = (req, res) => {
  const { userId } = req.query;

  Tweet.findOne({ userId }, "tweets", (err, tweetDocument) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!tweetDocument) {
      return res.status(404).json({ error: "No tweets found for the user" });
    }

    const displayTweets = tweetDocument.tweets
      .filter((tweet) => tweet.mediaURL !== "")
      .map((tweet) => ({
        userId: userId,
        tweetId: tweet._id,
      }));
    return res.status(200).json({ displayTweets });
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

    const displayTweets = userDocument.liked;

    return res.status(200).json({displayTweets});
  });
};


// <-- End of SELF TWEET LISTING FUNCTIONS -->


// <-- PROFILE PARAMETER UPDATE FUNCTIONS -->


const UpdateProfileData = (req, res) => {
  const userID = req.userId.id;
  const { userName, bio, location,birthdate} = req.body;
  const date = new Date(birthdate);
  User.findOneAndUpdate({ uid: userID }, { userName, bio, location,birthdate:date }, (error, updatedUser) => {
    if (error) {
      res.status(500).json({ error: "Error updating profile" });
    } else if (updatedUser) {
      res.status(200).json({ message: "Updated" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
};

const updateImage = (req, res) => {
  const userID = req.userId.id;
  const { profileImageURL, bgImageURL } = req.body;

  const update = {};
  if (profileImageURL) {
    update.profileImageURL = profileImageURL;
  }
  if (bgImageURL) {
    update.bgImageURL = bgImageURL;
  }

  User.findOneAndUpdate({ uid: userID }, update, (error, updatedUser) => {
    if (error) {
      res.status(500).json({ error: "Error updating profile" });
    } else if (updatedUser) {
      res.status(200).json({ message: "Updated" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
};


// <-- End of PROFILE PARAMETER UPDATE FUNCTIONS -->

// <-- DELETE USER FUNCTION -->

//Deleting user
const deleteUser = async (req, res) => {
  const uid = req.userId.id;
  const { password } = req.body;
  const session = driver.session();

  try {
    const user = await User.findOne({ uid:uid });
    const email = user.email;
    console.log(email);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await User.deleteOne({ uid });
        await Tweet.deleteOne({ userid:uid });
        await admin.auth().deleteUser(uid);

        const result = await session.run(
          "MATCH (u:User {uid: $uid}) DELETE u",
          { uid }
        );

        session.close();
        try {
          res.clearCookie('token', { domain: 'localhost', path: '/', secure: true });
          res.sendStatus(200);
        } catch (error) {
          res.status(500).json({ error: "Failed to clear cookies" });
        }
      })
      .catch((error) => {
        res.status(401).json({ error: "Invalid password" });
      });
  } catch (error) {
    session.close();
    res.status(500).json({ error: "Error deleting user" });
  }
};


// <-- End of DELETE USER FUNCTION -->

const getUserId = (req, res) => {
  const { userHandle} = req.body;

  User.findOne({ userHandle: userHandle },(error, user) => {
    if (error) {
      res.status(500).json({ error: "Error updating profile" });
    } else if (user) {
      res.status(200).json({ userId: user.uid });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
};

export { getProfile, selfTweets, selfReplies, selfTweetsWithMedia, selfLiked, deleteUser,UpdateProfileData,getUserId,updateImage };
