require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsService = require('./service/postgres/AlbumsService');
const SongsService = require('./service/postgres/SongsService');
const albumsValidator = require('./validator/music');
const songsValidator = require('./validator/songs');

// user
const UsersService = require('./service/postgres/UsersService');
const usersValidator = require('./validator/users');
const users = require('./api/users');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: albumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: songsValidator,
      },
    },
    {
      plugin: users,
      option: {
        service: usersService,
        validator: usersValidator,
      },
    },
  ]);
  await server.start();
  console.log(` Server berjalan pada ${server.info.uri}`);
};

init();


