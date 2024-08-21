const express = require("express");
const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");
const bookModel = require("../schema/books.schema");

const bookRouter = express.Router();

bookRouter.post("/create", [auth, checkRole("CREATOR")], async (req, res) => {
  const { title, author } = req.body;
  try {
    const book = new bookModel({ title, author, createdBy: req.user.id });
    await book.save();
    res.status(201).json({ data: book, msg: "Book created successfully" });
  } catch (error) {
    res.status(500).json({ msg: `error while creating books ${error}` });
  }
});

bookRouter.get("/", [auth], async (req, res) => {
  try {
    const { sortBy, order = "asc", old, new: isNew } = req.query;
    const user = req.user;
    let query = {};
    if (user.roles.includes("VIEW_ALL")) {
      query = {};
    } else if (
      user.roles.includes("VIEWER") ||
      user.roles.includes("CREATOR")
    ) {
      query.createdBy = user._id;
    }
    let now = new Date();

    if (old) {
      query.createdAt = { $lte: new Date(now.getTime() - 10 * 60 * 1000) };
    } else if (isNew) {
      query.createdAt = { $gt: new Date(now.getTime() - 10 * 60 * 1000) };
    }

    let sortCriteria = {};
    if (sortBy) {
      sortCriteria[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sortCriteria.createdAt = -1;
    }

    const books = await bookModel.find(query).sort(sortCriteria);

    res
      .status(201)
      .json({ success: true, data: books, msg: `Books found successfully` });
  } catch (error) {
    res.status(500).json({ msg: `error while getting books ${error}` });
  }
});

bookRouter.get("/view/:id", [auth], async (req, res) => {
  const { id } = req.params;
  const _id = id.toString();

  try {
    const book = await bookModel.findById({ _id });

    res.status(201).json({ msg: `Book found successfully ${book} ` });
  } catch (error) {
    res.status(500).json({ msg: `error while getting books ${error}` });
  }
});

bookRouter.put("/edit/:id", [auth, checkRole("CREATOR")], async (req, res) => {
  const { id } = req.params;
  const _id = id.toString();
  const { title, author } = req.body;
  try {
    const book = await bookModel.findByIdAndUpdate(
      { _id },
      { title, author },
      { new: true }
    );

    res.status(201).json({ msg: `Book updated successfully ${book} ` });
  } catch (error) {
    res.status(500).json({ msg: `error while updating books ${error}` });
  }
});

bookRouter.delete(
  "/delete/:id",
  [auth, checkRole("CREATOR")],
  async (req, res) => {
    const { id } = req.params;
    const _id = id.toString();

    try {
      const book = await bookModel.findByIdAndDelete({ _id });

      res.status(201).json({ msg: `Book deleted successfully ${book} ` });
    } catch (error) {
      res.status(500).json({ msg: `error while deleting books ${error}` });
    }
  }
);

module.exports = bookRouter;
