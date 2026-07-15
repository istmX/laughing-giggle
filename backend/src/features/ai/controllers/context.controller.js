export const generateContext = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    
    const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaId, userId })
    });
    
    if (!response.ok) throw new Error("Failed to fetch from python service");
    
    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
