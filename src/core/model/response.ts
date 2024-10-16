export interface BasicResponseModel<T> {
  code: number;
  message: string;
  data: T;

  isSuccess(): boolean;
}

export class ApiResponse implements BasicResponseModel<any> {
  code!: number;
  message!: string;
  data: any;

  constructor(code: number, message: string, data: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
  static of(val: BasicResponseModel<any>) {
    const { data, code, message } = val;
    return new ApiResponse(code, message, data);
  }

  static from(val: string): ApiResponse {
    const result = new ApiResponse(-1, '', undefined);
    Object.assign(result, JSON.parse(val));
    return result;
  }
  isSuccess() {
    return 200 === this.code;
  }
}

export const toSuccess = (_message?: string, data?: any): ApiResponse => {
  return new ApiResponse(
    200,
    _message ? _message : 'success',
    data ? data : null
  );
};

export const toError = (
  _message?: string,
  data?: any,
  code?: number
): ApiResponse => {
  return new ApiResponse(
    code ? code : 300,
    _message ? _message : 'error',
    data ? data : null
  );
};
