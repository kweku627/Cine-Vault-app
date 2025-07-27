export function GET(request: Request) {
  // Mock user profile data
  const userProfile = {
    id: '1',
    name: 'Disney Fan',
    email: 'fan@disney.com',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subscription: {
      plan: 'Disney+ Premium',
      price: '$12.99/month',
      status: 'active',
      nextBilling: '2024-02-15'
    },
    preferences: {
      notifications: true,
      autoDownload: false,
      videoQuality: 'HD'
    },
    stats: {
      watchedCount: 42,
      watchlistCount: 18,
      downloadsCount: 5,
      hoursWatched: 168
    }
  };

  return Response.json({
    success: true,
    data: userProfile
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  
  // Mock update user profile
  return Response.json({
    success: true,
    message: 'Profile updated successfully',
    data: body
  });
}

export function DELETE(request: Request) {
  // Mock delete user account
  return Response.json({
    success: true,
    message: 'Account deleted successfully'
  });
}