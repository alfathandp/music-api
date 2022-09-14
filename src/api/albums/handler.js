const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumsHandler = this.postAlbumsHandler.bind(this);
    this.getAlbumsByIdHandler = this.getAlbumsByIdHandler.bind(this);
    this.putAlbumsByIdHandler = this.putAlbumsByIdHandler.bind(this);
    this.deleteAlbumsByIdHandler = this.deleteAlbumsByIdHandler.bind(this);
  }

  async postAlbumsHandler(request, h) {
    try {
      this._validator.validateAlbumsPayload(request.payload);
      const {name, year} = request.payload;

      const albumId = await this._service.addAlbums({name, year});

      const response = h.response({
        status: 'success',
        data: {
          albumId,
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

      const response = h.response({
        status: 'error',
        message: 'maaf server sedang error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumsByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const album = await this._service.getAlbumsById(id);
      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      if ( error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: ' Maaf server sedang error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAlbumsByIdHandler(request, h) {
    try {
      this._validator.validateAlbumsPayload(request.payload);
      const {id} = request.params;
      const {name, year} = request.payload;
      await this._service.updateAlbumsById(id, {name, year});

      return {
        status: 'success',
        message: ' Album berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      };

      const response = h.response({
        status: 'error',
        message: 'Maaf server sedang error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAlbumsByIdHandler(request, h) {
    try {
      const {id} = request.params;
      await this._service.deleteAlbumById(id);
      return {
        status: 'success',
        message: ' Album berhasil dihapus',
      };
    } catch (error) {
      if ( error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf server sedang error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
};

module.exports = AlbumsHandler;

