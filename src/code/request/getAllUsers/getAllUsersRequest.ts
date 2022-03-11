import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';

export interface IGetAllUsersRequestResponse {

}

export class GetAllUsersRequest extends HTTPRequest<null, IGetAllUsersRequestResponse, string> {
  public static readonly staticId = 'getAllUsers';

  protected readonly endpoint: string = ENDPOINTS.GET_ALL_USERS;
  public readonly id: string = GetAllUsersRequest.staticId;

  constructor() {
    super();
  }

  public async handle(): Promise<ResponseInstance<IGetAllUsersRequestResponse, string>> {
    const response = await this.get(this.endpoint);
    return this.doHandle(response);
  }
}
