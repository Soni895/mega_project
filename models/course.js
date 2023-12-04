const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
  CourseName: {
    type: String,
    required: true,
    trim: true,
  },
  CourseDescription: {
    type: String,
    required: true,
    trim: true,
  },
  Instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  WhatYouWillLearn: {
    type: String,
  },

  CourseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
  ],
  RatingAndREview: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndREview",
      required: true,
    },
  ],
  Price: {
    type: Number,
    required: true,
  },
  Tag: {
    type: [String],
    required: true,
  },

  Thumbmail: {
    type: String,
    required: true,
  },
  Category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  StudentEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  CreateAt: {
    type: Date,
    default: Date.now,
  },
  Status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  Instructions: {
    type: [String],
  },
},{ timestamps: true });
const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
