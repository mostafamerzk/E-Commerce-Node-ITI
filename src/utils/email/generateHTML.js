export const html = (link) => {
  return `  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>Email Confirmation</title>
        <style>
            body { background-color: #88BDBF; margin: 0; font-family: sans-serif; }
            table { margin: auto; padding: 30px; background-color: #F3F3F3; border: 1px solid #630E2B; width: 100%; max-width: 600px; }
            h1, h3 { color: #630E2B; }
            a.btn { margin: 10px 0px 30px 0px; border-radius: 4px; padding: 10px 20px; border: 0; color: #fff; background-color: #630E2B; text-decoration: none; display: inline-block; }
            .header-img { width: 100px; }
            .icon { width: 50px; height: 50px; }
            .order-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .order-table th, .order-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .order-table th { background-color: #630E2B; color: white; }
        </style>
    </head>
    <body>
        <table>
            <tr>
                <td>
                    <table width="100%">
                        <tr>
                            <td>
                                <h1>
                                    <img class="header-img" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" alt="Logo"/>
                                </h1>
                            </td>
                            <td style="text-align: right;">
                                <p><a href="https://e-commerce-node-iti.vercel.app/" target="_blank">View In Website</a></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" style="text-align: center; background-color: #fff; padding: 20px;">
                        <tr>
                            <td style="background-color: #630E2B; height: 100px;">
                                <img class="icon" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png" alt="Icon"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h1>Email Confirmation</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <a href="${link}" class="btn">Verify Email Address</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" style="text-align: center;">
                        <tr>
                            <td>
                                <h3>Stay in touch</h3>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
};

export const paymentReceiptHTML = (order, receiptUrl) => {
  const productRows = order.products
    .map(
      (p) => `
    <tr>
        <td>${p.title}</td>
        <td>${p.quantity}</td>
        <td>${p.unitPrice} EGP</td>
        <td>${p.unitPrice * p.quantity} EGP</td>
    </tr>
  `,
    )
    .join("");

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
        <style>
            body { background-color: #F8F9FA; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 20px auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            .header { background-color: #28a745; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .order-info { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .order-table th { text-align: left; background-color: #f2f2f2; padding: 10px; }
            .order-table td { padding: 10px; border-bottom: 1px solid #eee; }
            .total { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 0.9em; color: #777; }
            .btn { display: inline-block; padding: 12px 24px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Payment Successful!</h1>
            </div>
            <div class="content">
                <div class="order-info">
                    <p>Hello,</p>
                    <p>Thank you for your purchase! Your payment for order <strong>#${order.orderNumber}</strong> has been received successfully.</p>
                </div>
                <table class="order-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productRows}
                    </tbody>
                </table>
                <div class="total">
                    Total Amount: ${order.totalPrice} EGP
                </div>
                <div style="text-align: center;">
                    <a href="${receiptUrl}" class="btn">View Official Receipt</a>
                </div>
            </div>
            <div class="footer">
                <p>If you have any questions, please contact our support team.</p>
                <p>&copy; ${new Date().getFullYear()} E-Commerce Node ITI</p>
            </div>
        </div>
    </body>
    </html>`;
};

export const cancellationHTML = (order) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Cancelled</title>
        <style>
            body { background-color: #F8F9FA; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 20px auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            .header { background-color: #dc3545; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .order-info { margin-bottom: 20px; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 0.9em; color: #777; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Cancelled</h1>
            </div>
            <div class="content">
                <div class="order-info">
                    <p>Hello,</p>
                    <p>We are writing to inform you that your order <strong>#${order.orderNumber}</strong> has been cancelled.</p>
                    <p>If this was not expected, please contact our support team immediately.</p>
                </div>
                <p>Order Details:</p>
                <ul>
                    <li>Order Number: ${order.orderNumber}</li>
                    <li>Total Amount: ${order.totalPrice} EGP</li>
                    <li>Status: Cancelled</li>
                </ul>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} E-Commerce Node ITI</p>
            </div>
        </div>
    </body>
    </html>`;
};
