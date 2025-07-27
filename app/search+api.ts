export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const type = url.searchParams.get('type') || 'all';
  const genre = url.searchParams.get('genre') || 'all';

  // Mock search results
  const allContent = [
    {
      id: '1',
      title: 'The Lion King',
      description: 'A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.',
      poster: 'https://images.pexels.com/photos/33053/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
      year: 2019,
      type: 'movie',
      genre: 'family',
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Frozen II',
      description: 'Elsa the Snow Queen has an extraordinary gift -- the power to create ice and snow.',
      poster: 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
      year: 2019,
      type: 'movie',
      genre: 'animation',
      rating: 4.7,
    },
    {
      id: '3',
      title: 'The Mandalorian',
      description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy.',
      poster: 'https://images.pexels.com/photos/586414/pexels-photo-586414.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
      year: 2019,
      type: 'series',
      genre: 'sci-fi',
      rating: 4.9,
    },
  ];

  let results = allContent;

  // Filter by search query
  if (query) {
    results = results.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by type
  if (type !== 'all') {
    results = results.filter(item => item.type === type);
  }

  // Filter by genre
  if (genre !== 'all') {
    results = results.filter(item => item.genre === genre);
  }

  return Response.json({
    success: true,
    data: results,
    query: query,
    filters: { type, genre },
    total: results.length
  });
}