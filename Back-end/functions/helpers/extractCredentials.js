function extractCredentials(cookies) {
    // Split the cookies string by the semicolon to get individual key-value pairs
    const cookiePairs = cookies.split(';');
  
    // Initialize variables for username and password
    let username = '';
    let password = '';
  
    // Loop through the key-value pairs and extract the values
    for (const pair of cookiePairs) {
      const [key, value] = pair.trim().split('=');
  
      if (key === 'username') {
        username = value;
      } else if (key === 'password') {
        password = value;
      }
    }
  
    return { username, password };
  }
  
  module.exports = extractCredentials;