import { Module } from "@nestjs/common";
import { StripeModule } from "src/stripe/stripe.module";
import PaymentController from "./payment.controller";

@Module({
    imports:[StripeModule],
    controllers:[PaymentController],
    providers:[],
})

export class PaymentModule{}