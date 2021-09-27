import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create.comments.dto';

export class UpdateMovieDto extends PartialType(CreateCommentDto) {}
