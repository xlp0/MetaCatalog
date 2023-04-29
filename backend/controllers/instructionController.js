const asyncHandler = require('express-async-handler')


// @desc    Get instructions
// @route   GET /api/instructions
// @access  Private
const getInstructions = asyncHandler(async (req, res) => {
    const instructions = ["ls","cat","ps","du"]
  
    res.status(200).json(instructions)
  })

  

// @desc    Set instruction
// @route   POST /api/instruction
// @access  Private
const executeInstruction = asyncHandler(async (req, res) => {
  if (!req?.body) {
    res.status(400)
    throw new Error('Please supply some text value')
  }

  console.log(JSON.stringify(req?.body))

  res.status(200).json(req?.body)
})

module.exports = {
    getInstructions,
    executeInstruction
}