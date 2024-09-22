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

const AccountCreated = ({ url, user }: EmailProps) => {
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
					<Section className="text-center px-4">
						<Img
							className="w-60 py-4 mx-auto"
							src="https://res.cloudinary.com/dqjnvq4gv/image/upload/v1726005678/Register.png"
						/>
						<Text className="md:text-2xl sm:text-xl font-bold">
							🎉 Welcome! Your Account Has Been Created
						</Text>
						<Text className="text-xl text-gray-700 mt-0 mb-0 font-bold">
							Hi {user},
						</Text>
						<Text className="text-md text-gray-700 mt-0 mb-1">
							We’re excited to have you with us! Your account has been
							successfully created. You can now log in and start shopping right
							away using the link below.
						</Text>

						<Section>
							<Button
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-[#4677F1] w-full rounded-md py-4 text-center text-sm leading-none text-white my-4"
							>
								Log In and Start Shopping
							</Button>
						</Section>
					</Section>
					<Text className="text-md text-gray-700 mb-2 mt-1  text-center">
						We’ll keep you updated with the latest products and exclusive
						offers.
					</Text>
					<Heading
						as="h3"
						className="text-gray-700 mt-0 my-4 font-medium text-center"
					>
						Thank you for joining us!
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

export default AccountCreated;
