import { Course } from "../model";
import { newCourseSchema } from "../schema";
import { Factory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

const { createHandlers } = new Factory();

const getCourses = createHandlers(async (c) => {
  const courses = await Course.aggregate([
    {
      $lookup: {
        from: "depts",
        localField: "deptId",
        foreignField: "_id",
        as: "dept",
      },
    },
    {
      $unwind: {
        path: "$dept",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: {
        path: "$createdBy",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  return c.json({
    data: courses,
    message: "Courses",
  });
});

const addNewCourse = createHandlers(
  zValidator("json", newCourseSchema),
  async (c) => {
    const { name, deptId, duration } = c.req.valid("json");
    const { _id: createdBy } = c.get("jwtPayload");

    const newCourse = new Course({ name, deptId, duration, createdBy });
    const savedCourse = await newCourse.save();

    return c.json({
      data: savedCourse,
      message: "Course Added Successfully",
    });
  },
);

const deleteCourse = createHandlers(async (c) => {
  const courseId = c.req.param("courseId");

  const deletedCourse = await Course.findByIdAndDelete(courseId);

  if (!deletedCourse) {
    return c.json(
      {
        data: null,
        message: "Course doesn't exists",
      },
      400,
    );
  }

  return c.json({
    data: deletedCourse,
    message: "Course Deleted Successfully",
  });
});

export { getCourses, addNewCourse, deleteCourse };
