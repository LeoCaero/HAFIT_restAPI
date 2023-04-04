const express = require("express");
const router = express.Router();
const {Plan} = require("../models/plan");
const errors = require("../utils/errorMessages");
const {searchBy,deleteBy,autoincrement,editBy} = require ('../controllers/controller');
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
    let { name, planId, description } = req.query;
    if (notEmpty(name)) {   
      if (isAlphabet(name)) {
        if (!minAndMaxCharacter(name,2,10)) {
          return res.status(503).send(`El campo name como minimo debe de contner 2 caracteres y como maximo 10 caracteres`);
        }
      }else{
        return res.status(502).send(`Debe de contener solo letras. Valor escrito '${name}'`);
      }
    }else{
      return res.status(501).send(`El campo name no debe de estar vacio`);
    }

    if (notEmpty(description)) {
      if (isAlphabet(description)) {
        if (!minAndMaxCharacter(description,2,10)) {
          return res.status(503).send(`El campo description como minimo debe de contner 2 caracteres y como maximo 10 caracteres`);
        }
      }else{
        return res.status(502).send(`Debe de contener solo letras. Valor escrito '${description}'`);
      }
    }else{
      return res.status(501).send(`El campo description no debe de estar vacio`);
    }

    planId = await autoincrement(Plan,'planId');

    let newPlan = new Plan({
      name,
      planId,
      description,
    });

    const savedPlan = await newPlan.save();
    res.status(201).send(`El plan ${newPlan.name} con id ${newPlan.planId} se añadido correctamente`);

  } catch (error) {
    res.status(500).json({message: error.message});

  }
});


/**
 * @swagger
 * /api/plan/searchBy:
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
 *           type: string
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
router.get("/searchBy", async (req, res) => {
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