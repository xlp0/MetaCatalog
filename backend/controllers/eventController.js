const asyncHandler = require('express-async-handler')

const Event = require('../models/eventModel')
const User = require('../models/userModel')

const isParsableIntoJSONObject = (v) => {
  try {
    let obj = JSON.parse(v);
    return true;
  } catch (e) {
    return false;
  }
}

// @desc    Get events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ user: req.user.id })

  res.status(200).json(events)
})

// @desc    Set event
// @route   POST /api/events
// @access  Private
const setEvent = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }
  if (!isParsableIntoJSONObject(req.body.instruction)) {
    res.status(400)
    throw new Error('The instruction field must be a JSON string')
  }



  const event = await Event.create({
    text: req.body.text,
    instruction: req.body.instruction,
    user: req.user.id,
  })

  res.status(200).json(event)
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(400)
    throw new Error('Event not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the event user
  if (event.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedEvent)
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(400)
    throw new Error('Event not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the event user
  if (event.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await event.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getEvents,
  setEvent,
  updateEvent,
  deleteEvent,
}
