import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getSkipLimit } from 'src/common/utils';
import { ILike, Raw, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async seedersNews(): Promise<any> {
    const news = [];

    const result = await this.newsRepository
      .createQueryBuilder()
      .insert()
      .into(News)
      .values(news)
      .execute();

    if (!result)
      throw new HttpException(
        'Could not seed News',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }

  async postNews(createNewsDto: CreateNewsDto): Promise<News> {
    try {
      const news = this.newsRepository.create(createNewsDto);
      await this.newsRepository.save(news);

      return news;
    } catch (error) {
      throw new HttpException('Could not create News!', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllNews(page: number, limit: number): Promise<any> {
    const pagination = getSkipLimit({ page, limit });

    const [news, count] = await this.newsRepository.findAndCount({
      order: {
        publishedDate: 'DESC',
        views: 'DESC',
      },
      take: pagination.limit,
      skip: pagination.skip,
    });

    if (!news.length)
      throw new HttpException('Could not find any News!', HttpStatus.NOT_FOUND);

    return {
      news,
      totalRow: count,
    };
  }

  async getNewsByTag(page: number, limit: number, tag: string): Promise<any> {
    const pagination = getSkipLimit({ page, limit });

    const [news, count] = await this.newsRepository.findAndCount({
      select: ['id', 'title', 'image', 'publishedDate', 'views', 'tags'],
      where: {
        tags: ILike(`%${tag}%`),
      },
      order: {
        publishedDate: 'DESC',
        views: 'DESC',
      },
      take: pagination.limit,
      skip: pagination.skip,
    });

    if (!news.length)
      throw new HttpException('Could not find any News!', HttpStatus.NOT_FOUND);

    return {
      news,
      totalRow: count,
    };
  }

  async getNewsById(newsId: string): Promise<News> {
    const news = await this.newsRepository.findOne(newsId);
    await this.newsRepository.update(newsId, { views: news.views + 1 });

    if (!news)
      throw new HttpException('Could not find News!', HttpStatus.NOT_FOUND);

    return news;
  }

  async getPopularNews(): Promise<News[]> {
    const news = await this.newsRepository.find({
      order: {
        views: 'DESC',
      },
      take: 5,
    });

    if (!news.length)
      throw new HttpException('Could not find any News!', HttpStatus.NOT_FOUND);

    return news;
  }

  async updateNews(
    newsId: string,
    updateNewsDto: UpdateNewsDto,
  ): Promise<News> {
    await this.newsRepository.update(newsId, updateNewsDto);
    const news = await this.newsRepository.findOne(newsId);

    if (!news)
      throw new HttpException('Could not find News!', HttpStatus.NOT_FOUND);

    return news;
  }

  async deleteNews(newsId: string): Promise<any> {
    const result = await this.newsRepository
      .createQueryBuilder()
      .delete()
      .from(News)
      .where('id = :id', { id: newsId })
      .execute();

    if (!result.affected)
      throw new HttpException('Could not delete News!', HttpStatus.BAD_REQUEST);
  }
}
