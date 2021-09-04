import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [StripeModule],
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {}
