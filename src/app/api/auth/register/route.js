// Next Imports
import { NextResponse } from 'next/server'


export async function POST(req) {
  const { email, password, name } = await req.json()

  try {
    const Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })

    if (Response.ok) {
      const userData = await Response.json()
      const { password: _, ...filteredUserData } = userData

      return NextResponse.json(filteredUserData)
      
    } else {
      const errorData = await Response.json()
      return NextResponse.json(
        {
          message: errorData.message || ['Registration failed. Please try again.'],
        },
        {
          status: Response.status,
          statusText: Response.statusText,
        }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: ['An error occurred while processing your registration request'],
      },
      {
        status: 500,
        statusText: 'Internal Server Error',
      }
    )
  }
}

