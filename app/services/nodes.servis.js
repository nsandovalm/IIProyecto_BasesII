export async function fetchCentros() {
  try {
    const response = await fetch("http://localhost:5000/api/nodes");
    if (!response.ok) throw new Error("Error al obtener centros logísticos");
    const data = await response.json();
    console.log("Datos de centros logísticos:", data);
    return data;
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "No se pudieron cargar los centros logísticos.",
      variant: "destructive",
    });
  }
}
