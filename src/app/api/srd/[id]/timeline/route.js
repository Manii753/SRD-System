import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SRD from '@/models/SRD';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    console.log('Attempting to find SRD with ID:', resolvedParams.id);
    const srd = await SRD.findById(resolvedParams.id);
    
    if (!srd) {
      console.log('SRD not found for ID:', resolvedParams.id);
      return NextResponse.json({
        success: false,
        error: 'SRD not found'
      }, { status: 404 });
    }
    console.log('SRD found:', srd.refNo);
    
    // Combine audit log and comments into timeline
    const timeline = [
      ...srd.audit.map(entry => ({
        type: 'audit',
        timestamp: entry.timestamp,
        action: entry.action,
        department: entry.department,
        author: entry.author,
        details: entry.details
      })),
      ...srd.comments.map(comment => ({
        type: 'comment',
        timestamp: comment.date,
        department: comment.department,
        author: comment.author,
        role: comment.role,
        text: comment.text
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    console.log('Constructed timeline:', timeline);
    
    return NextResponse.json({
      success: true,
      data: timeline
    });
  } catch (error) {
    console.error('Error in timeline API:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
