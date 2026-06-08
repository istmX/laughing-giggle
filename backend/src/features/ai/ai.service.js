import { GoogleGenAI } from '@google/genai';
import crypto from "crypto";
import { 
  buildIdeaAnalysisPrompt, 
  buildContextGenerationPrompt, 
  buildTaskGenerationPrompt 
} from './ai.prompt.js';
import { IdeaAnalysisSchema } from './ai.validator.js';
import Idea from "../ideas/idea.model.js";
import Brief from "../brief/brief.model.js";
import Context from "../context/context.model.js";
import Project from "../projects/project.model.js";
import Task from "../tasks/task.model.js";
import AIGeneration from "./ai.model.js";
import { validateOwnership } from "../../utils/ownership.js";
import AppError from "../../utils/AppError.js";
import { emitToUser } from "../../config/socket.js";

let aiClient = null;

const getAIClient = () => {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    // Correct initialization for @google/genai
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
};

export const analyzeIdeaWithAI = async (idea, brief, tracking) => {
  try {
    const client = getAIClient();
    const prompt = buildIdeaAnalysisPrompt(idea, brief);

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const text = response.text;
    const usage = response.usageMetadata;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Store token usage in AIGeneration tracking
    if (tracking && usage) {
      tracking.prompt_tokens = usage.promptTokenCount;
      tracking.completion_tokens = usage.candidatesTokenCount;
      tracking.total_tokens = usage.totalTokenCount;
    }

    return IdeaAnalysisSchema.parse(parsedData);
  } catch (error) {
    console.error("AI analysis failed:", error);
    throw error;
  }
};

export const analyzeIdea = async (userId, ideaId) => {
  const idea = await validateOwnership(Idea, ideaId, userId, "Idea");
  const brief = await Brief.findOne({ idea: ideaId, owner: userId });

  if (!brief) {
    throw new AppError("Brief not found", 404);
  }

  const generationHash = crypto.createHash('sha256').update(`${userId}-${ideaId}-${Date.now()}`).digest('hex');

  const tracking = await AIGeneration.create({
    owner: userId,
    idea: ideaId,
    status: 'processing',
    generation_hash: generationHash,
    model: 'gemini-2.5-flash'
  });

  const startTime = Date.now();

  try {
    const result = await analyzeIdeaWithAI(idea, brief, tracking);

    brief.is_complete = result.is_complete;
    brief.missing_fields = result.missing_fields;

    /* Overwrite with new questions from AI */
    brief.questions = result.questions.map((q) => ({
      key: q.key,
      question: q.question,
      status: "pending",
    }));

    await brief.save();

    /* Update tracking */
    tracking.status = 'completed';
    tracking.generation_time_ms = Date.now() - startTime;
    await tracking.save();

    emitToUser(userId, 'ai_generation_completed', {
      ideaId,
      status: 'completed',
      type: 'analysis'
    });

    return result;
  } catch (error) {
    tracking.status = 'failed';
    tracking.error_message = error.message;
    tracking.generation_time_ms = Date.now() - startTime;
    await tracking.save();

    emitToUser(userId, 'ai_generation_failed', {
      ideaId,
      status: 'failed',
      type: 'analysis',
      error: error.message
    });
    throw error;
  }
};

export const submitAnswers = async (userId, ideaId, answers) => {
  const idea = await validateOwnership(Idea, ideaId, userId, "Idea");
  const brief = await Brief.findOne({ idea: ideaId, owner: userId });

  if (!brief) {
    throw new AppError("Brief not found", 404);
  }

  if (!answers || typeof answers !== "object") {
    throw new AppError("Answers are required and must be an object", 400);
  }

  brief.answers = {
    ...brief.answers,
    ...answers,
  };
  brief.markModified('answers');

  // Map answers to schema fields
  const fieldMapping = {
    application_type: 'application_type',
    target_audience: 'target_users',
    platform: 'platform',
    frontend_stack: 'frontend_stack',
    backend_stack: 'backend_stack',
    database: 'database',
    ui_style: 'ui_style'
  };

  Object.keys(answers).forEach(key => {
    if (fieldMapping[key] && brief.schema.paths[fieldMapping[key]]) {
      brief[fieldMapping[key]] = answers[key];
    }
  });

  /* Update status and answer for questions that have been answered */
  if (brief.questions && brief.questions.length > 0) {
    const answeredKeys = Object.keys(answers);
    brief.questions = brief.questions.map((q) => {
      if (answeredKeys.includes(q.key)) {
        return { 
          ...q.toObject(), 
          status: "answered",
          answer: answers[q.key],
          answeredAt: new Date()
        };
      }
      return q;
    });
  }

  await brief.save();

  // Check completion status
  // Fields that MUST be filled by user
  const requiredByUser = [
    'application_type',
    'target_users'
  ];
  
  const isComplete = requiredByUser.every(field => brief[field] !== null && brief[field] !== undefined && brief[field] !== '');
  
  brief.is_complete = isComplete;
  brief.markModified('is_complete');
  await brief.save();

  return brief;
};

export const getIdeaAndBrief = async (userId, ideaId) => {
  const idea = await validateOwnership(Idea, ideaId, userId, "Idea");
  const brief = await Brief.findOne({ idea: ideaId, owner: userId });

  if (!brief) {
    throw new AppError("Brief not found", 404);
  }

  return { idea, brief };
};

