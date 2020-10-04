module.exports = {
	name: 'Password Change',

	description: 'Notifies user that his/her password has been changed',

	body: (name) => {
		return `<!DOCTYPE html>
    <html  style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style type="text/css">

    </style>
    </head>
    <body>
      <h1>Your password has been changed</h1>
      <p>
        Hi ${name},
        <br>
        A password change has been submitted to your user account registered with this email address.
        <br>
        If it was you, please ignore this email, but if you didn't request the change please contact support at support@tripmate.com
        <br>
      </p>
        Trip Mate
        <br>
        7, some street
        <br>
        12345, City
        <br>
        <p><a href="mailto: contact@tripmate.com">contact@tripmate.com</a></p>
      </p>
    </body>
    `;
	},
};
