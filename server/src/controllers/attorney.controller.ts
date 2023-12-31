import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import cloudinary from "../middleware/cloudinary";
import fs from "fs";
import path from "path";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./common/factory.controller";
import Attorney from "../models/attorney/attorney.model";
import AttorneyContent from "../models/attorney/attorneyContent.model";
import AppError from "../utils/appErrors";
import mongoose from "mongoose";

/* Main */
export const getAllAttorneys = getAll(Attorney);
export const getAttorneyById = getOne(Attorney);

export const createAttorney = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let createdData = req.body;

    const data = await Attorney.create(createdData);

    if (req.file) {
      const tempDirPath = path.join(__dirname, "../images/product");
      /* If not exist */
      if (!fs.existsSync(tempDirPath)) {
        fs.mkdirSync(tempDirPath, { recursive: true });
      }

      const tempFilePath = tempDirPath + "/" + req.file.originalname;

      fs.writeFileSync(tempFilePath, req.file.buffer);

      const cloudUpload = await cloudinary.uploader.upload(tempFilePath, {
        folder: "Legal_Space/Attorneys",
      });

      if (createdData.image?.public_id) {
        await cloudinary.uploader.destroy(createdData.image.public_id);
      }

      const cloudImage = {
        public_id: cloudUpload.public_id,
        url: cloudUpload.secure_url,
      };

      data.image = cloudImage;
      data.save({ validateBeforeSave: false });

      // Remove the temporary file after uploading to Cloudinary
      fs.unlink(tempFilePath, () => {});
    }

    res.status(201).json({
      status: "success",
      data,
    });
  }
);

export const updateAttorney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    let updatedData = { ...body };

    const data = await Attorney.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return next(new AppError("No document found with that ID", 404));
    }

    if (req.file) {
      const tempDirPath = path.join(__dirname, "../images/product");
      /* If not exist */
      if (!fs.existsSync(tempDirPath)) {
        fs.mkdirSync(tempDirPath, { recursive: true });
      }

      const tempFilePath = tempDirPath + "/" + req.file.originalname;

      fs.writeFileSync(tempFilePath, req.file.buffer);

      const cloudUpload = await cloudinary.uploader.upload(tempFilePath, {
        folder: "Legal_Space/Attorneys",
      });

      if (data.image?.public_id) {
        await cloudinary.uploader.destroy(data.image.public_id);
      }

      const cloudImage = {
        public_id: cloudUpload.public_id,
        url: cloudUpload.secure_url,
      };

      data.image = cloudImage;
      data.save({ validateBeforeSave: false });

      // Remove the temporary file after uploading to Cloudinary
      fs.unlink(tempFilePath, () => {});
    }

    res.status(200).json({
      status: "success",
      data,
    });
  }
);
export const deleteAttorney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const data = await Attorney.findByIdAndDelete(req.params.id).session(session);

      if (!data) {
        return next(new AppError("No Document found with that ID", 404));
      }
      if (data.image?.public_id) {
        await cloudinary.uploader.destroy(data.image.public_id);
      }

      await AttorneyContent.find({ blog_id: data.id })
        .deleteMany()
        .session(session);
      await session.commitTransaction();

      res.status(204).json({
        status: "success",
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }
);

/* Content */
export const getAllAttorneyContent = getAll(AttorneyContent);
export const getOneAttorneyContent = getOne(AttorneyContent);
export const createAttorneyContent = createOne(AttorneyContent);
export const updateAttorneyContent = updateOne(AttorneyContent);
export const deleteAttorneyContent = deleteOne(AttorneyContent);
