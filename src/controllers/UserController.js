// import { createUser, loginUser } from "../services/UserService.js";
import UserService from "../services/UserService.js";
import { refreshTokenJwt } from "../services/jwtService.js";

const createUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const reg = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const isCheckEmail = reg.test(email);

    // Kiểm tra các trường đầu vào
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: "Tất cả các trường nhập liệu đều bắt buộc.",
      });
    }

    // Kiểm tra định dạng email
    if (!isCheckEmail) {
      return res.status(400).json({
        status: "ERR",
        message: "Email không được định dạng!",
      });
    }
    // Kiểm tra mật khẩu
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: "Mật khẩu không trùng khớp với nhau!",
      });
    }

    // Nếu không có lỗi, tiếp tục tạo người dùng
    const response = await UserService.createUser(req.body);
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password) {
      return res.status(400).json({
        status: "ERR",
        message: "Tất cả các trường nhập liệu đều bắt buộc.",
      });
    }

    if (!isCheckEmail) {
      return res.status(400).json({
        status: "ERR",
        message: "Email không được định dạng!",
      });
    }

    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      SameSite: "strict",
    });
    return res.status(201).json({ ...newResponse, refresh_token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error.",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error.",
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.getDetailUser(userId);
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error.",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is requireed",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(201).json(response); // Mã trạng thái 201 khi tạo thành công
  } catch (error) {
    console.error(error); // Ghi lại lỗi ra console để dễ dàng gỡ lỗi
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error.",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is requireed",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error.",
    });
  }
};

const deleteManyUser = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(400).json({
        status: "ERR",
        message: "The ids is requireed",
      });
    }
    const response = await UserService.deleteManyUser(ids);
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error.",
    });
  }
};

// const refreshToken = async (req, res) => {
//   try {
//     const token = req.cookies.refresh_token;
//     if (!token) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The token is required",
//       });
//     }
//     const response = await refreshTokenJwt(token);
//     return res.status(201).json(response);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: "ERR",
//       message: "Internal Server Error.",
//     });
//   }
// };

const refreshToken = async (req, res) => {
  try {
    const token = req.headers.token.split("")[1];
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    const response = await refreshTokenJwt(token);
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error.",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(201).json({
      status: "OK",
      message: "Đã đăng xuất",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error.",
    });
  }
};

export default {
  createUser,
  loginUser,
  getAllUser,
  getDetailUser,
  updateUser,
  deleteUser,
  refreshToken,
  logoutUser,
  deleteManyUser,
};
