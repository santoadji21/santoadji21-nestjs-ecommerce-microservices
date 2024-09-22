import {
	Button,
	Container,
	Font,
	Head,
	Heading,
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

const ResetPassword = ({ url, user }: EmailProps) => {
	user = "Aji";
	url = "https://alkahfi.com/order/";

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
						className="w-48 py-4 mx-auto"
						src="https://res.cloudinary.com/dqjnvq4gv/image/upload/v1726005776/new-logo.png"
					/>

					<Hr />
					<Section className="text-left px-4">
						<Heading
							as="h2"
							className="text-gray-700 font-black text-center mt-4"
						>
							🔐 Reset Your Password
						</Heading>
						<Text className="text-xl text-gray-700 mt-0 mb-4 font-bold">
							Hi {user},
						</Text>
						<Text className="text-md text-gray-700 mt-0 mb-2">
							We received a request to reset your password. No worries! Simply
							click the button below to reset it. If you didn’t request this,
							please ignore this email.
						</Text>

						<Section>
							<Button
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-[#4677F1] w-full rounded-md py-4 text-center text-sm leading-none text-white my-4"
							>
								Reset Password
							</Button>
						</Section>
					</Section>
					<Text className="text-md text-gray-700 mb-2 mt-2 text-center">
						If you didn’t request a password reset, no action is needed.
					</Text>
					<Heading
						as="h3"
						className="text-gray-700 mt-0 my-4 font-medium text-center"
					>
						Thank you for being with us!
					</Heading>

					<Hr />
					<Section>
						<Text className="text-xs text-center text-gray-500 leading-none">
							www.alkahfistore.com
						</Text>
					</Section>
				</Container>
			</Html>
		</Tailwind>
	);
};

export default ResetPassword;
