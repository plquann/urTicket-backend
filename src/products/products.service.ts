import { productsSeed } from './../database/seeds/products.seed';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductOrder } from './entities/productOrder.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productsOrderService: Repository<ProductOrder>,
  ) {}

  async seedersProducts(): Promise<void> {
    const products = productsSeed;
    const result = await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(products)
      .execute();

    if (!result)
      throw new HttpException(
        'Could not seed products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const isProductExist = await this.productRepository.findOne({
      name: createProductDto.name,
    });
    if (isProductExist)
      throw new HttpException('Product already exist!', HttpStatus.BAD_REQUEST);

    const newProduct = this.productRepository.create(createProductDto);
    await this.productRepository.save(newProduct);

    return newProduct;
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async getProductsByReservationId(
    reservationId: string,
  ): Promise<ProductOrder[]> {
    const products = await this.productsOrderService
      .createQueryBuilder('productOrder')
      .leftJoinAndSelect('productOrder.product', 'product')
      .where('productOrder.reservationId = :reservationId', { reservationId })
      .getMany();

    return products;
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(productId, updateProductDto);

    const updateProduct = await this.productRepository.findOne(productId);
    if (!updateProduct)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

    return updateProduct;
  }

  async deleteProduct(productId: string): Promise<void> {
    const product = await this.productRepository.delete(productId);
    if (!product.affected)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
  }
}
