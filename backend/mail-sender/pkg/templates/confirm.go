package templates

import "fmt"

func GenerateConfirmHTML(username, code string) string {
	html := fmt.Sprintf(
		`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Подтверждение</title>
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
        }
        .code {
            display: inline-block;
            margin: 20px 0;
            padding: 15px 25px;
            background-color: #f0f0f0;
            border-radius: 4px;
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
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
                            <h1>Подтверждение регистрации</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <p>Привет, %s!</p>
                            <p>Для завершения регистрации используй следующий код подтверждения:</p>
                            <div class="code">%s</div>
                            <p>Если ты не регистрировался на нашем сайте, просто проигнорируй это письмо.</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer">
                            &copy; 2023 Эстетика. Все права защищены.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`, username, code)

	return html
}
