import User from "../models/users.js";
import admin from "firebase-admin";
import driver from "../connections/neo4j.js";
import serviceAccount from "../connections/firebaseAdmin.js";

const session = driver.session();                                          //neo4j session creation

// <-- Firebase admin SDK Initialization-->
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// <-- End of Firebase admin SDK Initialization-->

//<-- Database Queries for Authentication -->
const checkHandle = (userHandle) => {
  return User.findOne({ userHandle: userHandle }).then((user) => {
    if (user) {
      throw new Error("User Handle already exists");
    }
  });
};
//<--End of Database Queries for Authentication -->

//<-- Database Entry for User -->
const registerUser = (uid, userHandle) => {
  const newUser = new User({
    uid,
    userHandle,
  });

  try {
    const result = session.run(
      "CREATE (:User {uid: $uid})",                                         //Create query for neo4j cypher
      { uid }
    );
    newUser.save();                                                         //Query to create user in mongo using mongoose
  } catch (error) {
    throw new Error("Error registering user");
  } finally {
    session.close();
  }
};
//<-- End of Database Entry for User -->

export { registerUser, checkHandle };
