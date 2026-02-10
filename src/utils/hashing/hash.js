import bcrypt from 'bcrypt';

export const hash =({plainText, rounds=Number(process.env.ROUNDS)})=>{
    return bcrypt.hashSync(plainText,rounds)
};

export const compareHash=(password, hashed)=>{
    return bcrypt.compareSync(password,hashed)
};