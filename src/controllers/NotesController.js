import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body;

    const user_id = request.user.id;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id,
    });

    if (links.length > 0) {
      const linksInsert = links.map((link) => {
        return {
          note_id,
          url: link,
        };
      });

      await knex("links").insert(linksInsert);
    }

    if (tags.length > 0) {
      const tagsInsert = tags.map((tag) => {
        return {
          note_id,
          name: tag,
          user_id,
        };
      });

      await knex("tags").insert(tagsInsert);
    }

    return response.status(201).json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();

    if (!note) {
      throw new AppError("Nota não encontrada", 404);
    }

    const tags = await knex("tags").where({ note_id: id }).orderBy("name");

    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at");

    return response.json({
      ...note,
      tags,
      links,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).first();

    await knex("notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const user_id = request.user.id;

    const { title, tags } = request.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("notes")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .distinct("notes.id")
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("tags.name", filterTags)
        .innerJoin("tags", "tags.note_id", "notes.id")
        .orderBy("notes.title");
    } else {
      notes = await knex("notes")
        .select(["id", "title", "user_id"])
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });

    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => {
        return tag.note_id === note.id;
      });

      return {
        ...note,
        tags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}

export default NotesController;
