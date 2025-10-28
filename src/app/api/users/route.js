import { NextResponse } from 'next/server';
import { seedUsers } from '../../../lib/seedUsers';

export async function GET() {
  try {
    // Return users without passwords for security
    const users = seedUsers.map(({ password, ...user }) => user);
    
    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}