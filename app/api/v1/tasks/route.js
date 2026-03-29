import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Task from '../../../../models/Task';
import { verifyAuth } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { user } = authResult;
    await dbConnect();

    let tasks;

    if (user.role === 'admin') {
      tasks = await Task.find().populate('userId', 'name email').sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ userId: user.id }).sort({ createdAt: -1 });
    }

    return NextResponse.json(
      { success: true, count: tasks.length, data: tasks },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();
    const body = await request.json();


    body.userId = authResult.user.id;

    const task = await Task.create(body);

    return NextResponse.json(
      { success: true, data: task },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Server Error' },
      { status: 500 }
    );
  }
}
