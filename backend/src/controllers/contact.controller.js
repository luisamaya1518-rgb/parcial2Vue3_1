const transporter = require('../config/mailer');

exports.enviar = async (req, res, next) => {
  try {
    const { email, mensaje } = req.body;

    await transporter.sendMail({
      from: `"Sistema Gestión Médica" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: 'Nuevo mensaje de contacto - Gestión Médica',
      html: `
        <h3>Nuevo mensaje desde el formulario de contacto</h3>
        <p><strong>Correo del remitente:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `
    });

    res.json({ ok: true, message: 'Mensaje enviado correctamente' });
  } catch (err) { next(err); }
};