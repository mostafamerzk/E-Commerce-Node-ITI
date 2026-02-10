export const html = (link)=>{
    
  return `  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>Email Confirmation</title>
        <style>
            body { background-color: #88BDBF; margin: 0; }
            table { margin: auto; padding: 30px; background-color: #F3F3F3; border: 1px solid #630E2B; }
            h1, h3 { color: #630E2B; }
            a { margin: 10px 0px 30px 0px; border-radius: 4px; padding: 10px 20px; border: 0; color: #fff; background-color: #630E2B; text-decoration: none; }
            .header-img { width: 100px; }
            .icon { width: 50px; height: 50px; }
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
                                <p><a href="http://localhost:4200/#/" target="_blank">View In Website</a></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" style="text-align: center; background-color: #fff;">
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
                                <a href="${link}">Verify Email Address</a>
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
    </html>`
    
}