import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SRD from '@/models/SRD';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const readyForProduction = searchParams.get('readyForProduction');
    
    let query = {};

    // Filter by department status
    if (department && department !== 'all') {
      query[`status.${department}`] = { $exists: true };
    }

    // Filter by status
    if (status && status !== 'all') {
      if (department && department !== 'all') {
        query[`status.${department}`] = status;
      } else {
        query['$or'] = [
          { 'status.vmd': status },
          { 'status.cad': status },
          { 'status.commercial': status },
          { 'status.mmc': status },
        ];
      }
    }
    
    // Filter by readyForProduction
    if (readyForProduction === 'true') {
      query['readyForProduction'] = true;
    }
    
    // Search by refNo or title
    if (search) {
      query['$or'] = [
        { refNo: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }
    
    const srds = await SRD.find(query).sort({ createdAt: -1 });
    const count = await SRD.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: srds,
      count: count
    });
  } catch (error) {
    console.error('Error in GET /api/srd:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
  console.log('POST /api/srd body:', JSON.stringify(body).slice(0, 1000));
    
    // Normalize images array to plain strings to avoid unexpected types (File objects, nested arrays)
    if (body.images && Array.isArray(body.images)) {
      body.images = body.images.flat().map((v) => String(v));
    }

    const newSRD = await SRD.create(body);
    
    return NextResponse.json({
      success: true,
      data: newSRD,
      message: 'SRD created successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/srd:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
