import { IQualification } from "./qualification.interface"
import { Qualification } from "./qualification.model"


const createQualification = async (id: string, data: Partial<IQualification>): Promise<IQualification> => {

    const finalData = {
        qualification: data?.qualification,
        trainer_id: id
    }

    const result = await Qualification.create(finalData)
    return result
}

const getAllOfUserQualification = async (id: string): Promise<IQualification[] | null> => {
    const result = await Qualification.find({ trainer_id: id });
    return result;
}

const deleteQualification = async (id: string): Promise<IQualification | null> => {
    const result = await Qualification.findByIdAndDelete({ _id: id });
    return result;
}

export const qualificationServices = {
    createQualification,
    getAllOfUserQualification,
    deleteQualification,
}