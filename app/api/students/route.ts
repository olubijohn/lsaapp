import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');

    if (!org) {
      return NextResponse.json({ error: 'Missing organization code' }, { status: 400 });
    }

    console.log(`[Students API] Fetching students for org: "${org}" from Database`);

    const students = await prisma.student.findMany({
      where: {
        cr69d_instucode: org,
        cr69d_studentactive: true
      },
      orderBy: {
        cr69d_title: 'asc'
      }
    });

    console.log(`[Students API] Successfully fetched ${students.length} students from DB`);

    // Returning { students: [...] } to match previous API contract
    return NextResponse.json({ students });

  } catch (error: any) {
    console.error('Students API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
