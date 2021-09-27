import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @Column({ length: 500 })
  public comment: string;

  @Column()
  public ipAddress: string;

  @Column()
  public movieId: number;
}
