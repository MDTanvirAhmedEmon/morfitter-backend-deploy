import { NextFunction, Request, Response } from "express";
import { policyAndTemrmsServices } from "./policyAndTerms.services";



const createPolicy = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data = req.body

        const result = await policyAndTemrmsServices.createPolicy(data);

        res.status(200).json({
            success: true,
            message: 'created policy successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getPolicy = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await policyAndTemrmsServices.getPolicy();

        res.status(200).json({
            success: true,
            message: 'get policy successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const updatePolicy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const data = req.body
        const result = await policyAndTemrmsServices.updatePolicy(id, data);

        res.status(200).json({
            success: true,
            message: 'update policy successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const createTerm = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data = req.body

        const result = await policyAndTemrmsServices.createTerm(data);

        res.status(200).json({
            success: true,
            message: 'created terms and condition successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getTerm = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await policyAndTemrmsServices.getTerm();

        res.status(200).json({
            success: true,
            message: 'get terms successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const updateTerm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const data = req.body
        const result = await policyAndTemrmsServices.updateTerm(id, data);

        res.status(200).json({
            success: true,
            message: 'update terms successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

export const policyAndTemrmsController = {
    createPolicy,
    getPolicy,
    updatePolicy,
    createTerm,
    getTerm,
    updateTerm,

}