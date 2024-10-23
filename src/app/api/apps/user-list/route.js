/**
 * ! We haven't used this file in our template. We've used the server actions in the
 * ! `src/app/server/actions.ts` file to fetch the static data from the fake-db.
 * ! This file has been created to help you understand how you can create your own API routes.
 * ! Only consider making API routes if you're planing to share your project data with other applications.
 * ! else you can use the server actions or third-party APIs to fetch the data from your database.
 */
// Next Imports
// import { NextResponse } from 'next/server'

// // Data Imports
// import { db } from '@/fake-db/apps/userList'

// export async function GET() {
//   return NextResponse.json(db)
// }

// app/api/users/route.js
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

export async function deleteUser (id) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/users/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
         token: `${session?.user?.token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'Failed to delete user' }, { status: response.status });
    }

    const result = await response.json();
    console.log('User deleted successfully:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

