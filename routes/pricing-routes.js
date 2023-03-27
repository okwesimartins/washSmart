import express from "express";
import { createPricing,updatePricing, getpricingList, getsinglePricinglist} from "../controller/pricing-controller.js";

const pricingRouter = express.Router();

// pricingRouter.post("/create_pricing", createPricing);

pricingRouter.get("/get_pricing", getpricingList);

pricingRouter.get("/get_pricing/:id", getsinglePricinglist);

pricingRouter.put("/update_pricing", updatePricing);

export default pricingRouter;