import { hashSync, compareSync } from 'bcrypt';
import { BadRequestError } from 'routing-controllers';
import { createReadStream, unlink } from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
import { UserDocument, UserModel } from './user.model';
import { ChangeProfileDto } from './dtos/changeProfile.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { Mailer } from '../helper/mailer';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { AdminModel } from './admin.model';
import { UserStatus } from './user-status.enum';

export class UserRepository {
  private hashPassword(password: string, rounds: number): string {
    return hashSync(password, rounds);
  }

  private comparePassword(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email, del_flag: false })
      .select({
        _id: 1,
        email: 1,
        phone: 1,
        fullname: 1,
        birthday: 1,
        address: 1,
        create_time: 1,
        avatar: 1,
        type: 1,
        api_key:1,
      })
      .lean();
  }

  async changeProfile(
    user_id: string,
    changeProfileDto: ChangeProfileDto,
    avatar: Express.Multer.File,
  ) {
    const query = { _id: user_id, del_flag: false };
    const modifyingUser = await UserModel.findOne(query).exec();
    if (avatar) {
      try {
        const form = new FormData();
        form.append('objectType', 'user');
        form.append('objectId', user_id.toString());
        form.append('file', createReadStream(avatar.path));
        form.append('type', 'avatar');
        const mediaResponse = await axios.post<string>(
          `${process.env.MEDIA_ROOT_URL}/file`,
          form,
          {
            headers: { ...form.getHeaders() },
          },
        );
        modifyingUser.avatar = mediaResponse.data;
      } catch (e) {
        throw new BadRequestError(e.message);
      } finally {
        unlink(avatar.path, () => null);
      }
    }
    modifyingUser.fullname = changeProfileDto.fullname;
    if (changeProfileDto.phone) modifyingUser.phone = changeProfileDto.phone;
    modifyingUser.birthday = changeProfileDto.birthday;
    modifyingUser.address = changeProfileDto.address;
    await modifyingUser.save();
  }

  async changePassword(user_id: string, changePasswordDto: ChangePasswordDto) {
    const query = { _id: user_id, del_flag: false };
    const { old_password, new_password } = changePasswordDto;
    if (old_password === new_password) {
      throw new BadRequestError(
        'New Password must be different with Old Password',
      );
    } else {
      try {
        const new_hashed_password = this.hashPassword(
          changePasswordDto.new_password,
          10,
        );
        const user = await UserModel.findOne(query)
          .select({
            _id: 0,
            hashed_password: 1,
          })
          .lean();
        if (!this.comparePassword(old_password, user.hashed_password)) {
          throw new Error('Old Password is incorrect');
        } else {
          await UserModel.findOneAndUpdate(query, {
            hashed_password: new_hashed_password,
          });
        }
      } catch (e) {
        throw new BadRequestError(e.message);
      }
    }
  }

  async sendResetPasswordRequest(user_email: string) {
    const user = await UserModel.findOne({
      email: user_email,
      status: { $in: [1, 2] },
      del_flag: false,
    });
    if (!user) {
      throw new BadRequestError('User not found !');
    }
    const otp_active_token = uuidv4();
    user.active_token = otp_active_token;
    await user.save();
    await Mailer.resetPassword(user.email, user.fullname, otp_active_token);
  }

  async verifyActiveToken(active_token: string) {
    try {
      const user = await UserModel.findOne({
        active_token,
        del_flag: false,
        status: 1,
      });
      if (!user) {
        throw new BadRequestError(
          'This active_token does not exist or user does not exist !',
        );
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async resetPassword(
    active_token: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    const user = await UserModel.findOne({
      active_token,
      del_flag: false,
      status: 1,
    });
    if (!user) {
      throw new BadRequestError(
        'This active_token does not exist or user does not exist !',
      );
    }
    const { new_password, confirm_new_password } = resetPasswordDto;
    if (new_password !== confirm_new_password) {
      throw new BadRequestError('Confirmation password must equal to password');
    }
    const new_hashed_password = this.hashPassword(new_password, 10);
    user.hashed_password = new_hashed_password;
    user.active_token = uuidv4();
    await user.save();
  }

  async getAllAdminIds() {
    const admins = await AdminModel.find({ status: UserStatus.ACTIVE }).lean();
    return admins.map((admin) => new Types.ObjectId(admin._id).toHexString());
  }
}
