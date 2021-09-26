import { User } from "../models/Entity/User";
import { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send("You must specify username, email and password!");
    }

    // const newUser = await  User.insert({ username, email, password });
    const createdUser = await User.save(User.create({ username, email, password }));

    // const user = await userRepository.create({ username, email, password });
    // const createdUser = await userRepository.save(user);

    res.send(createdUser);
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log(user);

    if (user) {
        console.log(await user.comparePassword(password));
    } else {
        return res.send(`No user with email: ${email} found!`);
    }

    res.send(user);
};

export { register, login };
