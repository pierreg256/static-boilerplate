<<<<<<< HEAD
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
const header = req.headers["x-ms-client-principal"];
  const encoded = Buffer.from(header, "base64");
  const decoded = encoded.toString("ascii");

  context.res = {
    body: {
      clientPrincipal: JSON.parse(decoded)
    }
  };
}
=======
module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  const header = req.headers["x-ms-client-principal"] || "";
  const encoded = Buffer.from(header, "base64");
  let decoded = {};
  try {
    decoded = JSON.parse(encoded.toString("ascii"));
  } catch (error) {
    decoded = {};
  }

  context.res = {
    body: {
      clientPrincipal: decoded,
    },
  };
};
>>>>>>> 9e9de4d9679b6b60b62da569cd0cb302e66b6022