export const generateContext = async (userId, ideaId) => {
  // Always fetch a fresh brief to ensure is_complete is up-to-date
  const idea = await validateOwnership(Idea, ideaId, userId, "Idea");
  const brief = await Brief.findOne({ idea: ideaId, owner: userId });

  if (!brief) {
    throw new AppError("Brief not found", 404);
  }

  // Diagnostic logging
  console.log("DEBUG: generateContext completion check");
  console.log("DEBUG: Brief ID:", brief._id);
  console.log("DEBUG: Brief is_complete:", brief.is_complete);
  console.log("DEBUG: Brief required fields check:", {
      application_type: brief.application_type,
      target_users: brief.target_users,
      is_app_type_valid: brief.application_type !== null && brief.application_type !== undefined && brief.application_type !== '',
      is_target_users_valid: brief.target_users !== null && brief.target_users !== undefined && brief.target_users !== ''
  });

  if (!brief.is_complete) {
    throw new AppError("Brief is not complete. Please answer all questions first.", 400);
  }

  let context = await Context.findOne({ idea: ideaId, owner: userId });
  if (!context) {
    context = await Context.create({ owner: userId, idea: ideaId });
  }

  const generationHash = crypto.createHash('sha256').update(`context-${userId}-${ideaId}-${Date.now()}`).digest('hex');
  const tracking = await AIGeneration.create({
    owner: userId,
    idea: ideaId,
    context: context._id,
    status: 'processing',
    generation_hash: generationHash,
  });

  const startTime = Date.now();

  try {
    const client = getAIClient();
    const prompt = buildContextGenerationPrompt(idea, brief);

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const text = response.text;
    const usage = response.usageMetadata;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response");

    const data = JSON.parse(jsonMatch[0]);

    context.project_overview = data.project_overview;
    context.build_plan = data.build_plan;
    context.architecture = data.architecture;
    context.mermaid_diagram = data.mermaid_diagram;
    context.code_standards = data.code_standards;
    context.ui_rules = data.ui_rules;

    await context.save();

    tracking.status = 'completed';
    tracking.generated_context = context._id;
    tracking.generation_time_ms = Date.now() - startTime;
    tracking.prompt_tokens = usage.promptTokenCount;
    tracking.completion_tokens = usage.candidatesTokenCount;
    tracking.total_tokens = usage.totalTokenCount;
    await tracking.save();

    emitToUser(userId, 'ai_generation_completed', {
      ideaId,
      status: 'completed',
      type: 'context',
      contextId: context._id
    });

    return context;
  } catch (error) {
    tracking.status = 'failed';
    tracking.error_message = error.message;
    tracking.generation_time_ms = Date.now() - startTime;
    await tracking.save();

    emitToUser(userId, 'ai_generation_failed', {
      ideaId,
      status: 'failed',
      type: 'context',
      error: error.message
    });
    throw error;
  }
};

export const generateTasks = async (userId, ideaId) => {
  const { idea, brief } = await getIdeaAndBrief(userId, ideaId);
  const context = await Context.findOne({ idea: ideaId, owner: userId });

  if (!context) {
    throw new AppError("Context must be generated before tasks.", 400);
  }

  /* Find or create project */
  let project = await Project.findOne({ owner: userId, project_title: idea.prompt.substring(0, 100) });
  if (!project) {
    project = await Project.create({
      owner: userId,
      project_title: idea.prompt.substring(0, 100),
      project_description: idea.prompt
    });
  }

  const generationHash = crypto.createHash('sha256').update(`tasks-${userId}-${ideaId}-${Date.now()}`).digest('hex');
  const tracking = await AIGeneration.create({
    owner: userId,
    idea: ideaId,
    project: project._id,
    status: 'processing',
    generation_hash: generationHash,
  });

  const startTime = Date.now();

  try {
    const client = getAIClient();
    const prompt = buildTaskGenerationPrompt(idea, brief, context);

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const text = response.text;
    const usage = response.usageMetadata;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response");

    const data = JSON.parse(jsonMatch[0]);

    if (!data.tasks || !Array.isArray(data.tasks)) throw new Error("No tasks generated");

    /* Remove existing tasks */
    await Task.deleteMany({ project: project._id });

    const createdTasks = await Task.insertMany(
      data.tasks.map(t => ({
        project: project._id,
        title: t.title,
        description: t.description,
        priority: t.priority
      }))
    );

    tracking.status = 'completed';
    tracking.generated_project = project._id;
    tracking.generation_time_ms = Date.now() - startTime;
    tracking.prompt_tokens = usage.promptTokenCount;
    tracking.completion_tokens = usage.candidatesTokenCount;
    tracking.total_tokens = usage.totalTokenCount;
    await tracking.save();

    emitToUser(userId, 'ai_generation_completed', {
      ideaId,
      status: 'completed',
      type: 'tasks',
      projectId: project._id
    });

    return { project, tasks: createdTasks };
  } catch (error) {
    tracking.status = 'failed';
    tracking.error_message = error.message;
    tracking.generation_time_ms = Date.now() - startTime;
    await tracking.save();

    emitToUser(userId, 'ai_generation_failed', {
      ideaId,
      status: 'failed',
      type: 'tasks',
      error: error.message
    });
    throw error;
  }
};
