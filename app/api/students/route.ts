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

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.cr69d_instucode) {
      return NextResponse.json({ error: 'Missing organization code' }, { status: 400 });
    }
    if (!data.cr69d_studentid) {
      return NextResponse.json({ error: 'Missing student ID' }, { status: 400 });
    }

    console.log(`[Students API] Creating student: ${data.cr69d_studentid} for org: ${data.cr69d_instucode}`);

    // 1. Save to Database (Prisma)
    const student = await prisma.student.create({
      data: {
        ...data,
        cr69d_totaloutstanding: parseFloat(String(data.cr69d_totaloutstanding || '0').replace(/[^0-9.-]+/g, '')) || 0,
        cr69d_age: data.cr69d_age ? parseInt(String(data.cr69d_age)) : null,
        cr69d_datejoined: data.cr69d_datejoined ? new Date(data.cr69d_datejoined) : null,
      }
    });

    // 2. Sync to Google Sheets
    const { addStudentRow } = await import('@/lib/sheets');
    await addStudentRow(data);

    return NextResponse.json({ success: true, student });

  } catch (error: any) {
    console.error('Students POST Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Student ID already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
