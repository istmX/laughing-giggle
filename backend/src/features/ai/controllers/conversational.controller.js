import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";
import Brief from "../../brief/brief.model.js";

export const processConversation = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const { history } = req.body;
    const userId = req.user.id;

    const ideaDoc = await Idea.findById(ideaId);
    if (!ideaDoc) return res.status(404).json({ error: "Idea not found" });

    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });

    try {
      const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: ideaDoc.prompt, idea_id: ideaId, history: history || [] })
      });
      
      if (!response.ok) throw new Error("Failed to fetch from python service");
      
      const result = await response.json();
      
      generation.status = "completed";
      generation.model = result.providerUsed || "python-service";
      generation.metadata = { fallbackUsed: result.fallbackUsed, fallbackProvider: result.fallbackProvider };
      await generation.save();

      // Find or create Brief to save the AI-generated questions and answers
      let brief = await Brief.findOne({ idea: ideaId, owner: userId });
      if (!brief) {
        brief = new Brief({ owner: userId, idea: ideaId });
      }

      // Map Q&A history to answers object
      brief.answers = (history || []).reduce((acc, item) => {
        if (item.question && item.answer !== undefined) {
          acc[item.question] = item.answer;
        }
        return acc;
      }, {});

      // Map Q&A history to questions array matching schema
      brief.questions = (history || []).map((item, index) => ({
        key: `q${index + 1}`,
        question: item.question,
        status: 'answered',
        answer: item.answer,
        answeredAt: new Date(),
        createdAt: new Date(),
      }));

      // Extract metadata fields from the conversation text
      const fullText = (history || []).map(h => `${h.question} ${h.answer}`).join(" ").toLowerCase();

      // Platform mapping:
      if (fullText.includes("react native") || fullText.includes("mobile app") || fullText.includes("ios") || fullText.includes("android")) {
        brief.platform = "mobile";
        brief.frontend_stack = "react-native";
      } else if (fullText.includes("web app") || fullText.includes("website") || fullText.includes("nextjs") || fullText.includes("next.js")) {
        brief.platform = "web";
      } else if (fullText.includes("desktop")) {
        brief.platform = "desktop";
      }

      // Frontend stack mapping:
      if (fullText.includes("nextjs") || fullText.includes("next.js")) {
        brief.frontend_stack = "nextjs";
      } else if (fullText.includes("react") && !fullText.includes("react-native")) {
        brief.frontend_stack = "react";
      }

      // Backend stack mapping:
      if (fullText.includes("express") || fullText.includes("node")) {
        brief.backend_stack = "mern";
      }

      // Database mapping:
      if (fullText.includes("mongodb") || fullText.includes("mongo")) {
        brief.database = "mongodb";
      } else if (fullText.includes("postgres") || fullText.includes("postgresql")) {
        brief.database = "postgresql";
      } else if (fullText.includes("supabase")) {
        brief.database = "supabase";
      }

      // UI Style mapping:
      if (fullText.includes("minimal")) {
        brief.ui_style = "minimal";
      } else if (fullText.includes("glassmorphic") || fullText.includes("glassmorphism")) {
        brief.ui_style = "glassmorphism";
      } else if (fullText.includes("corporate") || fullText.includes("business")) {
        brief.ui_style = "corporate";
      } else if (fullText.includes("modern")) {
        brief.ui_style = "modern";
      }

      // Target users & App Type mapping:
      const appTypeItem = (history || []).find(h => h.question.toLowerCase().includes("type of") || h.question.toLowerCase().includes("category") || h.question.toLowerCase().includes("what kind of"));
      if (appTypeItem) brief.application_type = appTypeItem.answer;
      
      const targetUserItem = (history || []).find(h => h.question.toLowerCase().includes("target") || h.question.toLowerCase().includes("user") || h.question.toLowerCase().includes("who will"));
      if (targetUserItem) brief.target_users = targetUserItem.answer;

      if (result.response && result.response.is_complete) {
        brief.is_complete = true;
      }

      await brief.save();
      
      res.status(200).json(result.response || result);
    } catch (error) {
      generation.status = "failed";
      generation.error_message = error.message;
      await generation.save();
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
