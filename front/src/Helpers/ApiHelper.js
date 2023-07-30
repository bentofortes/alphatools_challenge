
export async function get_prices(config) {
  const response = await fetch(
    `/get_prices/?config=${JSON.stringify(config)}`,
    {
      mode: "cors",  
      method: "GET",
      headers: {
        'Content-Type': "application/json"
      }
    }
  )
  
  return response.json();
}


export async function get_history() {
  const response = await fetch('/reload/')
  return response.json();
}