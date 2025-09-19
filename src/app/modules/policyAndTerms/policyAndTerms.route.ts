import { Router } from "express";
import { policyAndTemrmsController } from "./policyAndTerms.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";

const router = Router();

router.post('/create-policy', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), policyAndTemrmsController.createPolicy)
router.get('/policy', policyAndTemrmsController.getPolicy)
router.patch('/policy/:id', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), policyAndTemrmsController.updatePolicy)
router.post('/create-terms', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), policyAndTemrmsController.createTerm)
router.get('/terms', policyAndTemrmsController.getTerm)
router.patch('/terms/:id', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), policyAndTemrmsController.updateTerm)
router.get('/social', policyAndTemrmsController.getSocial)
router.patch('/social', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), policyAndTemrmsController.createUpdateSocial)
router.get('/help-center', policyAndTemrmsController.getHelpCenter)
router.patch('/help-center', policyAndTemrmsController.postHelpCenter)
router.get('/subscription', policyAndTemrmsController.getSubscrip)
router.patch('/subscription', policyAndTemrmsController.subscrip)


export const PolicyAndTemrmsRouter = router;