import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Importamos los modelos de Sequelize generados
const db = require('../../models');
const User = db.User;

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Validar que vengan los datos
    if (!email || !password) {
      res.status(400).json({ error: 'El email y la contraseña son obligatorios' });
      return;
    }

    // 2. Buscar al usuario activo
    const user = await User.findOne({ where: { email, is_active: true } });
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // 3. Comparar la contraseña encriptada con bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // 4. Generar el JSON Web Token (JWT)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secreto_seguro',
      { expiresIn: '8h' }
    );

    // 5. Responder ocultando el password_hash por seguridad
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};