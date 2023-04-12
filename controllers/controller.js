const errors = require("../utils/errorMessages");

module.exports = {
  autoincrement: async function (model, fieldName) {
    let result = await model.findOne().sort({ [fieldName]: -1 });
    return result ? result[fieldName] + 1 : 1;
  },
  searchBy: async function (model, req, res) {
    let data = req.query.data;
    let search = req.query.search;
    let query = {};

    if (!search || !data) {
      if (req.body && Object.keys(req.body).length) {
        search = req.body.search;
        data = req.body.data;
      } else {
        res.status(404).json({ message: errors.notFound.missing });
      }
    }

    query[search] = data;

    try {
      let result = await model.findOne(query);
      if (result) {
        res.json(result);
      } else {
        let modelName = model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1);
        res.status(404).json({
          message: errors.notFound[modelName][search.charAt(0) + search.slice(1)],
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteBy: async function (model, req, res) {
    try {
      let { deleteBy, data } = req.query || req.body;
      if (!deleteBy || !data) {
        return res.status(400).json({ message: errors.notFound.missing });
      }

      let query = { [deleteBy]: data };
      let result = await model.findOneAndDelete(query);
      let modelName =
        model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1);
      if (!result) {
        res
          .status(404)
          .send(
            `No se encontró ${modelName.toUpperCase()} con "${deleteBy}" ${data}`
          );
      } else {
        res
          .status(200)
          .send(
            `El ${modelName.toUpperCase()} "${result.name}" ha sido eliminado`
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
          `Error al eliminar el ${modelName.toUpperCase()}: ${err.message}`
        );
    }
  },
  editBy: async function (model, req, res) {
    try {
      let modelName =
        model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1);
      let modelId = modelName + "Id";
      let { [modelId]: id } = req.body || req.query;
      let updates = req.body || req.query;
      const updatedDoc = await model.findOneAndUpdate(
        { [modelId]: id },
        updates,
        {
          new: true,
        }
      );
      res.status(200).json(updatedDoc);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
