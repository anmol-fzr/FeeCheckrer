const passHelper = {
	getHashedPassword: async (rawPass: string) => {
		const password = await Bun.password.hash(rawPass, {
			algorithm: "bcrypt",
			cost: 4,
		});
		return password;
	},
	verifyPassword: async (rawPass: string, hashedPass: string) => {
		const isMatched = await Bun.password.verify(rawPass, hashedPass);
		return isMatched;
	},
} as const;

export { passHelper };
