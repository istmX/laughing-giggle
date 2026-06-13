export default class BaseProvider {
  async analyzeIdea(data) {
    throw new Error("analyzeIdea() not implemented");
  }

  async generateQuestions(data) {
    throw new Error("generateQuestions() not implemented");
  }

  async generateContext(data) {
    throw new Error("generateContext() not implemented");
  }

  async generateTasks(data) {
    throw new Error("generateTasks() not implemented");
  }

  async generateDocumentation(data) {
    throw new Error("generateDocumentation() not implemented");
  }
}
