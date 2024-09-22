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
}

const SuccessResetPassword = ({ url }: EmailProps) => {
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
						className="w-48 py-4 mx-auto "
						src="https://res.cloudinary.com/dqjnvq4gv/image/upload/v1726005776/new-logo.png"
					/>

					<Hr />
					<Section className="text-center">
						<Img
							className="w-48 py-4 mx-auto "
							src="https://res.cloudinary.com/dqjnvq4gv/image/upload/v1726005677/password.png"
						/>
						<Text className="md:text-2xl sm:text-xl font-extrabold">
							Successful Password Reset.
						</Text>
						<Text className="text-md text-gray-700 mt-0 mb-0">
							You can now log in to your account using your new password.
						</Text>
						<Section className="px-6">
							<Button
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-[#4677F1] w-full mx-auto rounded-md py-4 text-center text-sm leading-none text-white my-4"
							>
								Continue Login
							</Button>
						</Section>

						<Text className="text-md text-gray-700 mt-0 mb-2">
							If you encounter any issues, feel free to contact our support
							team.
						</Text>
					</Section>

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

export default SuccessResetPassword;
