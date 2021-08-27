import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Req() request: RequestWithUser,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const { user } = request;
    return this.reviewsService.createReview(createReviewDto, user.id);
  }

  @Get('movie/:movieId')
  getReviewsByMovieId(@Param('movieId') movieId: string) {
    return this.reviewsService.getReviewsByMovieId(movieId);
  }

  @Delete('/:reviewId')
  deleteReview(@Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteReview(reviewId);
  }
}
