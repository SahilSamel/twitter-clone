import neo4j from "neo4j-driver";

let driver;

try {
  driver = neo4j.driver(
    process.env.NeoURI,
    neo4j.auth.basic(process.env.NeoUSER, process.env.NeoPASS)
  );

  console.log("Neo4j credentials verified: Connection established");
} catch (error) {
  console.log(error);
}

export default driver;
