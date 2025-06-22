import type { RequestEvent } from '@builder.io/qwik-city';

export const onGet = async (requestEvent: RequestEvent) => {
  console.log('TEST API: çağrıldı');
  
  const testData = [
    { id: 1, name: 'Test Product 1', category: 'Test' },
    { id: 2, name: 'Test Product 2', category: 'Test' }
  ];
  
  return new Response(JSON.stringify(testData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
