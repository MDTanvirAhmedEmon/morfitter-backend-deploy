import { Schema, model } from "mongoose";
import { IHelpCenter, IPolicy, ISocialLinks, ISubscription, ITerms } from "./policyAndTerms.interface";


const policySchema: Schema<IPolicy> = new Schema({
    policy: { type: String, required: true },

}, { timestamps: true });

export const Policy = model<IPolicy>("Policy", policySchema);


const termsSchema: Schema<ITerms> = new Schema({
    term: { type: String, required: true },

}, { timestamps: true });

export const Terms = model<ITerms>("Terms", termsSchema);


const socialLinksSchema = new Schema<ISocialLinks>({
    facebook: { type: String, required: true },
    instagram: { type: String, required: true },
    x: { type: String, required: true },
    linkedin: { type: String, required: true },
}, { timestamps: true });


export const SocialLinks = model<ISocialLinks>("SocialLinks", socialLinksSchema);

const helpCenterSchema = new Schema<IHelpCenter>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    issue: { type: String, required: true },
}, { timestamps: true });


export const HelpCenter = model<IHelpCenter>("HelpCenter", helpCenterSchema);


const subscriptionSchema = new Schema<ISubscription>({
    email: { type: String, required: true },
}, { timestamps: true });


export const Subscription = model<ISubscription>("Subscription", subscriptionSchema);