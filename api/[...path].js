const { handleApiRequest, initStorage } = require("../server");

let initPromise;

function ensureStorage() {
  if (!initPromise) {
    initPromise = initStorage();
  }

  return initPromise;
}

module.exports = async function vercelApiHandler(request, response) {
  try {
    await ensureStorage();

    const { pathname } = new URL(request.url, `https://${request.headers.host || "localhost"}`);
    await handleApiRequest(request, response, pathname);
  } catch (error) {
    console.error("Erro na função da Vercel.", error);

    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    }

    response.end(JSON.stringify({ error: "Erro interno do servidor." }));
  }
};
