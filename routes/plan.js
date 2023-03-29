const express = require("express");
const router = express.Router();
const {Plan,findAndDelete} = require("../models/plan");
const errors = require("../utils/errorMessages");
const {searchBy,deleteBy,autoincrement} = require ('../controllers/controller');


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
router.post("/add", async (req, res) => {
  try {
    let { name, planId, description } = req.query;
    // let lastPlan = await Plan.findOne().sort({planId:-1});
    // planId = lastPlan ? lastPlan.planId+1 : 1;
    planId = parseInt(await autoincrement(Plan,'planId'));
    console.log(planId)

    let newPlan = new Plan({
      name,
      planId,
      description,
    });

    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);

  } catch (error) {
    res.status(400).json({ message: error.message });

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
 *         name: searchBy
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
  const data = req.query.data;
  const searchBy = req.query.searchBy;
  const query = {};
  query[searchBy] = data;

  try {
    const plan = await Plan.findOne(query);
    if (plan) {
      res.json(plan);
    } else {
      res.status(404).json({
        message: errors.notFound[searchBy.charAt(0) + searchBy.slice(1)],
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

router.put('/edit',async (req,res) =>{

});