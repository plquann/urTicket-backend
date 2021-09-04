import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import StripeService from 'src/stripe/stripe.service';
import CreatePaymentDto from './dto/create-payment.dto';

@Controller('payment')
export default class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createCharge(
    @Body() payment: CreatePaymentDto,
    @Req() request: RequestWithUser,
  ) {
    console.log('server payment');
    return await this.stripeService.charge(
      payment.amount,
      payment.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }
}
