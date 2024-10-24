import { NextResponse } from 'next/server';

export async function fetchAllUsers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/users/AllUsers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'Failed to fetch users' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


