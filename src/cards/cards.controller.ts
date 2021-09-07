import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import StripeService from 'src/stripe/stripe.service';
import AddCardDto from './dto/add-card.dto';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiCreatedResponse()
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async addCard(@Body() card: AddCardDto, @Req() request: RequestWithUser) {
    return this.stripeService.attachCreditCard(
      card.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }

  @ApiOkResponse()
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getCards(@Req() request: RequestWithUser) {
    return this.stripeService.getCreditCards(request.user.stripeCustomerId);
  }
}
