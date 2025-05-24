export async function fetchRutas(nodeId) {
  try {
    const response = await fetch("http://localhost:5001/api/rutas", {
      headers: {
        "x-node-id": nodeId,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching rutas:", error);
    throw error;
  }
}
