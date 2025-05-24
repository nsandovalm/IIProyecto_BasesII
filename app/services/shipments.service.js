export async function fetchShipments() {
  try {
    const response = await fetch("http://localhost:5000/api/shipments");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shipments:", error);
    throw error;
  }
}
