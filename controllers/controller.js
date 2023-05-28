const errors = require("../utils/errorMessages");
const { isAlphabet, isNumeric, notEmpty, minAndMaxCharacter } = require("../utils/validations");


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
        data = new RegExp(["^", req.body.data, "$"].join(""), "i");
      } else {
        res.status(404).json({ message: errors.notFound.missing });
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
    let modelName;
    try {
      let data = req.query.data;
      let deleteBy = req.query.deleteBy;
      let query = {};

      if (!deleteBy || !data) {
        if (req.body && Object.keys(req.body).length) {
          deleteBy = req.body.deleteBy;
          data = new RegExp(["^", req.body.data, "$"].join(""), "i");
        } else {
          res.status(404).json({ message: errors.notFound.missing });
        }
        if (req.body && Object.keys(req.body).length) {
          deleteBy = req.body.deleteBy;
          data = new RegExp(["^", req.body.data, "$"].join(""), "i");
        } else {
          res.status(404).json({ message: errors.notFound.missing });
        }
      }

      query[deleteBy] = data;

      let result = await model.findOneAndDelete(query);
      modelName =
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
          .json(
            { message: `El ${modelName.toUpperCase()} "${result.name}" ha sido eliminado` }
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

      let modelName = model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1);
      let modelId = modelName + "Id";
      let { [modelId]: id, ...updates } = req.query || req.body;
      console.log(updates);
      if (updates.time) {
        if (notEmpty(updates.time)) {
          if (!isNumeric(updates.time)) {
            return res.status(502).send(`El campo "Tiempo estimado"" debe de ser númerico`);
          }
        } else {
          return res.status(501).send(`El campo "Tiempo estimado" debe de contener como mínimo 1 caracter`)
        }
      }
      if (updates.name) {
      if (notEmpty(updates.name)) {
        if (!minAndMaxCharacter(updates.name, 2, 15)) {
          return res.status(503).send(`El campo "Nombre" como minimo debe de contner 2 caracteres y como maximo 15 caracteres`);
        }
      } else {
        let updatesJson = JSON.stringify(updates)
        return res.status(501).send(`El campo "Nombre" no debe de estar vacio ${updatesJson}`);
      }
    }
    if (updates.description) {
      if (notEmpty(updates.description)) {

      } else {
        return res.status(501).send(`El campo "Descripción" no debe de estar vacio`);
      }
    }
    if (updates.id) {
      if (!isNumeric(id)) {
        return res.status(502).send(`El ${modelId} debe de ser un número`);
      }
    }
      const updatedDoc = await model.findOneAndUpdate({ [modelId]: id }, updates, {
        new: true,
        // runValidators: true,
      });

      res.status(200).json(updatedDoc);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  editType: async function (model, req, res) {
    try {

      let modelName = model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1);
      let modelId = modelName + "Id";
      let { [modelId]: id, ...updates } = req.query || req.body;

      const updatedDoc = await model.findOneAndUpdate({ [modelId]: id }, updates, {
        // new: true,
        // runValidators: true,
      });

      res.status(200).json({ updatedDoc });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  filter: async function (filterBy, model, req, res) {
    try {
      let filter = req.query.filter || req.body.filter
      db.model.find({ [filterBy]: { $regex: new RegExp(filter, 'i') } })
    } catch (error) {
      res.send(`Error ${error.message}`)
    }
  },


};
