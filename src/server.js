const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"], // Izinkan semua asal
        additionalHeaders: ["access-control-allow-origin"],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
init();
