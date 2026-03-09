import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { updateStudentRow, deleteStudentRow } from '@/lib/sheets';

export async function PATCH(request: Request) {
    try {
        const { id, data } = await request.json();
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        console.log(`[Students CRUD] Updating student: ${id}`);

        // 1. Update Prisma
        await prisma.student.update({
            where: { cr69d_studentid: id },
            data: {
                ...data,
                cr69d_totaloutstanding: data.cr69d_totaloutstanding !== undefined ? parseFloat(String(data.cr69d_totaloutstanding).replace(/[^0-9.-]+/g, '')) : undefined,
                cr69d_age: data.cr69d_age !== undefined ? parseInt(String(data.cr69d_age)) : undefined,
                cr69d_datejoined: data.cr69d_datejoined ? new Date(data.cr69d_datejoined) : undefined,
            }
        });

        // 2. Update Sheets
        await updateStudentRow(id, data);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Students PATCH Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        console.log(`[Students CRUD] Deleting student: ${id}`);

        // 1. Delete from Prisma
        await prisma.student.delete({
            where: { cr69d_studentid: id }
        });

        // 2. Delete from Sheets
        await deleteStudentRow(id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Students DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
