import bcrypt from "bcrypt";

export const hash = ({
  plainText,
  rounds = Number(process.env.SALT_ROUND),
}) => {
  return bcrypt.hashSync(plainText, rounds);
};

export const compareHash = (password, hashed) => {
  return bcrypt.compareSync(password, hashed);
};
