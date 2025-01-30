import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const sendEmailCreateOrder = async (email, orderItems) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let listItem = '';
    const attachImage = [];
    orderItems.forEach((order, index) => {
        const totalItemPrice = (order.amount * order.price).toLocaleString(
            'vi-VN',
            { style: 'currency', currency: 'VND' },
        );
        listItem += `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #333;">Sản phẩm ${index + 1}: ${
            order.name
        }</h3>
                <p>Số lượng: <b>${order.amount}</b></p>
                <p>Giá mỗi sản phẩm: <b>${order.price.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                })}</b></p>
                <p>Tổng giá: <b>${totalItemPrice}</b></p>
                <p>Hình ảnh sản phẩm:</p>
                <img src="cid:image${index}" alt="${
            order.name
        }" style="max-width: 200px; height: auto;" />
            </div>
        `;
        attachImage.push({
            path: order.image,
            cid: `image${index}`,
        });
    });

    const totalOrderPrice = orderItems
        .reduce((sum, order) => sum + order.amount * order.price, 0)
        .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: 'Đặt hàng thành công tại THANGBOOK!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #4CAF50;">Đặt hàng thành công!</h2>
                <p>Cảm ơn bạn đã đặt hàng tại <b>THANGBOOK</b>. Dưới đây là chi tiết đơn hàng của bạn:</p>
                <hr style="border: 1px solid #eee;" />
                ${listItem}
                <hr style="border: 1px solid #eee;" />
                <h3 style="color: #333;">Tổng giá trị đơn hàng: <b>${totalOrderPrice}</b></h3>
                <p>Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể. Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi!</p>
                <p style="color: #888;">Trân trọng,<br>Đội ngũ THANGBOOK</p>
            </div>
        `,
        attachments: attachImage,
    });

    return info;
};

export const sendEmailCreateBorrow = async (email, borrowItems) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let listItem = '';
    const attachImage = [];
    borrowItems.forEach((borrow, index) => {
        const totalItemPrice = (borrow.amount * borrow.price).toLocaleString(
            'vi-VN',
            { style: 'currency', currency: 'VND' },
        );
        const borrowDate = new Date(borrow.borrowDate).toLocaleDateString(
            'vi-VN',
        );
        const returnDate = new Date(borrow.returnDate).toLocaleDateString(
            'vi-VN',
        );
        listItem += `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #333;">Sản phẩm ${index + 1}: ${
            borrow.name
        }</h3>
                <p>Số lượng: <b>${borrow.amount}</b></p>
                <p>Giá thuê mỗi sản phẩm: <b>${borrow.price.toLocaleString(
                    'vi-VN',
                    { style: 'currency', currency: 'VND' },
                )}</b></p>
                <p>Tổng giá: <b>${totalItemPrice}</b></p>
                <p>Ngày mượn: <b>${borrowDate}</b></p>
                <p>Ngày phải trả: <b>${returnDate}</b></p>
                <p>Hình ảnh sản phẩm:</p>
                <img src="cid:image${index}" alt="${
            borrow.name
        }" style="max-width: 200px; height: auto;" />
            </div>
        `;
        attachImage.push({
            path: borrow.image,
            cid: `image${index}`,
        });
    });

    const totalBorrowPrice = borrowItems
        .reduce((sum, borrow) => sum + borrow.amount * borrow.price, 0)
        .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: 'Thuê thành công tại THANGBOOK!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #4CAF50;">Thuê thành công!</h2>
                <p>Cảm ơn bạn đã thuê sản phẩm tại <b>THANGBOOK</b>. Dưới đây là chi tiết đơn hàng thuê của bạn:</p>
                <hr style="border: 1px solid #eee;" />
                ${listItem}
                <hr style="border: 1px solid #eee;" />
                <h3 style="color: #333;">Tổng giá trị đơn hàng thuê: <b>${totalBorrowPrice}</b></h3>
                <p>Vui lòng đến cửa hàng để nhận sản phẩm bất cứ khi nào bạn có thể. Nếu có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi!</p>
                <p style="color: #888;">Trân trọng,<br>Đội ngũ THANGBOOK</p>
            </div>
        `,
        attachments: attachImage,
    });

    return info;
};
