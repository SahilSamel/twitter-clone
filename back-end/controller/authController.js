import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

const createUser = (req,res) => {
  const auth = getAuth();
  const {email, password} = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

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

export { createUser, signIn };
