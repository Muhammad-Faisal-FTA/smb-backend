import { Router } from "express";
import { apiTestReadingData, apiTestWritingData } from "../controllers/apiTest.controller.js";

const testRoute = Router()



testRoute.route('/testWritingData').put(apiTestWritingData)
testRoute.route('/testReadingData').get(apiTestReadingData)


export default testRoute;