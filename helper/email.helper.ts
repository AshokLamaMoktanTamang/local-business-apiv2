import { env } from "@/config";
import { google } from "googleapis";
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

interface SendMailParams {
  email: string;
  subject: string;
  html: string;
}

class MailService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private refreshToken: string;
  private oAuth2Client: any;
  private emailUser: string;

  constructor() {
    this.clientId = env.CLIENT_ID!;
    this.clientSecret = env.CLIENT_SECRET!;
    this.redirectUri = env.REDIRECT_URI!;
    this.refreshToken = env.REFRESH_TOKEN!;
    this.emailUser = env.EMAIL_USER!;

    this.oAuth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );
    this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken });
  }

  private async getAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.oAuth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(`Failed to create access token: ${err}`);
        }
        resolve(token);
      });
    });
  }

  public async sendMail({
    email,
    subject,
    html,
  }: SendMailParams): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const transporter: Transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: this.emailUser,
          accessToken,
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          refreshToken: this.refreshToken,
        },
      });

      const mailOptions: SendMailOptions = {
        from: this.emailUser,
        to: email,
        subject,
        html,
      };

      const mail = await transporter.sendMail(mailOptions);
      return mail;
    } catch (error) {
      console.error(error);
    }
  }
}

export default MailService;
