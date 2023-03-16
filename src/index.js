import AuthenticationServer from './auth/server.js'
import createRequest from './auth/register.js'
import {generateUrl} from "../test/test.js";

const server = new AuthenticationServer()
server.start()

createRequest()
generateUrl()