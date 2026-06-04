async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' })
    });
    const data = await res.json();
    console.log('STATUS:', res.status);
    console.log('DATA:', data);
  } catch (err) {
    console.log('FETCH ERROR:', err);
  }
}

test();
