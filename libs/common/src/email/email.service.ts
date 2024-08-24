import {
	EMAIL_MODULE_OPTIONS_TOKEN,
	EmailModuleOptions,
} from "@app/common/email/config/email-module-definition";
import { SES } from "@aws-sdk/client-ses";
import { Inject, Injectable } from "@nestjs/common";
import { render } from "@react-email/render";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { JSXElementConstructor, ReactElement } from "react";

export interface SendMailParams {
	email: string;
	source: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	template: ReactElement<any, string | JSXElementConstructor<any>>;
	subject: string;
}

@Injectable()
export class EmailService {
	private ses: SES;

	constructor(
		@Inject(EMAIL_MODULE_OPTIONS_TOKEN) private options: EmailModuleOptions,
		@InjectPinoLogger() private readonly logger: PinoLogger,
	) {
		// Initialize AWS SES client
		this.ses = new SES({
			region: this.options.region,
			credentials: {
				accessKeyId: this.options.aws_access_key_id,
				secretAccessKey: this.options.aws_secret_access_key,
			},
		});
	}

	async sendMail({ source, email, template, subject }: SendMailParams) {
		// Render the email HTML using the React Email component
		const emailHtml = render(template);

		// Define the parameters for the email
		const params = {
			Source: source,
			Destination: {
				ToAddresses: [email],
			},
			Message: {
				Body: {
					Html: {
						Charset: "UTF-8",
						Data: emailHtml,
					},
				},
				Subject: {
					Charset: "UTF-8",
					Data: subject,
				},
			},
		};

		try {
			const result = await this.ses.sendEmail(params);
			this.logger.info(`${subject} sent successfully`, result);
			return result;
		} catch (error) {
			this.logger.error(`Failed to send ${subject} email`, error);
			throw new Error(`Failed to send ${subject} email`);
		}
	}
}
