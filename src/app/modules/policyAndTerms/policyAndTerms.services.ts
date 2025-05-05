import AppError from "../../errors/AppError";
import { IPolicy, ITerms } from "./policyAndTerms.interface"
import { Policy, Terms } from "./policyAndTerms.model"


const createPolicy = async ( data: IPolicy ): Promise<IPolicy | null> => {
    const isExist = await Policy.find();
    if(isExist.length > 0) {
        throw new AppError(400, 'already have a privacy policy')
    }
    const result = await Policy.create(data)
    return result
}
const getPolicy = async (): Promise<IPolicy[]> => {
    const result = await Policy.find();
    return result
}

const updatePolicy = async (id: string, data: Partial<IPolicy>): Promise<IPolicy | null> => {

    const result = await Policy.findByIdAndUpdate(
        { _id: id },
        data,
        { new: true }
    );

    return result
}

const createTerm = async ( data: ITerms ): Promise<ITerms | null> => {
    const isExist = await Terms.find();
    console.log(isExist);
    if(isExist.length > 0) {
        throw new AppError(400, 'already have a terms and condition')
    }
    const result = await Terms.create(data)
    return result
}
const getTerm = async (): Promise<ITerms[]> => {
    const result = await Terms.find();
    return result
}

const updateTerm = async (id: string, data: Partial<ITerms>): Promise<ITerms | null> => {

    const result = await Terms.findByIdAndUpdate(
        { _id: id },
        data,
        { new: true }
    );

    return result
}

export const policyAndTemrmsServices = {
    createPolicy,
    createTerm,
    getPolicy,
    updatePolicy,
    getTerm,
    updateTerm,
}