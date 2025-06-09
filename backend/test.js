import fetch from 'node-fetch';

async function testEndpoints() {
  try {
    // Test the /test endpoint
    console.log('Testing /test endpoint...');
    const testResponse = await fetch('http://localhost:5000/test');
    console.log('Test response:', await testResponse.json());

    // Test the /login endpoint
    console.log('\nTesting /login endpoint...');
    const loginResponse = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
      }),
    });
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (loginData.token) {
      // Test the /settings endpoint
      console.log('\nTesting /settings endpoint...');
      const settingsResponse = await fetch('http://localhost:5000/settings', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
        },
      });
      console.log('Settings response:', await settingsResponse.json());

      // Test updating settings
      console.log('\nTesting settings update...');
      const updateResponse = await fetch('http://localhost:5000/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({
          darkMode: true,
          emailNotifications: false,
        }),
      });
      console.log('Update response:', await updateResponse.json());
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testEndpoints(); 