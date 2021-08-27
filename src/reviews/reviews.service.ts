import { MovieService } from './../movies/movie.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    private readonly movieService: MovieService,
  ) {}

  async getReviewsByMovieId(movieId: string): Promise<Review[]> {
    const reviews = await this.reviewRepository.find({
      where: {
        movie: movieId,
      },
    });

    return reviews;
  }

  async getReviewById(reviewId: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
      },
    });
    return review;
  }

  create(createReviewDto: CreateReviewDto): Promise<any> {
    return Promise.resolve(createReviewDto);
  }

  async deleteReview(reviewId: string): Promise<any> {
    const review = await this.reviewRepository.findOne(reviewId, {
      relations: ['movie'],
    });

    if (!review) {
      throw new HttpException(
        `Review with id ${reviewId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const movie = review.movie;
    const voteCount = movie.voteCount - 1;

    await this.movieService.updateMovieById(movie.id, {
      voteAverage: (movie.voteAverage * movie.voteCount) / voteCount,
      voteCount: voteCount,
    });

    //  const review = await this.reviewRepository
    //  .createQueryBuilder('review')
    //  .leftJoinAndSelect('review.movie', 'movie')
    //  .where('review.id = :id', { id: reviewId })
    //  .getOne();

    await this.reviewRepository.delete(reviewId);
  }
}
