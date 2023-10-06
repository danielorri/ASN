const getParts = async(shipping) =>{
    try {
        const response = await fetch('http://localhost:3010/getParts', {
          method: 'POST', // Assuming your server expects a POST request
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(shipping),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        return data; 
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors as needed
      }
};

module.exports = getParts;