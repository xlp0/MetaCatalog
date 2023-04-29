const express = require('express')
const router = express.Router()
const {
    getInstructions,
    executeInstruction
} = require('../controllers/instructionController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getInstructions)
router.route('/').post(protect, executeInstruction)

module.exports = router
