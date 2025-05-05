import { ISpecialism } from "./specialism.interface"
import { Specialism } from "./specialism.model"

const createSpecialism = async (id: string, data: Partial<ISpecialism>[]): Promise<ISpecialism[]> => {

    const finalData = data.map((item) => ({
        specialism: item.specialism,
        trainer_id: id,
    }));

    const result = await Specialism.create(finalData)
    return result
}

const getAllOfUserSpecialism = async (id: string): Promise<ISpecialism[] | null> => {
    const result = await Specialism.find({ trainer_id: id });
    return result;
}

const deleteSpecialism = async (id: string): Promise<ISpecialism | null> => {
    const result = await Specialism.findByIdAndDelete({ _id: id });
    return result;
}


export const specialismServices = {
    createSpecialism,
    getAllOfUserSpecialism,
    deleteSpecialism,
}