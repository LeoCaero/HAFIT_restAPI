const express = require("express");
const Exercice = require("../models/exercice");
const router = express.Router();
const {searchBy,deleteBy,autoincrement,editBy} = require ('../controllers/controller');
const {isAlphabet, notEmpty,minAndMaxCharacter,isNumeric} = require ('../utils/validations');
const User   = require("../models/user");

module.exports = router;

/**
 * @swagger
 * /api/exercice/all:
 *   get:
 *     summary: Get ALL exercices
 *     tags: [Exercices]
 *     description: Get all exercices stored in the database
 *     responses:
 *       200:
 *         description: A list of exercices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercices'
 *       500:
 *         description: Internal server error
 */
router.get('/all',async(req,res) =>{
    try {
        const data = await Exercice.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});
/**
 * @swagger
 * /api/exercice/add:
 *   post:
 *     summary: Create a new exercice
 *     tags: [Exercices]
 *     description: Create a new exercice and store it in the database
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Exercice name
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Exercice description
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         description: Exercice time
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercice'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post('/add',async(req,res)=>{
    try {
        let time = req.body.time || req.query;
        let name = req.body.name || req.query.name;
        let description = req.body.description || req.query.description;
        let featuredImg = req.body.featuredImg || req.query.featuredImg;
        let _id = req.body._id || req.query._id;
        
        if (notEmpty(name)) {   
              if (!minAndMaxCharacter(name,2,15)) {
                return res.status(503).send(`El campo "Nombre" como minimo debe de contner 2 caracteres y como maximo 10 caracteres`);
              }
          }else{
            return res.status(501).send(`El campo "Nombre" no debe de estar vacio`);
          }
    
        const exerciceId = await autoincrement(Exercice,'exerciceId');

    if (notEmpty(description)) {
          if (!minAndMaxCharacter(description,2,250)) {
            return res.status(503).send(`El campo "Descripción" como minimo debe de contner 2 caracteres y como maximo 10 caracteres`);
          }
      }else{
        return res.status(501).send(`El campo "Descripción" no debe de estar vacio`);
      }

      if(notEmpty(time)){
        if (!isNumeric(time)) {
            return res.status(502).send(`El campo "Tiempo estimado" debe de ser númerico`);
        }
      }else{
        return res.status(501).send(`El campo "Timepo estimado" debe de contener como mínimo 1 caracter`)
      }
      let newExercice = new Exercice({
          name,
          exerciceId,
          description,
          featuredImg,
          time,
      });
      const savedExercice = await newExercice.save();
      res.status(201).json(savedExercice)
     } catch (error) {
      res.status(500).json({message: error.message});
    }
});
/**
 * @swagger
 * /api/exercice/search:
 *   get:
 *     summary: Get exercice by everything you want
 *     tags: [Exercices]
 *     description: Get a exercice by everything you want
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           enum: [ "name", "exerciceId"]
 *         description: "Search exercice by"
 *         required: true
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: true
 *         description: The data of the user to retrieve       
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercice'
 *       404:
 *         description: Exercice not found
 *       500:
 *         description: Internal server error
 */
router.get("/search", async (req, res) => {
    await searchBy(Exercice,req,res)
  });
  
  /**
   * @swagger
   * /api/exercice/delete:
   *   delete:
   *     summary: Delete exercice by X
   *     tags: [Exercices]
   *     description: Delete a exercice by the selected option
   *     parameters:
   *       - in: query
   *         name: deleteBy
   *         schema:
   *           type: string
   *           enum: ["name", "exerciceId"]
   *         description: "Delete exercice by"
   *         required: true
   *       - in: query
   *         name: data
   *         schema:
   *           type: string
   *         required: true
   *         description: The data of the exercice to delete
   *     responses:
   *       200:
   *         description: exercice deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/exercice'
   *       404:
   *         description: exercice not found
   *       500:
   *         description: Internal server error
   */
  router.delete("/delete", async (req, res) => {
    await deleteBy(Exercice, req, res);
  });
  /**
   * @swagger
   * /api/exercice/edit:
   *   put:
   *     summary: Edit exercice
   *     tags: [Exercices]
   *     description: Edit a exercice
   *     parameters:
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *         description: "Name of the exercice"
   *       - in: query
   *         name: exerciceId
   *         schema:
   *           type: integer
   *         description: "The exerciceId of the plan"
   *       - in: query
   *         name: description
   *         schema:
   *           type: string
   *         description: "Description of the exercice"     
   *       - in: query
   *         name: time
   *         schema:
   *           type: string
   *         description: "Time of the exercice"       
   *     responses:
   *       200:
   *         description: A user object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/exercice'
   *       404:
   *         description: exercice not found
   *       500:
   *         description: Internal server error
   */
  router.put('/edit',async (req,res) =>{
      await editBy(Exercice,req,res);
    });

    router.put("/users", async (req, res) => {
        try {
          const { userId, exerciceId } = req.body;
          const user = await User.findById(userId);
          console.log(user)
          if (!user) {
            throw new Error("Exercice no encontrado");
          }
      
          const exercice = await Exercice.findOneAndUpdate({exerciceId:exerciceId},{$push:{user:user}},{new:true});
          console.log(exercice)
          updatedPlan = await exercice.save();
      
          res.status(200).json(`Exercice Upated ${updatedPlan}`);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      });