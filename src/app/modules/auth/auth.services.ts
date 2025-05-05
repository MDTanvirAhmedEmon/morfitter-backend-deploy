import { Secret } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken, verifyToken } from '../../helpers/jwtHelper';
import { User } from '../users/user.model';
import { ILoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utils/sendEmail';
import { Admin } from '../admins/admin.model';

const logInUser = async (logInData: ILoginUser): Promise<any> => {
  const isExist = await User.findOne({ email: logInData?.email })
  if (!isExist) {
    throw new AppError(404, 'User not found!')
  }

  const matchedPassword = await bcrypt.compare(logInData?.password, isExist?.password);
  if (!matchedPassword) {
    throw new AppError(400, 'Password did not matched!');
  }
  if (isExist.status === 'blocked') {
    throw new AppError(400, 'User is blocked!')
  }

  const tokenPayload = {
    email: isExist.email,
    id: isExist._id,
    role: isExist.role,
    status: isExist.status
  }

  const accessToken = createToken(
    tokenPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as string,
  )
  const refreshToken = createToken(
    tokenPayload,
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expires_in as string,
  )

  return {
    refreshToken,
    accessToken,
  }

}

const logInAdmin = async (logInData: ILoginUser): Promise<any> => {
  const isExist = await Admin.findOne({ email: logInData?.email })
  if (!isExist) {
    throw new AppError(404, 'May Be you are not admin!')
  }

  const matchedPassword = await bcrypt.compare(logInData?.password, isExist?.password);
  if (!matchedPassword) {
    throw new AppError(400, 'Password did not matched!');
  }
  if (isExist.status === 'blocked') {
    throw new AppError(400, 'User is blocked!')
  }

  const tokenPayload = {
    email: isExist.email,
    id: isExist._id,
    role: isExist.role,
    status: isExist.status
  }

  const accessToken = createToken(
    tokenPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as string,
  )
  const refreshToken = createToken(
    tokenPayload,
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expires_in as string,
  )

  return {
    refreshToken,
    accessToken,
  }

}

const createRefreshToken = async (token: string): Promise<any> => {

  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(
      token,
      config.jwt_refresh_secret as Secret
    );
  } catch (err) {
    throw new AppError(403, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;

  // checking deleted user's refresh token

  const isExist = await User.findOne({ _id: id });
  if (!isExist) {
    throw new AppError(404, 'User does not exist');
  }
  //generate new token

  const tokenPayload = {
    email: isExist.email,
    id: isExist._id,
    role: isExist.role,
    status: isExist.status
  }

  const accessToken = createToken(
    tokenPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as string,
  )

  return {
    accessToken
  }

}


const changePassword = async (user: any, data: { oldPassword: string, newPassword: string }): Promise<null> => {

  const isExist = await User.findOne({ email: user.email })
  if (!isExist) {
    throw new AppError(404, 'User not found!')
  }
  if (isExist.status === 'blocked') {
    throw new AppError(400, 'User is blocked!')
  }

  const matchedPassword = await bcrypt.compare(data?.oldPassword, isExist?.password);
  if (!matchedPassword) {
    throw new AppError(400, 'Password do not matched!');
  }
  const hashedNewPassword = await bcrypt.hash(data.newPassword, Number(config.bcrypt_salt_rounds))
  const result = await User.findOneAndUpdate(
    {
      _id: user?.id,
      role: user?.role,
    },
    {
      password: hashedNewPassword,
      passwordChangedAt: new Date(),
    },
  );
  return null;
}


const changeAdminPassword = async (user: any, data: { oldPassword: string, newPassword: string }): Promise<null> => {

  const isExist = await Admin.findOne({ email: user.email })
  if (!isExist) {
    throw new AppError(404, 'User not found!')
  }
  if (isExist.status === 'blocked') {
    throw new AppError(400, 'User is blocked!')
  }
  if (user?.id !== isExist._id.toString()) {
    throw new AppError(400, 'You are not authorized to change this password!');
  }

  const matchedPassword = await bcrypt.compare(data?.oldPassword, isExist?.password);
  if (!matchedPassword) {
    throw new AppError(400, 'Password do not matched!');
  }
  const hashedNewPassword = await bcrypt.hash(data.newPassword, Number(config.bcrypt_salt_rounds))
  const result = await Admin.findOneAndUpdate(
    {
      _id: user?.id,
      role: user?.role,
    },
    {
      password: hashedNewPassword,
      passwordChangedAt: new Date(),
    },
  );
  return null;
}


const forgetAdminPassword = async (email: any): Promise<any> => {

  const isExist = await Admin.findOne({ email: email })
  if (!isExist) {
    throw new AppError(404, 'User not found!')
  }
  if (isExist.status === 'blocked') {
    throw new AppError(403, 'User is blocked!')
  }
  // Generate a 5-digit reset token (verification code)
  const resetToken = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit random number

  // Set reset token expiration to 10 minutes (600,000 milliseconds)
  const passwordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // isExist.resetPasswordToken = resetToken
  // isExist.resetPasswordExpires = passwordExpires
  sendEmail(isExist?.email, resetToken)
  const result = await Admin.findOneAndUpdate(
    { email: email },
    {
      resetPasswordToken: resetToken,
      resetPasswordExpires: passwordExpires
    },
  );
  return null;
}

const forgetPassword = async (email: any): Promise<any> => {

  const isExist = await User.findOne({ email: email })
  if (!isExist) {
    throw new AppError(404, 'User not found!')
  }
  if (isExist.status === 'blocked') {
    throw new AppError(403, 'User is blocked!')
  }
  // Generate a 5-digit reset token (verification code)
  const resetToken = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit random number

  // Set reset token expiration to 10 minutes (600,000 milliseconds)
  const passwordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // isExist.resetPasswordToken = resetToken
  // isExist.resetPasswordExpires = passwordExpires
  sendEmail(isExist?.email, resetToken)
  const result = await User.findOneAndUpdate(
    { email: email },
    {
      resetPasswordToken: resetToken,
      resetPasswordExpires: passwordExpires
    },
  );
  return null;
}


const verifyCode = async (data: any): Promise<any> => {

  const isExist = await User.findOne({ email: data?.email })
  if (!isExist) {
    throw new AppError(404, 'User not found!')
  }

  const tokenMatch = await User.findOne({
    email: isExist.email,
    resetPasswordToken: data?.tokenCode,
  });

  if (!tokenMatch) {
    throw new AppError(400, 'Invalid verification code');
  }
  const expiresDate = await User.findOne({
    email: isExist.email,
    resetPasswordExpires: { $gt: new Date(Date.now()) }
  });

  if (!expiresDate) {
    throw new AppError(400, 'Verification code expired');
  }

  return null;
}

const verifyAdminCode = async (data: any): Promise<any> => {

  const isExist = await Admin.findOne({ email: data?.email })
  if (!isExist) {
    throw new AppError(404, 'Admin not found!')
  }

  const tokenMatch = await Admin.findOne({
    email: isExist.email,
    resetPasswordToken: data?.tokenCode,
  });

  if (!tokenMatch) {
    throw new AppError(400, 'Invalid verification code');
  }
  const expiresDate = await Admin.findOne({
    email: isExist.email,
    resetPasswordExpires: { $gt: new Date(Date.now()) }
  });

  if (!expiresDate) {
    throw new AppError(400, 'Verification code expired');
  }

  return null;
}


const resetPassword = async (data: any): Promise<any> => {

  const isExist = await User.findOne({ email: data?.email })
  if (!isExist) {
    throw new AppError(404, 'User not found!')
  }

  const tokenMatch = await User.findOne({
    email: isExist.email,
    resetPasswordToken: data?.tokenCode,
  });

  if (!tokenMatch) {
    throw new AppError(400, 'Invalid verification code');
  }
  const expiresDate = await User.findOne({
    email: isExist.email,
    resetPasswordExpires: { $gt: new Date(Date.now()) }
  });

  if (!expiresDate) {
    throw new AppError(400, 'Verification code expired');
  }

  const hashedNewPassword = await bcrypt.hash(data?.newPassword, Number(config.bcrypt_salt_rounds))

  const result = await User.findOneAndUpdate(
    {
      email: data?.email,
      resetPasswordToken: data?.tokenCode,
      resetPasswordExpires: { $gt: new Date(Date.now()) }
    },
    {
      password: hashedNewPassword,
      passwordChangedAt: new Date(),
      resetPasswordToken: null,
      resetPasswordExpires: null
    },
  );
  return null;
}


const resetAdminPassword = async (data: any): Promise<any> => {

  const isExist = await Admin.findOne({ email: data?.email })
  if (!isExist) {
    throw new AppError(404, 'Admin not found!')
  }

  const tokenMatch = await Admin.findOne({
    email: isExist.email,
    resetPasswordToken: data?.tokenCode,
  });

  if (!tokenMatch) {
    throw new AppError(400, 'Invalid verification code');
  }
  const expiresDate = await Admin.findOne({
    email: isExist.email,
    resetPasswordExpires: { $gt: new Date(Date.now()) }
  });

  if (!expiresDate) {
    throw new AppError(400, 'Verification code expired');
  }

  const hashedNewPassword = await bcrypt.hash(data?.newPassword, Number(config.bcrypt_salt_rounds))

  const result = await Admin.findOneAndUpdate(
    {
      email: data?.email,
      resetPasswordToken: data?.tokenCode,
      resetPasswordExpires: { $gt: new Date(Date.now()) }
    },
    {
      password: hashedNewPassword,
      passwordChangedAt: new Date(),
      resetPasswordToken: null,
      resetPasswordExpires: null
    },
  );
  return null;
}



export const authServices = {
  logInUser,
  logInAdmin,
  createRefreshToken,
  changePassword,
  changeAdminPassword,
  forgetAdminPassword,
  forgetPassword,
  verifyCode,
  verifyAdminCode,
  resetPassword,
  resetAdminPassword,
}