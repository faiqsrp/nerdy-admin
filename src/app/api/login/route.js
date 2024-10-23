// Next Imports
import { NextResponse } from 'next/server'

// // Mock data for demo purpose
// import { users } from './users'

// export async function POST(req) {
//   // Vars
//   const { email, password } = await req.json()
//   const user = users.find(u => u.email === email && u.password === password)
//   let response = null

//   if (user) {
//     const { password: _, ...filteredUserData } = user

//     response = {
//       ...filteredUserData
//     }

//     return NextResponse.json(response)
//   } else {
//     // We return 401 status code and error message if user is not found
//     return NextResponse.json(
//       {
//         // We create object here to separate each error message for each field in case of multiple errors
//         message: ['Email or Password is invalid']
//       },
//       {
//         status: 401,
//         statusText: 'Unauthorized Access'
//       }
//     )
//   }
// }
export async function POST(req) {
  const { email, password } = await req.json()
  console.log(req.body)

  try {
    const Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (Response.ok) {
      const userData = await Response.json()
      const { password: _, ...filteredUserData } = userData

      return NextResponse.json(filteredUserData)
    } else {
      const errorData = await Response.json()
      return NextResponse.json(
        {
          message: errorData.message || ['Email or Password is invalid'],
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
          message: ['Email or Password is invalid']
        },
        {
          status: 401,
          statusText: 'Unauthorized Access'
        }
    )
}
}
