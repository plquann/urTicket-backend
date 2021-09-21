import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ForAdmin } from 'src/common/swagger.decorator';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/constants';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationDto } from 'src/common/pagination.dto';
@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ForAdmin()
  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.postNews(createNewsDto);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get()
  getAll(@Query('tag') tag: string, @Query() { page, limit }: PaginationDto) {
    if (tag) return this.newsService.getNewsByTag(page, limit, tag);

    return this.newsService.getAllNews(page, limit);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get('/popular')
  getPopular() {
    return this.newsService.getPopularNews();
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.getNewsById(id);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.updateNews(id, updateNewsDto);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.deleteNews(id);
  }
}
