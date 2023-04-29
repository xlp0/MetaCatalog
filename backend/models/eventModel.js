const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
const eventSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    instruction: {
      type: Object,
      required: true,
      validate: {
        validator: function(v) {
          try {
            JSON.parse(v);
            return true;
          } catch (e) {
            return false;
          }
        }
      },
      message: props => `${props.value} is not a valid JSON object: { key1: value1, key2: value2, ...}`
    },
    text: {
      type: String,
      required: [true, 'Please present an event description.'],
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Event', eventSchema)
