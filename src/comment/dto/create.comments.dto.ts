import { ApiProperty } from '@nestjs/swagger';
import {
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto implements Readonly<CreateCommentDto> {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Comments about the movie',
    example: 'Interesting Movie',
    nullable: false,
    required: true,
    title: 'comment',
  })
  public comment: string;

  @IsIP()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    description: 'IP of the commenter',
    example: '192.0.2.146',
    nullable: false,
    required: true,
    title: 'ipAddress',
  })
  public ipAddress: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Movie Id',
    example: 1,
    nullable: false,
    required: true,
    title: 'movieId',
  })
  public movieId: number;
}
