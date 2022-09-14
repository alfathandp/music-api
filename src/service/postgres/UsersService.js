const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('Maaf username telah digunakan');
    }
  }
  async addUsers(username, password, fullname) {
    await this.verifyUsername(username);
    const {id} = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 12);
    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Maaf, User gagal ditambahkan');
    }
    return result.rows[0].id;
  }
}
module.exports = UsersService;
