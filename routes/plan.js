const express = require("express");
const router = express.Router();
const {Plan} = require("../models/plan");
const errors = require("../utils/errorMessages");

const {searchBy,deleteBy,autoincrement,editBy, uploadImage} = require ('../controllers/controller');
const {isAlphabet, notEmpty,minAndMaxCharacter} = require ('../utils/validations');


module.exports = router;

/**
 * @swagger
 * /api/plan/all:
 *   get:
 *     summary: Get ALL plans
 *     tags: [Plans]
 *     description: Get all plans stored in the database
 *     responses:
 *       200:
 *         description: A list of plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 *       500:
 *         description: Internal server error
 */
router.get("/all", async (req, res) => {
  try {
    const data = await Plan.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/**
 * @swagger
 * /api/plan/add:
 *   post:
 *     summary: Create a new plan
 *     tags: [Plans]
 *     description: Create a new plan and store it in the database
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Plan name
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Plan description
 *       - in: query
 *         name: featuredImg
 *         schema:
 *           type: string
 *         description: Plan featuredImg
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
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
router.post("/add",async (req, res) => {
  try {
  
    let name = req.body.name || req.query.name;
    let description = req.body.description || req.query.description;
    let featuredImg = req.body.featuredImg || req.query.featuredImg;
    
    // if (notEmpty(name)) {   
    //     if (!minAndMaxCharacter(name,2,15)) {
    //       return res.status(503).send(`El campo "Name" como minimo debe de contner 2 caracteres y como maximo 15 caracteres`);
    //     }
    // }else{
    //   return res.status(501).send(`El campo "Name" no debe de estar vacio`);
    // }

    // if (notEmpty(description)) {
    //     if (!minAndMaxCharacter(description,2,200)) {
    //       return res.status(503).send(`El campo "Description" como minimo debe de contner 2 caracteres y como maximo 200 caracteres`);
    //     }
    // }else{
    //   return res.status(501).send(`El campo "Description" no debe de estar vacio`);
    // }

    let planId = await autoincrement(Plan,'planId');
    const newPlan = new Plan({
      name,
      description,
      planId,
      featuredImg
    });
    console.log(newPlan)
    
    const savedPlan = await newPlan.save();
    console.log('saved plan ',savedPlan)
    res.status(201).json(savedPlan);

  } catch (error) {
    res.status(500).json({message: error.message});

  }
});


/**
 * @swagger
 * /api/plan/search:
 *   get:
 *     summary: Get plan by everything you want
 *     tags: [Plans]
 *     description: Get a plan by everything you want
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           enum: [ "name", "planId"]
 *         description: "Search plan by"
 *         required: true
 *       - in: query
 *         name: data
 *         schema:
 *           type: integer
 *         required: true
 *         description: The data of the user to retrieve       
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Internal server error
 */
router.get("/search", async (req, res) => {
  await searchBy(Plan,req,res)
});

/**
 * @swagger
 * /api/plan/delete:
 *   delete:
 *     summary: Delete plan by X
 *     tags: [Plans]
 *     description: Delete a plan by the selected option
 *     parameters:
 *       - in: query
 *         name: deleteBy
 *         schema:
 *           type: string
 *           enum: ["name", "planId"]
 *         description: "Delete plan by"
 *         required: true
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: true
 *         description: The data of the plan to delete
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete", async (req, res) => {
  await deleteBy(Plan, req, res);
});
/**
 * @swagger
 * /api/plan/edit:
 *   put:
 *     summary: Edit plan
 *     tags: [Plans]
 *     description: Edit a plan
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: "Name of the product"
 *       - in: query
 *         name: planId
 *         schema:
 *           type: integer
 *         description: "The planId of the plan"
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: "Description of the plan"       
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Internal server error
 */
router.put('/edit',async (req,res) =>{
    await editBy(Plan,req,res);
  });
/**
 * @swagger
 * /api/plan/filter:
 *   get:
 *     summary: Filter plan
 *     tags: [Plans]
 *     description: Filter  plan
 *     parameters:
 *       - in: query
 *         name: filterBy
 *         schema:
 *            type: string
 *            enum: ["name", "planId","description"]
 *         description: "Name of the product"
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: "The planId of the plan"    
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Internal server error
 */
  router.get('/filter',async(req,res)=>{
    try {
      let filterBy = req.query.filterBy || req.body.filterBy;
      let filter = req.query.filter || req.body.filter;
      let data;

    if (filterBy === 'planId') {//IF IT IS PLANID, NORMAL FILTER
       data = await Plan.find({[filterBy]: filter });
    } else {//IF IS NOT PLANID FILTER USING REGEX
      data = await Plan.find({[filterBy]: { $regex: new RegExp(filter, 'i') } });

    }
      console.log(filterBy)
      console.log(filter)
      console.log(data)
      res.json(data)
    } catch (error) {
      res.send(`Error ${error.message}`)
    }
  })
/**
 * @swagger
 * /api/plan/uploadImages:
 *   post:
 *     summary: Upload images plan
 *     tags: [Plans]
 *     description: Upload images  plan
 *     consumes:
 *       - "multipart/form-data"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: "Archivo de imagen para subir"
 *         required: false
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Internal server error
 */
  router.post('/uploadImages',async(req,res)=>{
    return await uploadImage(req,res);
  })