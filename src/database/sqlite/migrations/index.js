import sqliteConnection from "../index.js";
import createUsers from "./createUsers.js";

async function migrationsRun() {
  // função que vai executar as Migrations
  const schemas = [createUsers].join(""); // schemas se referencia as tabelas que o banco terá. A Função join serve para "eliminar" os espaços que tem nas strings. Por exemplo, criamos um templates onde quebramos linha, o join, vai tirar essas quebras.
  sqliteConnection()
    .then((db) => db.exec(schemas)) // exec() executas as schemas.
    .catch((error) => console.error(error)); // pega caso tenha algum erro e retorna no console
}

export default migrationsRun;
