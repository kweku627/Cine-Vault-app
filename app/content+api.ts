export function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const category = url.searchParams.get('category');

  // Mock content data
  const content = [
    {
      id: '1',
      title: 'The Lion King',
      description: 'A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.',
      poster: 'https://images.pexels.com/photos/33053/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
      backdrop: 'https://images.pexels.com/photos/33053/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2',
      year: 2019,
      type: 'movie',
      genre: 'family',
      duration: 118,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Frozen II',
      description: 'Elsa the Snow Queen has an extraordinary gift -- the power to create ice and snow.',
      poster: 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
      backdrop: 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2',
      year: 2019,
      type: 'movie',
      genre: 'animation',
      duration: 103,
      rating: 4.7,
    },
    // Add more content items...
  ];

  let filteredContent = content;

  if (type && type !== 'all') {
    filteredContent = filteredContent.filter(item => item.type === type);
  }

  if (category && category !== 'all') {
    filteredContent = filteredContent.filter(item => item.genre === category);
  }

  return Response.json({ 
    success: true, 
    data: filteredContent,
    total: filteredContent.length 
  });
}

export function POST(request: Request) {
  return Response.json({ 
    success: true, 
    message: 'Content created successfully' 
  });
}