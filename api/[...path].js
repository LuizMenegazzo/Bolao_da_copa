let initPromise;
let serverModule;

function getServerModule() {
  if (!serverModule) {
    serverModule = require("../server");
  }

  return serverModule;
}

function ensureStorage() {
  if (!initPromise) {
    initPromise = getServerModule().initStorage().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  return initPromise;
}

module.exports = async function vercelApiHandler(request, response) {
  try {
    await ensureStorage();

    const { pathname } = new URL(request.url, `https://${request.headers.host || "localhost"}`);
    const { handleApiRequest } = getServerModule();

    await handleApiRequest(request, response, pathname);
  } catch (error) {
    console.error("Erro na função da Vercel.", error);

    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    }

    response.end(JSON.stringify({ error: "Erro interno do servidor." }));
  }
};
