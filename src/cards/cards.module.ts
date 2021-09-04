import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [StripeModule],
  controllers: [CardsController],
  providers: []
})
export class CardsModule {}
