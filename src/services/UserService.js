import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import {
    generalAccessToken,
    generalRefreshToken,
} from '../services/jwtService.js';

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, password, confirmPassword } = newUser;
        try {
            const checkUser = await User.findOne({
                email: newUser.email,
            });

            if (checkUser) {
                return resolve({
                    status: 'ERR',
                    message:
                        'Email đã được đăng ký. Vui lòng đăng ký bằng Email khác!',
                });
            }

            const hash = bcrypt.hashSync(password, 10);
            const createUser = await User.create({
                email,
                password: hash,
                confirmPassword: hash,
            });
            if (createUser) {
                resolve({
                    status: 'OK',
                    message: 'Sign up success',
                    data: createUser,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// const createUser = async (req, res) => {
//   try {
//     const { email, password, confirmPassword } = req.body;
//     const checkUser = await User.findOne({
//       email: req.body.email,
//     });

//     if (checkUser) {
//       // return res({
//       //   status: "ERR",
//       //   message: "The email is already registered",
//       // });
//       return res.status(400).json({
//         status: "ERR",
//         message: "The email is already registered",
//       });
//     }

//     const hash = bcrypt.hashSync(password, 10);
//     const createUser = await User.create({
//       email,
//       password: hash,
//       confirmPassword: hash,
//     });
//     if (createUser) {
//       return res.status(400).json({
//         status: "OK",
//         message: "Sign up success",
//         data: createUser,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: "ERR",
//       message: "Internal Server Error.",
//     });
//   }
// };

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser === null) {
                return resolve({
                    status: 'ERR',
                    message: 'Email không được xác định!',
                });
            }

            const comparePassword = bcrypt.compareSync(
                password,
                checkUser.password,
            );
            if (!comparePassword) {
                return resolve({
                    status: 'ERR',
                    message: 'Email hoặc mật khẩu không đúng!',
                });
            }

            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            resolve({
                status: 'OK',
                message: 'Login successful',
                access_token,
                refresh_token,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();
            resolve({
                status: 'OK',
                message: 'Successful',
                data: allUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });

            if (user === null) {
                return resolve({
                    status: 'OK',
                    message: 'The user is not defined',
                });
            }

            resolve({
                status: 'OK',
                message: 'Get detail successful',
                data: user,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });

            if (checkUser === null) {
                return resolve({
                    status: 'OK',
                    message: 'The user is not defined',
                });
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, {
                new: true,
            });

            resolve({
                status: 'OK',
                message: 'Update successful',
                data: updatedUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });

            if (checkUser === null) {
                return resolve({
                    status: 'OK',
                    message: 'The user is not defined',
                });
            }

            await User.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Delete user successful',
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids });
            resolve({
                status: 'OK',
                message: 'Delete user successful',
            });
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    createUser,
    loginUser,
    getAllUser,
    getDetailUser,
    updateUser,
    deleteUser,
    deleteManyUser,
};
