import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Gender, Order, QueryParams } from '../comment/dto/filterParameter.dto';

@Controller('movies')
@ApiTags('star-wars')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/characters?')
  @ApiQuery({
    name: 'sortParams',
    enum: QueryParams,
    required: false,
  })
  @ApiQuery({
    name: 'order',
    enum: Order,
    required: false,
  })
  sortCharacters(
    @Query('sortParams') sortParams?: QueryParams,
    @Query('order') order?: Order,
  ) {
    return this.moviesService.fetchAllCharacters(sortParams, order);
  }

  @Get()
  findAll() {
    return this.moviesService.fetchAllMovies();
  }

  @Get('/characters/filter?')
  @ApiQuery({
    name: 'gender',
    enum: Gender,
    required: true,
  })
  filterCharactersByGender(@Query('gender') gender: Gender) {
    return this.moviesService.fetchCharactersByGender(gender);
  }
}
