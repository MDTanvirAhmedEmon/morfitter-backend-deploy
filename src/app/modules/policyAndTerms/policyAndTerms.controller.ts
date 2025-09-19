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

const createUpdateSocial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        console.log(data);
        const result = await policyAndTemrmsServices.createUpdateSocial(data);

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

const getSocial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await policyAndTemrmsServices.getSocial();

        res.status(200).json({
            success: true,
            message: 'get all social links successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const postHelpCenter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const result = await policyAndTemrmsServices.postHelpCenter(data);

        res.status(200).json({
            success: true,
            message: 'posted help center successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getHelpCenter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const meta = req.query
        const result = await policyAndTemrmsServices.getHelpCenter(meta);

        res.status(200).json({
            success: true,
            message: 'get all issues successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const subscrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const result = await policyAndTemrmsServices.subscrip(data);

        res.status(200).json({
            success: true,
            message: 'subscription successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getSubscrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const meta = req.query
        const result = await policyAndTemrmsServices.getSubscrip(meta);

        res.status(200).json({
            success: true,
            message: 'get all subscriptions successfully',
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
    createUpdateSocial,
    getSocial,
    postHelpCenter,
    getHelpCenter,
    subscrip,
    getSubscrip,
}