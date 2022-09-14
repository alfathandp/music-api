const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongsHandler = this.postSongsHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getSongsByIdHandler = this.getSongsByIdHandler.bind(this);
    this.putSongsByIdHandler = this.putSongsByIdHandler.bind(this);
    this.deleteSongsByIdHandler = this.deleteSongsByIdHandler.bind(this);
  }

  async postSongsHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const {
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      } = request.payload;
      const songId = await this._service.addSongs({
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      });

      const response = h.response({
        status: 'success',
        data: {
          songId,
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
        message: 'maaf server sedang bermasalah ',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
  async getAllSongsHandler() {
    const songs = await this._service.getAllSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongsByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const song = await this._service.getSongsById(id);

      const response = h.response({
        status: 'success',
        data: {
          song,
        },
      });
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
        message: 'maaf server sedang bermasalah',
      });
      response.code(500);
      return response;
    }
  }

  async putSongsByIdHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const {
        title,
        year,
        genre,
        performer,
        duration,
        albumId = null,
      } = request.payload;
      const {id} = request.params;
      await this._service.editSongsById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      return {
        status: 'success',
        message: 'Selamat, lagu berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h .response({
        status: 'error',
        message: 'maaf server sedang error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteSongsByIdHandler(request, h) {
    try {
      const {id} = request.params;
      await this._service.deleteSongsById(id);

      return {
        status: 'success',
        message: 'Selamat, lagu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const ServerError = h.response({
        status: 'error',
        message: 'Maaf server sedang error',
      });
      ServerError.code(500);
      return ServerError;
    }
  }
}

module.exports = SongsHandler;
