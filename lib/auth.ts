// // lib/auth.ts
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/app/lib/prisma";

// export async function getCurrentUser() {
//   try {
//     const cookieStore = cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return null;
//     }

//     // Verify token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET || "your-secret-key"
//     ) as { userId: string };

//     // Get user from database
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//       },
//     });

//     return user;
//   } catch (error) {
//     console.error("Get current user error:", error);
//     return null;
//   }
// }
