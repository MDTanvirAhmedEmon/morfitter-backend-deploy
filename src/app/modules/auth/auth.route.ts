import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";

const router = Router();

router.post('/login',
    validateRequest(AuthValidation.loginValidationSchema),
    authController.logInUser
)

router.post('/login-admin',
    validateRequest(AuthValidation.loginValidationSchema),
    authController.logInAdmin
)

router.post('/refresh-token',
    authController.createRefreshToken
)

router.post('/change-password',
    auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN)
    , authController.changePassword)

router.post('/change-admin-password',
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN)
    , authController.changeAdminPassword)

router.post(
    '/forget-admin-password',
    authController.forgetAdminPassword
);

router.post(
    '/forget-password',
    authController.forgetPassword
);

router.post(
    '/verify-code',
    authController.verifyCode
);

router.post(
    '/verify-admin-code',
    authController.verifyAdminCode
);

router.post(
    '/reset-password',
    authController.resetPassword
);

router.post(
    '/reset-admin-password',
    authController.resetAdminPassword
);
// change password
// forget password
// reset password




export const AuthRouter = router;