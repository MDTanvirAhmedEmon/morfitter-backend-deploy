import { JwtPayload, Secret } from "jsonwebtoken";
import { IPaginationOptions } from "../../global/globalType";
import { paginationHelpers } from "../../helpers/pagination";
import { User } from "../users/user.model";
import { ITrainee } from "./trainee.interface";
import { Trainee } from "./trainee.model";
import mongoose from "mongoose";
import { createToken } from "../../helpers/jwtHelper";
import config from "../../config";
// import { uploadToCloudinary } from "../../helpers/fileUploader";


const getAllTrainee = async (paginationOptions: IPaginationOptions, searchTerm: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];


    const contentSearchableFields = ["firstName", "lastName", "email"];

    if (searchTerm) {
        andConditions.push({
            $or: contentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }


    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' || sortOrder === 'ascending' ? 1 : -1;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Trainee.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
    const total = await Trainee.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };

}

const updateTrainee = async (file: any, id: string, data: Partial<ITrainee>, user: any, userId: any) => {
    // console.log('data', data);
    // console.log('file', file);
    data = data || {};
    // if (file) {
    //     const uploadedImage: any = await uploadToCloudinary(file)
    //     data.profileImageUrl = uploadedImage.secure_url
    // }
    if (file) {
        data.profileImageUrl = `/uploads/${file.filename}`;
    }
    let userInfo = null;
    if (user?.email) {
        userInfo = await User.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(String(userId.id)) }, user, { new: true })
    }

    const result = await Trainee.findByIdAndUpdate(
        {
            _id: id
        },
        data,
        {
            new: true
        }
    )
    const tokenPayload = {
        email: userInfo?.email,
        id: userInfo?._id,
        role: userInfo?.role,
        status: userInfo?.status
    }

    const accessToken = createToken(
        tokenPayload,
        config.jwt_access_secret as Secret,
        config.jwt_access_expires_in as string,
    )

    return {
        accessToken
    }

}

const getAllForAdminTrainee = async (
    paginationOptions: IPaginationOptions,
    searchTerm: any,
    filtersData: any
): Promise<any> => {
    const { limit, page, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const andConditions: any[] = [];

    const contentSearchableFields = ["firstName", "lastName"];

    if (searchTerm) {
        andConditions.push({
            $or: contentSearchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        });
    }

    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === "asc" || sortOrder === "ascending" ? 1 : -1;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Trainee.aggregate([
        {
            $match: whereConditions,
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userData",
            },
        },

        {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $sort: sortConditions,
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $project: {

                userData: {
                    password: 0,

                },
            },
        },
    ]);

    const total = await Trainee.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};


const getTraineesByMonth = async () => {
    const result = await Trainee.aggregate([
        {
            $group: {
                _id: { $month: '$createdAt' },
                user: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                month: {
                    $let: {
                        vars: {
                            months: [
                                'jan', 'feb', 'mar', 'apr', 'may', 'jun',
                                'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
                            ],
                        },
                        in: { $arrayElemAt: ['$$months', { $subtract: ['$_id', 1] }] },
                    },
                },
                user: 1,
            },
        },
    ]);


    const allMonths = [
        { month: 'jan', user: 0 }, { month: 'feb', user: 0 },
        { month: 'mar', user: 0 }, { month: 'apr', user: 0 },
        { month: 'may', user: 0 }, { month: 'jun', user: 0 },
        { month: 'jul', user: 0 }, { month: 'aug', user: 0 },
        { month: 'sep', user: 0 }, { month: 'oct', user: 0 },
        { month: 'nov', user: 0 }, { month: 'dec', user: 0 },
    ];

    result.forEach(({ month, user }) => {
        const index = allMonths.findIndex((m) => m.month === month);
        if (index !== -1) {
            allMonths[index].user = user;
        }
    });

    return allMonths;
};

export const traineeServices = {
    getAllTrainee,
    updateTrainee,
    getAllForAdminTrainee,
    getTraineesByMonth,
}