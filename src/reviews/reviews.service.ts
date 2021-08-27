import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getReviewsByMovieId(movieId: string): Promise<Review[]> {
    const reviews = await this.reviewRepository
      .createQueryBuilder()
      .where('movieId = :movieId', { movieId })
      .getMany();
      
    return reviews;
  }

  create(createReviewDto: CreateReviewDto): Promise<any> {
    return Promise.resolve(createReviewDto);
  }

  update(updateReviewDto: UpdateReviewDto): Promise<any> {
    return Promise.resolve(updateReviewDto);
  }
}
