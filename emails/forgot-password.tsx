import {
	Button,
	Container,
	Font,
	Head,
	Hr,
	Html,
	Img,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
	url: string;
	user: string;
}

const ForgotPassword = ({ url, user }: EmailProps) => {
	return (
		<Tailwind>
			<Html lang="en" className="bg-gray-100">
				<Head>
					<Font
						fontFamily="Inter"
						fallbackFontFamily="Verdana"
						webFont={{
							url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2",
							format: "woff2",
						}}
						fontWeight={400}
						fontStyle="normal"
					/>
				</Head>
				<Container className="bg-white px-4 pb-4 rounded">
					<Img
						className="w-32 pt-4"
						src="https://res.cloudinary.com/dqjnvq4gv/image/upload/v1723890843/alkahfi-full_h90oxg.png"
					/>
					<Hr />
					<Section>
						<Text className="text-xl font-medium">Hi, {user}</Text>
						<Text className="text-md text-gray-700 mt-0 mb-0">
							A password reset for your account was requested. <br />
							Please click the button below to change your password.
							<br />
							Note that this link is valid for 24 hours. <br />
							After the time limit has expired, you will have to resubmit the
							request for a password reset.
						</Text>
						<Button
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-cyan-700 rounded-md py-4 px-8 text-sm leading-none text-white my-4"
						>
							Reset Password
						</Button>
						<Text className="text-md text-gray-700 mt-0 mb-0">
							If you did not request a password reset, please ignore this email.
						</Text>
					</Section>

					<Hr />
					<Section>
						<Text className="text-xs text-gray-500 leading-none m-2">
							www.alkahfistore.com
						</Text>
					</Section>
				</Container>
			</Html>
		</Tailwind>
	);
};

export default ForgotPassword;
