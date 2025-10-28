import { NextResponse } from 'next/server';
import { getSRDById, updateSRD, addComment } from '../../../../../../lib/mockData';

export async function PATCH(request, { params }) {
  try {
    const { id, dept } = params;
    const body = await request.json();
    const srd = getSRDById(id);
    
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
      status: {
        ...srd.status,
        [dept]: body.status
      }
    };
    
    // Update department-specific fields
    if (body.fields && Object.keys(body.fields).length > 0) {
      updates[`${dept}Fields`] = {
        ...srd[`${dept}Fields`],
        ...body.fields
      };
    }
    
    // Update CAD subprocesses
    if (dept === 'cad' && body.cadSubprocesses) {
      updates.cadSubprocesses = {
        ...srd.cadSubprocesses,
        ...body.cadSubprocesses
      };
    }
    
    const updatedSRD = updateSRD(id, updates);
    
    // Add comment if provided
    if (body.comment && body.comment.text) {
      addComment(id, {
        department: dept,
        author: body.comment.author,
        role: body.comment.role,
        text: body.comment.text
      });
    }
    
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
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}