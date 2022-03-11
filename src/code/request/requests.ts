import { IRequestRegister } from '@/platform/request/common/requestService';
import { GetAllUsersRequest } from '@/code/request/getAllUsers/getAllUsersRequest';

const requests: IRequestRegister[] = [];

requests.push({
  id: GetAllUsersRequest.staticId,
  ctor: GetAllUsersRequest
});

export default requests;
