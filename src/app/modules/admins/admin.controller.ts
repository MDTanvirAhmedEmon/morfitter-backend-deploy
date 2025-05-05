import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.services";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    // console.log(data);
    const result = await adminServices.createAdmin(data)

    res.status(200).json({
      success: true,
      message: 'Admin Created Successfully',
      data: result,
    })
  }
  catch (error) {
    next(error)
  }
}


const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req?.file
      const user = req.user
      const data = JSON.parse(req?.body?.data)

        const result = await adminServices.updateAdmin(user, file, data);

        res.status(200).json({
            success: true,
            message: 'admin updated successfully',
            data: result,
        })
        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'user created successfully',
        //     data: result,
        // });
    }
    catch (error) {
        next(error)
    }
}

const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
        const result = await adminServices.getAdmin(user);

        res.status(200).json({
            success: true,
            message: 'get admin info successfully',
            data: result,
        })

    }
    catch (error) {
        next(error)
    }
}


export const adminController = {
    createAdmin,
    updateAdmin,
    getAdmin,
}