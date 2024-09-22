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

interface Product {
	productName: string;
	description: string;
	price: number;
	quantity: number;
	total: number;
	id: number;
}

interface ProductTable {
	products: Product[];
	grandTotal: number;
}

interface EmailProps {
	url: string;
	user: string;
	products: ProductTable;
}

const OrderCreated = ({ url, user, products }: EmailProps) => {
	user = "Aji";
	url = "https://alkahfi.com/order/";
	products = {
		products: [
			{
				id: 1,
				productName: "Product 1",
				description: "A brief description here",
				price: 10.0,
				quantity: 2,
				total: 20.0,
			},
			{
				id: 2,
				productName: "Product 2",
				description: "Another description here",
				price: 15.0,
				quantity: 1,
				total: 15.0,
			},
			{
				id: 3,
				productName: "Product 3",
				description: "More details here",
				price: 7.5,
				quantity: 3,
				total: 22.5,
			},
		],
		grandTotal: 57.5,
	};

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
							className="w-52 py-4 mx-auto "
							src="https://res.cloudinary.com/dqjnvq4gv/image/upload/v1726005678/Order.png"
						/>
						<Text className="md:text-2xl sm:text-xl font-bold">
							🎉 Your Order <br /> Has Been Successfully Created!
						</Text>
						<Text className="text-xl text-gray-700 mt-0 mb-0 font-bold">
							Hi {user},
						</Text>
						<Text className="text-md text-gray-700 mt-0 mb-0">
							Thank you for your order! Here are the details of your purchase:
						</Text>

						<Section className="my-4 md:px-8">
							<table className="min-w-full table-auto text-sm">
								<thead>
									<tr className="bg-gray-100 text-left">
										<th className="md:px-4 px-2 py-2 font-normal">No</th>
										<th className="md:px-4 px-2 py-2 font-normal">Name</th>
										<th className="md:px-4 px-2 py-2 text-right font-normal">
											Quantity
										</th>
										<th className="md:px-4 px-2 py-2 text-right font-normal">
											Price
										</th>
										<th className="md:px-4 px-2 py-2 text-right font-normal">
											Total
										</th>
									</tr>
								</thead>
								<tbody>
									{products.products.map((product, index) => (
										<tr key={product.id} className="border-t">
											<td className="md:px-4 px-2 py-2">{index + 1}</td>
											<td className="md:px-4 px-2 py-2 text-left">
												{product.productName}
											</td>
											<td className="md:px-4 px-2 py-2 text-right">
												{product.quantity}
											</td>
											<td className="md:px-4 px-2 py-2 text-right">
												${product.price}
											</td>
											<td className="md:px-4 px-2 py-2 text-right font-medium">
												${product.total}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr className="border-t bg-gray-200">
										<td
											colSpan={4}
											className="md:px-4 px-2 py-2 text-right font-medium"
										>
											Grand Total:
										</td>
										<td className="md:px-4 px-2 py-2 text-right font-medium">
											$
											{products.products.reduce(
												(acc, product) => acc + product.total,
												0,
											)}
										</td>
									</tr>
								</tfoot>
							</table>
						</Section>

						<Row className="md:px-4">
							<Column className="md:w-full md:max-w-[50%] md:px-4 sm:px-2">
								<Button
									style={{
										border: "1px solid #4677F1",
									}}
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="border-2 font-medium border-[#4677F1] text-[#4677F1]  md:w-full px-3 md:px-0 rounded-md py-4 text-center text-sm leading-none my-4 hover:bg-[#4677F1] hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#4677F1]"
								>
									Continue Shopping
								</Button>
							</Column>
							<Column className="md:w-full md:max-w-[50%] md:px-4 sm:px-2">
								<Button
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-[#4677F1] md:w-full px-8 md:px-0 rounded-md py-4 text-center text-sm leading-none text-white my-4"
								>
									View Order
								</Button>
							</Column>
						</Row>
					</Section>
					<Text className="text-md text-gray-700 mb-2 mt-4 text-center">
						We will notify you once your order has been shipped.
					</Text>
					<Heading
						as="h3"
						className="text-gray-700 mt-0 my-4 font-medium text-center"
					>
						Thank you for shopping with us!
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

export default OrderCreated;
