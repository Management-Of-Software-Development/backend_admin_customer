import { UserRepository } from './user.repository';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ChangeProfileDto } from './dtos/changeProfile.dto';
import { UserDocument } from './user.model';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { RegisterUserDto } from './dtos/registerUser.dto';

export class UserService {
  private readonly userRepository = new UserRepository();

  async registerUser(registerUserDto: RegisterUserDto) {
    return this.userRepository.register(registerUserDto);
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.userRepository.getUserByEmail(email);
  }

  async changePassword(user_id: string, changePasswordDto: ChangePasswordDto) {
    return this.userRepository.changePassword(user_id, changePasswordDto);
  }

  async changeProfile(
    user_id: string,
    changeProfileDto: ChangeProfileDto,
    attachment: Express.Multer.File,
  ) {
    return this.userRepository.changeProfile(
      user_id,
      changeProfileDto,
      attachment,
    );
  }

  async verifyActive(activeToken: string) {
    return this.userRepository.verifyActive(activeToken);
  }

  async sendResetPasswordRequest(user_email: string) {
    return this.userRepository.sendResetPasswordRequest(user_email);
  }

  async verifyActiveToken(active_token: string) {
    return this.userRepository.verifyActiveToken(active_token);
  }

  async resetPassword(
    active_token: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userRepository.resetPassword(active_token, resetPasswordDto);
  }

  // Do not expose this method to front-end
  async getAllAdminIds() {
    return this.userRepository.getAllAdminIds();
  }
}
