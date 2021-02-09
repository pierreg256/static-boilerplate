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
