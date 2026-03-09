import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkPrisma() {
    try {
        const counts = await prisma.student.groupBy({
            by: ['cr69d_instucode'],
            _count: {
                _all: true
            }
        });
        console.log("Prisma Student Counts:", JSON.stringify(counts, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkPrisma();
