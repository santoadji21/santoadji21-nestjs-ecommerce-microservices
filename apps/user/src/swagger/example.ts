export const RegisterUserExample = {
	statusCode: 200,
	message: "Register new user",
	data: {
		id: "ce86322d-d67e-4392-a7ad-16f511be8851",
		name: "Aji",
		email: "santoadji2197@gmail.com",
		phone: "081234567890",
		avatar: null,
		avatar_media_id: null,
		user_level: "MEMBER",
		created_at: "2024-08-12T22:39:15.853Z",
		updated_at: "2024-08-12T22:39:15.853Z",
	},
	error: false,
	path: "/register",
};

export const LoginUserExample = {
	statusCode: 200,
	message: "Login successfully",
	data: {
		user: {
			id: "3dbaa2b6-879e-4f40-a546-54bee09e7062",
			email: "santoadji2197@gmail.com",
			user_level: "MEMBER",
		},
		token:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNkYmFhMmI2LTg3OWUtNGY0MC1hNTQ2LTU0YmVlMDllNzA2MiIsImVtYWlsIjoic2FudG9hZGppMjE5N0BnbWFpbC5jb20iLCJpYXQiOjE3MjM1MDE4MTMsImV4cCI6MTcyMzUwNTQxM30.oO9HPnKjwFqKRK-NYfLXyU7SuSC3WM2Tt1ZQr-lO6CI",
	},
	error: false,
	path: "/login",
};
