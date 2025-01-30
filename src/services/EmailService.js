import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const sendEmailCreateOrder = async (email, orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let listItem = "";
  const attachImage = [];
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>Bạn đã đặt sản phẩm ${order.name} với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
    <div>Bên dưới là hình ảnh của sản phẩm</div
    </div>`;
    attachImage.push({ path: order.image });
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: "anhthangdn111@gmail.com", // list of receivers
    subject: "Đặt hàng thành công!", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công tại shop THANGBOOK</b></div>${listItem}`, // html body
    attachments: attachImage,
  });
};

// export default sendEmailCreateOrder;
