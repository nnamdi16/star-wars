
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';
import { CommentsService } from '../comment/comments.service';
import { Gender, Order, QueryParams } from '../comment/dto/filterParameter.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly commentService: CommentsService,
    private readonly httpService: HttpService,
  ) {}
  public async fetchAllMovies(): Promise<any> {
    try {
      const fetchAllComments = await this.commentService.fetchAllComments();
      const baseUrl = this.configService.get('MOVIE_BASE_URL');
      return this.httpService.get(`${baseUrl}/films`).pipe(
        map((response) => {
          const movieList = response.data.results;
          return movieList.map((data) => {
            const filterCommentsByMovieId = fetchAllComments.filter(
              ({ movieId }) => {
                const movieUrl = `https://swapi.dev/api/films/${movieId}/`;
                return movieUrl == data.url;
              },
            );
            data['comment'] = filterCommentsByMovieId;
            data['commentsCount'] = filterCommentsByMovieId.length;
            return movieList;
          });
        }),
      );
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async fetchAllCharacters(
    sortParams?: QueryParams,
    order = Order.ASCENDING,
  ): Promise<any> {
    try {
      const baseUrl = this.configService.get('MOVIE_BASE_URL');
      return this.httpService.get(`${baseUrl}/people`).pipe(
        map((response) => {
          const characterList = response.data;
          if (sortParams && order == Order.ASCENDING) {
            const sortObj = characterList['results'];
            sortObj.sort((a, b) => {
              return a[sortParams].localeCompare(b[sortParams]);
            });
            characterList['results'] = sortObj;
            return characterList;
          }
          if (sortParams && order == Order.DESCENDING) {
            const sortObj = characterList['results'];
            sortObj.sort((a, b) => b[sortParams].localeCompare(a[sortParams]));
            characterList['results'] = sortObj;
            return characterList;
          }

          return response.data;
        }),
      );
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async fetchCharactersByGender(filterParams: Gender): Promise<any> {
    try {
      const baseUrl = this.configService.get('MOVIE_BASE_URL');
      return this.httpService.get(`${baseUrl}/people/`).pipe(
        map((response) => {
          const characterList = response.data;
          const filteredResult = characterList.results.filter(
            (data) => data.gender == filterParams,
          );
          const totalFilterMatch = filteredResult.length;
          const totalHeight = filteredResult.reduce(function (
            accumulator,
            item,
          ) {
            return accumulator + Number(item.height);
          },
          0);
          const convertedHeight = {
            feet_inches: this.cmToInFt(totalHeight),
            cm: `${totalHeight}cm`,
          };
          characterList['results'] = filteredResult;
          characterList['totalMatch'] = totalFilterMatch;
          characterList['totalHeight'] = convertedHeight;
          return characterList;
        }),
      );
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  cmToInFt = (cm, inches = Math.round(cm / 2.54)) =>
    `${Math.floor(inches / 12)}ft ${inches % 12}inches`;
}
