import { Schema, model } from "mongoose";
import { IPolicy, ITerms } from "./policyAndTerms.interface";


const policySchema: Schema<IPolicy> = new Schema({
    policy: { type: String, required: true},

}, { timestamps: true });

export const Policy = model<IPolicy>("Policy", policySchema);


const termsSchema: Schema<ITerms> = new Schema({
    term: { type: String, required: true},

}, { timestamps: true });

export const Terms = model<ITerms>("Terms", termsSchema);
