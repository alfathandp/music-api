const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUsersHandler = this.postUsersHandler.bind(this);
  }

  async postUsersHandler(request, h) {
    try {
      this._validator.validateUsersPayload(request.payload);
      const {username, password, fullname} = request.payload;
      const userId = await this._service.addUsers(username, password, fullname);
      const response = h.response({
        status: 'success',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // SERVER ERROR
      const response = h.response({
        status: 'error',
        message: ' Maaf, Terjadi Error pada Server Kami',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}
module.exports = UsersHandler;
