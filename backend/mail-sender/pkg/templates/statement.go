package templates

import "fmt"

func GenerateApplicationHTML(name, phone, description string) string {
	html := fmt.Sprintf(`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Новая заявка</title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #333333;
            line-height: 1.6;
        }
        .container {
            width: 100%%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2654DC;
            padding: 20px;
            color: white;
            text-align: center;
        }
        .content {
            padding: 30px 20px;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-bottom: none;
        }
        .info-table {
            width: 100%%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .info-table th {
            text-align: left;
            padding: 12px 15px;
            background-color: #f8f9fa;
            border: 1px solid #e0e0e0;
            font-weight: bold;
            color: #2654DC;
            vertical-align: top;
        }
        .info-table td {
            padding: 12px 15px;
            border: 1px solid #e0e0e0;
            vertical-align: top;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: white;
            background-color: #2654DC;
        }
    </style>
</head>
<body>
    <table width="100%%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <table class="container" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="header">
                            <h1>Новая заявка на услугу</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <p>Поступила новая заявка от клиента. Ниже указаны контактные данные и описание:</p>
                            <table class="info-table">
                                <tr>
                                    <th>Имя</th>
                                    <td>%s</td>
                                </tr>
                                <tr>
                                    <th>Телефон</th>
                                    <td>%s</td>
                                </tr>
                                <tr>
                                    <th>Описание</th>
                                    <td style="white-space: pre-wrap;">%s</td>
                                </tr>
                            </table>
                            <p>Пожалуйста, свяжитесь с клиентом в ближайшее время.</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer">
                            &copy; 2025 Эстетика. Все права защищены.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`, name, phone, description)

	return html
}
