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
    // Unable to select specific fields
    // const reviews = await this.reviewRepository.find({
    //   select: ['id', 'title', 'content', 'rating', 'author.id'],
    //   relations: ['author'],
    //   where: {
    //     movieId: movieId,
    //   },
    // });

    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.author', 'author')
      .select([
        'review.id',
        'review.title',
        'review.content',
        'review.rating',
        'author.id',
        'author.userName',
        'author.avatar',
      ])
      .where('review.movieId = :movieId', { movieId })
      .getMany();

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
      voteAverage: voteCount
        ? 0
        : Math.round(((movie.voteAverage * movie.voteCount) / voteCount) * 10) /
          10,
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
