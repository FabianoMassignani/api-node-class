import { Router } from "express";
import UserContainer from "../container/userContainer";
import ProductContainer from "../container/productContainer";

const routes: Router = Router();
const prefix = "/api";

routes.use(`${prefix}/products`, ProductContainer.productRouter);
routes.use(`${prefix}/users`, UserContainer.userRouter);

export default routes;
