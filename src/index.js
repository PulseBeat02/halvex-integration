import AuthenticationServer from "./auth/server.js";
import createRequest from "./auth/register.js";

const server = new AuthenticationServer();
server.start();

createRequest();
