import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SRD from '@/models/SRD';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id, dept } = resolvedParams;
    const body = await request.json();

    const srd = await SRD.findById(id);
    
    if (!srd) {
      return NextResponse.json({
        success: false,
        error: 'SRD not found'
      }, { status: 404 });
    }
    
    // Validate required comment when flagging
    if (body.status === 'flagged' && (!body.comment || !body.comment.text)) {
      return NextResponse.json({
        success: false,
        error: 'Comment is required when flagging an SRD'
      }, { status: 400 });
    }
    
    const updates = {
      [`status.${dept}`]: body.status,
      updatedAt: new Date()
    };
    
    // Update department-specific fields
    if (body.fields && Object.keys(body.fields).length > 0) {
      Object.keys(body.fields).forEach(field => {
        updates[`${dept}Fields.${field}`] = body.fields[field];
      });
    }
    
    // Update CAD subprocesses
    if (dept === 'cad' && body.cadSubprocesses) {
      Object.keys(body.cadSubprocesses).forEach(subprocess => {
        updates[`cadSubprocesses.${subprocess}`] = body.cadSubprocesses[subprocess];
      });
    }
    
    // Add comment if provided
    if (body.comment && body.comment.text) {
      srd.comments.push({
        department: dept,
        author: body.comment.author,
        role: body.comment.role,
        text: body.comment.text,
        date: new Date()
      });
      updates.comments = srd.comments;
    }
    
    const updatedSRD = await SRD.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    
    // Simulate Pusher events
    if (body.status === 'flagged') {
      console.log('Pusher event: srd:flag', { 
        id, 
        department: dept,
        comment: body.comment 
      });
    } else {
      console.log('Pusher event: srd:update', { 
        id, 
        department: dept,
        status: body.status
      });
    }
    
    return NextResponse.json({
      success: true,
      data: updatedSRD,
      message: `${dept.toUpperCase()} department updated successfully`
    });
  } catch (error) {
    console.error('Error updating SRD department:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}