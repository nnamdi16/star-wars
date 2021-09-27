import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create.comments.dto';
import { CommentEntity } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}
  public async create(
    createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentDto | any> {
    try {
      const { movieId } = createCommentDto;
      const baseUrl = this.configService.get('MOVIE_BASE_URL');
      return this.httpService.get(`${baseUrl}/films/${movieId}`).pipe(
        map(async (response) => {
          const fetchMovieById = response.data;
          if (!('title' in fetchMovieById)) {
            const errors = { message: 'Movie not found' };
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                error: errors,
              },
              HttpStatus.BAD_REQUEST,
            );
          }
          const newComment = this.commentRepository.create(createCommentDto);
          return await this.commentRepository.save(newComment);
        }),
      );
    } catch (error) {}
  }

  public async fetchAllComments(): Promise<any> {
    return await this.commentRepository.find();
  }
}
