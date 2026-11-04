const db = require('../models');
const User = db.User;
const Classification = db.Classification;

export const runClassificationJob = async (): Promise<void> => {
  console.log('⏳ [Job] Iniciando algoritmo de clasificación de estudiantes...');
  
  try {
    // 1. Buscar a todos los usuarios que son estudiantes
    const students = await User.findAll({ where: { role: 'student', is_active: true } });

    if (students.length === 0) {
      console.log('✅ [Job] No hay estudiantes para clasificar hoy.');
      return;
    }

    let processed = 0;

    // 2. Procesar cada estudiante (Simulación de motor de reglas)
    for (const student of students) {
      // En un entorno real, aquí validaríamos fechas de última conexión o progreso.
      // Para este MVP, aplicaremos la regla de negocio "En Riesgo" a todos los estudiantes 
      // encontrados para demostrar que la inserción en la tabla funciona.
      
      await Classification.upsert({
        user_id: student.id,
        status: 'at_risk',
        reason: 'Inactividad prolongada (Regla automatizada)'
      });

      processed++;
    }

    console.log(`✅ [Job] Clasificación completada. ${processed} estudiantes marcados en riesgo.`);
  } catch (error) {
    console.error('❌ [Job] Error ejecutando la clasificación:', error);
  }
};