module.exports = function healthHandler(request, response) {
  response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({
    ok: true,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
    timestamp: new Date().toISOString()
  }));
};
