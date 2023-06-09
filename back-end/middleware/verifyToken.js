import jwt from "jsonwebtoken";

const verifyToken =  (req, res) => {
    try {
        let token = req.header("Authorization");
    
        if (!token) {
          return res.status(403).send("Access Denied");
        }
    
        if (token.startsWith("Bearer ")) {
          token = token.slice(7, token.length).trimLeft();
        }
    
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log(req.user);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

export default verifyToken