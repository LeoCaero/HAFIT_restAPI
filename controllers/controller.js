const errors = require("../utils/errorMessages");
const { isAlphabet, isNumeric, notEmpty, minAndMaxCharacter } = require("../utils/validations");
const cloudinary = require('cloudinary').v2;
const upload = require("multer");
const uploads = require('../utils/uploads')
const fileUpload = require('express-fileupload');
const imageUploader = require('../utils/uploads');
const fs = require('fs');


module.exports = {
  autoincrement: async function (model, fieldName) {
    let result = await model.findOne().sort({ [fieldName]: -1 });
    return result ? result[fieldName] + 1 : 1;
  },

  searchBy: async function (model, req, res) {
    let data = req.query.data;
    let search = req.query.search;
    let query = {};
    // if (notEmpty(data)) {   
    //     if (!minAndMaxCharacter(data,2,10)) {
    //       return res.status(503).send(`El campo ${data} como minimo debe de contner 2 caracteres y como maximo 10 caracteres`);
    //     }
    //  }else{
    //     return res.status(501).send(`El campo ${data} no debe de estar vacio`);
    //   }
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
            return res.status(502).send(`El campo time debe de ser númerico`);
          }
        } else {
          return res.status(501).send(`El campo time debe de contener como mínimo 1 caracter`)
        }
      }
      if (updates.name) {
      if (notEmpty(updates.name)) {
        if (!minAndMaxCharacter(updates.name, 2, 15)) {
          return res.status(503).send(`El campo "Name" como minimo debe de contner 2 caracteres y como maximo 15 caracteres`);
        }
      } else {
        let updatesJson = JSON.stringify(updates)
        return res.status(501).send(`El campo "Name" no debe de estar vacio ${updatesJson}`);
      }
    }
    if (updates.description) {
      if (notEmpty(updates.description)) {

      } else {
        return res.status(501).send(`El campo "Description" no debe de estar vacio`);
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
  uploadImage: async function (req, res) {
    try {
      //CONFIGURATION 
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
      });
      let image = req.query.featuredImg || req.body.featuredImg || req.files;
      // const image = req.file.path;
      console.log('Image: ', image)
      console.log(req.file.file[0]);
      // const resultUpload = imageUploader.uploadImage();
      // console.log(resultUpload)
      //SAVE TO EXPRESS
      // let imageUpdate = imageUploader.uploadImage('featuredImg')
      // console.log(imageUpdate)
      // upload.single('featuredImg')(req, res, function(err) {
      //   console.log(req.featuredImg)
      //   if (err) {
      //     return res.status(500).send(err);
      //   }
      //   // la imagen se ha subido correctamente
      //   const imageUrl = req.file.filename;
      //   console.log(imageUrl)
      //   // aquí puedes hacer lo que quieras con la URL de la imagen
      //   res.status(200).json(imageUrl);
      // });

      // // // UPLOAD
      // let dateOb = new Date();
      // let date = ("0" + dateOb.getDate()).slice(-2);
      // let month = ("0" + (dateOb.getMonth() + 1)).slice(-2);
      // let year = dateOb.getFullYear();
      // let hours = dateOb.getHours();
      // let minuts = dateOb.getMinutes();
      // let seconds = dateOb.getSeconds();
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };


      // console.log('hola');
      // Leemos la imagen como un archivo binario
      // let imageFile = fs.readFileSync(image);
      // console.log(imageFile)
      // // Escribimos la imagen a un nuevo archivo

      // fs.writeFileSync('../uploads/nueva-imagen.png', imageFile);

      try {
        // Upload the image
        // const result = await cloudinary.uploader.upload('https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg', options);
        const result = await cloudinary.uploader.upload(image, options);
        console.log(result);
        res.status(200).json(result.secure_url)
      } catch (error) {
        console.error(error);
      }
      // const result =  await cloudinary.uploader.upload(image, { public_id: "plans/"+date+"-"+month+"-"+year+"_"+hours+"_"+minuts+"_"+seconds });
      // console.log(result);
      // result.then((data) => {
      //   console.log(data);
      //   console.log(data.secure_url);
      //   res.status(200).json(data)
      // }).catch((err) => {
      //   console.log(err);
      // });

      // const fs = require('fs')


      // const stream = cloudinary.uploader.upload_stream({ 
      //   folder: 'plans',
      //   public_id: date+"-"+month+"-"+year+"_"+hours+"_"+minuts+"_"+seconds 
      // }, function(err, res) {
      //   console.log(res);
      // });

      // const filePath = '../public/images/'+image;
      // const readStream = fs.createReadStream(filePath);

      // readStream.pipe(stream);

      // // GENERATE 
      // const url = cloudinary.url("plans/plan_desc_image", {
      //     width: 100,
      //     height: 150,
      //     crop: 'scale'
      // });
    } catch (error) {
      res.status(500).send(`Error ${error.errorMessage}`)

    }
  }

};
