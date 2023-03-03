import { PageableResponse } from 'src/app/shared/domain/pageable-response';
import { User } from '../models/user';

export type UserPageableResponse = PageableResponse<User>;
