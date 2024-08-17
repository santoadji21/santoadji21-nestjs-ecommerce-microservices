import {
	Button,
	Column,
	Container,
	Font,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

const TaskEmail: React.FC = () => {
	const year = new Date().getFullYear();
	const { username, task, due, description } = {
		username: "santoadji21",
		task: "Create Email Campaign",
		due: "2022-01-01",
		description:
			"Design and set up an email campaign for the new product launch. Ensure the email template is mobile-friendly and includes all relevant product details, promotional offers, and a call-to-action button. Coordinate with the marketing team to finalize the content and schedule the email to be sent on the due date.",
	};

	return (
		<Tailwind
			config={{
				theme: {
					extend: {
						colors: {
							brand: "#007291",
						},
					},
				},
			}}
		>
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
					<Section className="mt-5 text-center">
						<Img
							className="w-10 h-10 m-auto"
							src="https://res.cloudinary.com/dqjnvq4gv/image/upload/v1716270793/logo-2.png"
						/>
					</Section>
					<Section className="w-full">
						<Text className="text-center font-semibold md:text-3xl text-xl text-cyan-700">
							Task Created Successfully!
						</Text>
					</Section>
					<Heading as="h2">Lorem ipsum</Heading>

					<Hr />
					<Section>
						<Text className="text-xl font-medium">Hello, {username}</Text>
						<Text className="text-sm font-medium">
							Your task{" "}
							<mark className="bg-cyan-100 text-cyan-700 p-1 rounded font-semibold">
								{task}
							</mark>{" "}
							has been created successfully 🎉
						</Text>
						<Text className="text-sm font-semibold leading-none ">
							Due Date:{" "}
							<mark className="bg-orange-100 text-orange-700 p-1 rounded">
								{due}
							</mark>{" "}
						</Text>
						<Text className="text-sm font-semibold leading-none my-1">
							Description:
						</Text>
						<Text className="text-sm text-gray-700 mt-0 mb-0">
							{description}
						</Text>
						<Button
							href="https://example.com"
							className="bg-cyan-700 rounded-md py-2 px-8 text-sm leading-none text-white my-4"
						>
							See Task!
						</Button>
					</Section>

					<Hr />
					<Section className="mt-4">
						<Img
							className="w-32 m-auto"
							src="https://res.cloudinary.com/dqjnvq4gv/image/upload/v1716270793/logo-3.png"
						/>
						<Text className="text-xs text-gray-500 text-center leading-none m-2">
							Copyright © {year}
						</Text>
						<Text className="text-xs text-cyan-500 text-center leading-none m-2">
							Taskly App & Recognition.
						</Text>
						<Text className="text-xs text-gray-500 text-center leading-none m-2">
							Master Your Tasks, Simplify Your Life
						</Text>
					</Section>
				</Container>
			</Html>
		</Tailwind>
	);
};

export default TaskEmail;
