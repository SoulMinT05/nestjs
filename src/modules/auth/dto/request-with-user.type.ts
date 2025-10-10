import { User } from 'src/modules/user/entities/user.entity';

export interface IRequestWithUser extends Request {
  user: User;
}
