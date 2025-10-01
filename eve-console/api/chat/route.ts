import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Get the user from the request (assuming you have auth like NextAuth or Clerk)
    const user = req.user; // This comes from your auth middleware

    // Check if user exists and is authenticated
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No user logged in' }, 
        { status: 401 }
      );
    }

    // Get the userId from the request body
    const { userId, message } = await req.json();

    // Check if the userId matches the authenticated user
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - User mismatch' }, 
        { status: 401 }
      );
    }

    // Now process the chat request (your OpenRouter call here)
    // ... your existing chat logic ...

    return NextResponse.json({ reply: 'Your AI response' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
