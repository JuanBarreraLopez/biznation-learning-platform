import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
const db = require('../../models');
const User = db.User;

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, error: 'El correo ya está registrado' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    res.status(201).json({ 
      success: true, 
      message: 'Usuario creado exitosamente', 
      data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno al crear el usuario' });
  }
};

// Obtener todos los usuarios (solo para Admin)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({ 
      attributes: ['id', 'name', 'email', 'role', 'createdAt'] 
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener usuarios' });
  }
};