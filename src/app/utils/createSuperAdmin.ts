import config from "../config";
import { Admin } from "../modules/admins/admin.model";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {

  const isSuperAdminExits = await Admin.findOne({ role: "super_admin" });

  if (!isSuperAdminExits) {
    const hashedPassword = await bcrypt.hash("superAdmin777", Number(config.bcrypt_salt_rounds));
    const superUser = {
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin777@gmail.com",
      password: hashedPassword,
      role: "super_admin",
      chatId: "admin77De5497Ed",
      status: "in-progress",
    };

    await Admin.create(superUser);
  }
};

export default seedSuperAdmin;
