import AppError from "../utils/AppError.js";
import sqliteConnection from "../database/sqlite/index.js";
import bcryptjs from "bcryptjs";

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Email já cadastrado!");
    }

    const { hash } = bcryptjs;

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;

    const user_id = request.user.id;

    const { hash, compare } = bcryptjs;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    if (!name && !email && !password && !old_password) {
      throw new AppError("Nenhum valor informado para ser atualizado");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Email já cadastrado!");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Informe a senha atual");
    }

    if (password && old_password) {
      const checkPassword = await compare(old_password, user.password);

      if (!checkPassword) {
        throw new AppError("Senha atual incorreta");
      }

      const hashedPassword = await hash(password, 8);
      user.password = hashedPassword;
    }

    database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      update_at = DATETIME ('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return response.status(200).json();
  }
}

export default UsersController;
