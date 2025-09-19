import AppError from "../../errors/AppError";
import { IHelpCenter, IPolicy, ISocialLinks, ITerms } from "./policyAndTerms.interface"
import { HelpCenter, Policy, SocialLinks, Terms } from "./policyAndTerms.model"


const createPolicy = async (data: IPolicy): Promise<IPolicy | null> => {
    const isExist = await Policy.find();
    if (isExist.length > 0) {
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

const createTerm = async (data: ITerms): Promise<ITerms | null> => {
    const isExist = await Terms.find();
    console.log(isExist);
    if (isExist.length > 0) {
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

const createUpdateSocial = async (data: Partial<ISocialLinks>): Promise<ISocialLinks | null> => {
    const existing = await SocialLinks.findOne();

    if (!existing) {
        const created = await SocialLinks.create(data);
        return created;
    }

    const updated = await SocialLinks.findByIdAndUpdate(
        existing._id,
        { $set: data },
        { new: true }
    );

    if (!updated) {
        throw new AppError(500, "Failed to update SocialLinks");
    }

    return updated;
}

const getSocial = async (): Promise<ISocialLinks[]> => {

    const result = await SocialLinks.find();

    return result
}


const postHelpCenter = async (data: Partial<IHelpCenter>): Promise<IHelpCenter | null> => {
    const created = await HelpCenter.create(data);
    return created;
}

const getHelpCenter = async (meta: any) => {
    const { page, limit = 10 } = meta;
    const skip = (page - 1) * limit;

    const searchFilter = meta.searchQuery
        ? {
            $or: [
                { name: { $regex: meta.searchQuery, $options: 'i' } },
                { email: { $regex: meta.searchQuery, $options: 'i' } },
                { issue: { $regex: meta.searchQuery, $options: 'i' } },
            ]
        }
        : {};

    const total = await HelpCenter.countDocuments(searchFilter);

    const helpCenters = await HelpCenter.find(searchFilter)
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return { helpCenters, total, totalPages };
}


export const policyAndTemrmsServices = {
    createPolicy,
    createTerm,
    getPolicy,
    updatePolicy,
    getTerm,
    updateTerm,
    createUpdateSocial,
    getSocial,
    postHelpCenter,
    getHelpCenter
}