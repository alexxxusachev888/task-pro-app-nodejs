const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError, errorMessages } = require('../helpers');

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Board`s title is required'],
      unique: true,
    },
    iconId: {
      type: String,
      required: [true, 'Board`s icons ID is required'],
    },
    backgroundId: {
      type: String,
      required: [true, 'Board`s background ID is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    // var 2 ==============================
    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: 'column',
      },
    ],
    // ====================================
  },
  { versionKey: false, timestamps: true }
);

const Board = model('board', boardSchema);
boardSchema.post('save', handleMongooseError);

const boardCreateSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages(errorMessages('title')),
  iconId: Joi.string().required().messages(errorMessages('icon')),
  backgroundId: Joi.string().required().messages(errorMessages('background')),
  owner: Joi.string().messages(errorMessages('owner')),
  columns: Joi.array().items(Joi.string()).optional(),
}).options({ abortEarly: false });

const boardUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(100).messages(errorMessages('title')),
  iconId: Joi.string().messages(errorMessages('icon')),
  backgroundId: Joi.string().messages(errorMessages('background')),
  owner: Joi.string().messages(errorMessages('owner')),
  columns: Joi.array().items(Joi.string()).optional(),
}).options({ abortEarly: false });

module.exports = { Board, boardCreateSchema, boardUpdateSchema, boardSchema };
