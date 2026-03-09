import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');

    if (!org) {
      return NextResponse.json({ error: 'Organisation is required' }, { status: 400 });
    }

    console.log(`[Stats API] Fetching students for org: "${org}" from Database`);

    // Fetch all active students for the organization
    const students = await prisma.student.findMany({
        where: {
            cr69d_instucode: org,
        }
    });

    if (!students || students.length === 0) {
        console.log(`[Stats API] No students found for org: "${org}"`);
        return NextResponse.json({ 
            totalStudents: 0,
            activePercentage: 0,
            genderRatio: { male: 0, female: 0 },
            clearedVsDebtors: { cleared: 0, debtors: 0 },
            clearedBalanceCount: 0,
            creditBalanceCount: 0,
            totalDebtors: 0,
            inactiveDebtSum: 0,
            totalPaid: 0,
            totalOwing: 0,
            paymentRatio: 0,
            whatsappFilled: 0,
            emailsFilled: 0,
            busSubscribers: 0,
            smsSubscribers: 0,
            incompleteProfiles: 0,
            levels: [],
            sections: []
        });
    }

    console.log(`[Stats API] Found ${students.length} students for org: "${org}"`);

    const totalStudents = students.length;
    let activeStudentsCount = 0;
    let maleCount = 0;
    let femaleCount = 0;
    
    let ratioCleared = 0;
    let ratioDebtors = 0;

    let clearedBalanceCount = 0;
    let creditBalanceCount = 0;
    let totalDebtorsCount = 0;
    
    let inactiveDebtSum = 0;
    let totalPaid = 0;
    let totalOwing = 0;
    
    let whatsappCount = 0;
    let emailCount = 0;
    let busSubscribers = 0;
    let smsSubscribers = 0;
    
    const levelsMap: { [key: string]: { count: number; paid: number; owing: number } } = {};
    const sectionsMap: { [key: string]: { count: number; paid: number; owing: number } } = {};

    students.forEach(student => {
        const isActive = student.cr69d_studentactive;
        if (isActive) activeStudentsCount++;

        const balance = student.cr69d_totaloutstanding || 0;

        if (balance > 0) {
            totalOwing += balance;
        } else if (balance < 0) {
            totalPaid += Math.abs(balance);
        }

        const gender = (student.cr69d_gender || '').toLowerCase();
        if (isActive) {
            if (gender === 'male' || gender === 'm') maleCount++;
            else if (gender === 'female' || gender === 'f') femaleCount++;
        }

        if (balance < 1) ratioCleared++;
        if (balance > 1) ratioDebtors++;
        
        if (balance < 1 && balance > -1) clearedBalanceCount++;
        if (balance < 0) creditBalanceCount++;
        if (balance > 0) totalDebtorsCount++;

        if (!isActive && balance > 0) {
            inactiveDebtSum += balance;
        }

        if (student.cr69d_guardianwhatsapp && student.cr69d_guardianwhatsapp.trim().length > 5) whatsappCount++;
        if (student.cr69d_emailaddress && student.cr69d_emailaddress.trim().includes('@')) emailCount++;

        if (student.cr69d_bus_subcriber) busSubscribers++;
        if (student.cr69d_sms_subscriber) smsSubscribers++;

        const level = (student.cr69d_level || 'Unknown').trim();
        if (!levelsMap[level]) levelsMap[level] = { count: 0, paid: 0, owing: 0 };
        levelsMap[level].count++;
        if (balance > 0) levelsMap[level].owing += balance;
        else levelsMap[level].paid += Math.abs(balance);

        const section = (student.cr69d_section || 'General').trim();
        if (!sectionsMap[section]) sectionsMap[section] = { count: 0, paid: 0, owing: 0 };
        sectionsMap[section].count++;
        if (balance > 0) sectionsMap[section].owing += balance;
        else sectionsMap[section].paid += Math.abs(balance);
    });

    const levels = Object.entries(levelsMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count);

    const sections = Object.entries(sectionsMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count);

    const stats = {
        activePercentage: totalStudents ? (activeStudentsCount / totalStudents) * 100 : 0,
        genderRatio: { male: maleCount, female: femaleCount },
        clearedVsDebtors: { cleared: ratioCleared, debtors: ratioDebtors },
        totalStudents,
        clearedBalanceCount,
        creditBalanceCount,
        totalDebtors: totalDebtorsCount,
        inactiveDebtSum,
        totalPaid,
        totalOwing,
        paymentRatio: (totalPaid + totalOwing) > 0 ? (totalPaid / (totalPaid + totalOwing)) * 100 : 0,
        whatsappFilled: whatsappCount,
        emailsFilled: emailCount,
        busSubscribers,
        smsSubscribers,
        incompleteProfiles: Math.max(0, totalStudents - Math.min(whatsappCount, emailCount)),
        levels,
        sections,
    };

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
