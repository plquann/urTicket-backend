import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductOrder } from './entities/productOrder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductOrder])],
  controllers: [ProductsController],
  exports: [ProductsService],
  providers: [ProductsService],
})
export class ProductsModule {}
