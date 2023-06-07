// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithCredential,
// } from "firebase/auth";

// const createUser = () => {
//   const auth = getAuth();

//   createUserWithEmailAndPassword(auth, "aaryan3120@gmail.com", "123456789")
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log(user);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log(errorMessage);
//     });
// };

// const signIn = () => {
//   const auth = getAuth();

//   signInWithEmailAndPassword(auth, "aaryan3120@gmail.com", "123456789")
//     .then((userCredential) => {
//       const user = userCredential.user;
//       console.log(user);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log(errorMessage);
//     });
// };

// export { createUser, signIn };
