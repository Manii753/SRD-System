import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SRD from '@/models/SRD';
import pusher from '@/lib/pusher-server';

export async function PATCH(request, context) {
  try {
    await dbConnect();
    const params = await context.params;
    const { id, dept } = params;
    const body = await request.json();

    console.log(`[PATCH] Department update for ${dept}:`, JSON.stringify(body, null, 2));

    const srd = await SRD.findById(id);

    if (!srd) {
      return NextResponse.json({ success: false, error: 'SRD not found' }, { status: 404 });
    }

    console.log(`[PATCH] Current status for ${dept}:`, srd.status?.[dept]);

    // Validate required comment when flagging
    if (body.status === 'flagged' && (!body.comment || !body.comment.text)) {
      return NextResponse.json({ success: false, error: 'Comment is required when flagging an SRD' }, { status: 400 });
    }

    // Update status
    if (!srd.status) {
      srd.status = {};
    }
    srd.status[dept] = body.status;
    srd.markModified('status');
    srd.updatedAt = new Date();

    // Update department-specific fields
    if (body.fields && Object.keys(body.fields).length > 0) {
      srd[`${dept}Fields`] = { ...(srd[`${dept}Fields`] || {}), ...body.fields };
    }

    // Add comment if provided
    if (body.comment && body.comment.text) {
      srd.comments.push({
        department: dept,
        author: body.comment.author,
        role: body.comment.role,
        text: body.comment.text,
        date: new Date(),
      });
    }

    // Add audit record
    srd.audit.push({
      department: dept,
      author: body.comment?.author || 'System',
      action: body.status,
      comment: body.comment?.text,
      date: new Date(),
    });

    const updatedSRD = await srd.save();

    console.log(`[PATCH] After save - ${dept}:`, updatedSRD.status?.[dept], 'Progress:', updatedSRD.progress);

    // Trigger Pusher event
    const eventName = body.status === 'flagged' ? 'srd:flag' : 'srd:update';
    await pusher.trigger(`srd-${id}`, eventName, {
      department: dept,
      status: body.status,
      comment: body.comment,
    });

    return NextResponse.json({
      success: true,
      data: updatedSRD,
      message: `${dept.toUpperCase()} department updated successfully`,
    });
  } catch (error) {
    console.error('Error updating SRD department:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}