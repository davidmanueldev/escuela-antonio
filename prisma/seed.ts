import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMINISTRADOR
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin1",
    },
  });
  await prisma.admin.create({
    data: {
      id: "admin2",
      username: "admin2",
    },
  });

  // GRADO
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // CLASE
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`, 
        gradeId: i, 
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // MATERIA
  const subjectData = [
    { name: "Cálculo" },
    { name: "Álgebra" },
    { name: "Inglés" },
    { name: "Programación" },
    { name: "Bases de Datos" },
    { name: "Física" },
    { name: "Investigación Operativa" },
    { name: "Electrónica General" },
    { name: "Sistemas Operativos" },
    { name: "Análisis y Diseño" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // PROFESORES
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`, // ID único para el profesor
        username: `teacher${i}`,
        name: `TNombre${i}`,
        surname: `TApellido${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Dirección${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] }, 
        classes: { connect: [{ id: (i % 6) + 1 }] }, 
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
  }

  // LECCIONES
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lección${i}`, 
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ], 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)), 
        subjectId: (i % 10) + 1, 
        classId: (i % 6) + 1, 
        teacherId: `teacher${(i % 15) + 1}`, 
      },
    });
  }

  // PADRES
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: `PNombre ${i}`,
        surname: `PApellido ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Dirección${i}`,
      },
    });
  }

  // ESTUDIANTES
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`, 
        username: `student${i}`, 
        name: `ENombre${i}`,
        surname: `EApellido ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Dirección${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`, 
        gradeId: (i % 6) + 1, 
        classId: (i % 6) + 1, 
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      },
    });
  }

  // EXAMENES
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Examen ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // TAREAS
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Tareas ${i}`, 
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // RESULTADOS
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90, 
        studentId: `student${i}`, 
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
      },
    });
  }

  // ASISTENCIA
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(), 
        present: true, 
        studentId: `student${i}`, 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // EVENTOS
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Evento ${i}`, 
        description: `Descripción del Evento ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        classId: (i % 5) + 1, 
      },
    });
  }

  // ANUNCIOS
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Anuncio ${i}`, 
        description: `Descripción del Anuncio ${i}`, 
        date: new Date(), 
        classId: (i % 5) + 1, 
      },
    });
  }

  console.log("Seeding completado exitosamente.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
