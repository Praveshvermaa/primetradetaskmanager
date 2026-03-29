import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Task from '../../../../../models/Task';
import { verifyAuth } from '../../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    await dbConnect();
    const task = await Task.findById(params.id).populate('userId', 'name email');

    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }


    if (task.userId._id.toString() !== authResult.user.id && authResult.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Not authorized to access this task' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    await dbConnect();
    let task = await Task.findById(params.id);

    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }


    if (task.userId.toString() !== authResult.user.id && authResult.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Not authorized to update this task' }, { status: 403 });
    }

    const body = await request.json();


    if (body.userId) {
      delete body.userId;
    }

    task = await Task.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true
    });

    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    await dbConnect();
    let task = await Task.findById(params.id);

    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    if (task.userId.toString() !== authResult.user.id && authResult.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Not authorized to delete this task' }, { status: 403 });
    }

    await task.deleteOne();

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
