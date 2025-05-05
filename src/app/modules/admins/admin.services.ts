import mongoose from "mongoose"
import AppError from "../../errors/AppError"
import { IAdmin } from "./admin.interface"
import { Admin } from "./admin.model"
import { IReqUser } from "../../global/globalType"
import { JwtPayload } from "jsonwebtoken"
// import { uploadToCloudinary } from "../../helpers/fileUploader"


const createAdmin = async (data: IAdmin): Promise<IAdmin> => {
    const isExist = await Admin.findOne({ email: data?.email })
    if (isExist) {
        throw new AppError(409, 'Admin already exist!')
    }
    const adminData = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        password: data?.password,
        "role": "admin",
        "status": "in-progress"
    }
    const result = await Admin.create(adminData)
    return result
}


const updateAdmin = async (user: any, file: any, data: Partial<IAdmin>) => {

    if (file) {
        data.profileImageUrl = `/uploads/${file.filename}`;
        // const uploadedImage: any = await uploadToCloudinary(file)
        // data.profileImageUrl = uploadedImage.secure_url
    }

    const result = await Admin.findByIdAndUpdate(
        { _id: user.id },
        data,
        { new: true }
    );

    return result

}

const getAdmin = async (user: JwtPayload | null) => {
    if (!user) {
        throw new AppError(400, 'User is not authenticated');
    }
    const result = await Admin.aggregate([
        { $match: { _id:  new mongoose.Types.ObjectId(user.id)} },
        { $project: { password: 0 } }
    ])

    return result
}

export const adminServices = {
    createAdmin,
    updateAdmin,
    getAdmin,
}