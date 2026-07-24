**agents.md**
=====================================

**Operational Rules for AI Coding Assistants**
------------------------------------------

### 1. Code Standards Enforcement

*   All component files should not exceed 150 lines of code.
*   Each screen should have a maximum of 250 lines of code.
*   Stores (Redux, MobX, or other state management libraries) should not exceed 200 lines of code.

### 2. Mandatory Memory Tracking Files

*   **frontend/progress.md**: A Markdown file that tracks task status and progress. It should be updated manually by the developer or automatically by the AI coding assistant after completing each task.
*   **memory.md**: A Markdown file that tracks errors and exceptions. It should be updated automatically by the AI coding assistant after encountering any errors or exceptions.

### 3. Code Review and Validation

*   Before submitting code for review, AI coding assistants should run linting checks to ensure code adheres to the project's code standards.
*   AI coding assistants should provide a code review summary, highlighting any changes made, and suggesting improvements or alternative solutions.
*   The review summary should include a diff of the changes, with explanations for each modification.

### 4. Tech Stack Documentation and Best Practices

*   **Live Sync Documentation**: The AI coding assistant should maintain a dedicated section titled "Tech Stack Documentation & Best Practices (Live Sync)" that details breaking changes and official rules for the chosen tech stack.
*   This section should be updated in real-time as the tech stack evolves, ensuring that all developers and the AI coding assistant remain up-to-date on the latest best practices and changes.
*   The documentation should include links to relevant resources, such as official documentation, tutorials, and community forums.

### 5. Collaboration and Communication

*   AI coding assistants should maintain open communication channels with developers, providing regular updates on progress, and soliciting feedback on code quality and project direction.
*   Developers should be encouraged to contribute to the project's documentation and knowledge base, ensuring that the collective expertise of the team is captured and shared.

**Tech Stack Documentation & Best Practices (Live Sync)**
---------------------------------------------------------

### Introduction

The ScribbleBox Visual Portfolio is built using a cutting-edge tech stack, including Next.js, React, TypeScript, and GSAP. This section provides an overview of the tech stack, its components, and best practices for working with each technology.

### Breaking Changes

*   **Next.js**: The latest version of Next.js introduces a new routing system. AI coding assistants should use the new routing system to ensure seamless navigation and correct URL handling.
*   **React**: The latest version of React introduces a new way of handling state management. AI coding assistants should migrate existing state management code to use the new approach.
*   **TypeScript**: The latest version of TypeScript introduces new type checking rules. AI coding assistants should update type definitions and implement the new rules to ensure type safety.

### Best Practices

*   **Component Architecture**: AI coding assistants should follow the component architecture guidelines outlined in the project's documentation. This includes using functional components, container components, and connecting components to the state management system.
*   **State Management**: AI coding assistants should use the Redux or MobX state management libraries to manage application state. This ensures that state changes are tracked and updated correctly.
*   **Animation**: AI coding assistants should use the GSAP animation library to create smooth and seamless animations. This includes using the library's built-in animation features and custom animation functions.

**Code Standards**
------------------

### Linting

*   AI coding assistants should run linting checks on all code before submitting it for review. This ensures that code adheres to the project's code standards and detects potential issues early.

### Code Formatting

*   AI coding assistants should format code according to the project's code formatting guidelines. This includes using consistent indentation, spacing, and naming conventions.

### Commenting

*   AI coding assistants should add comments to code to explain complex logic, functionality, and implementation details. This ensures that code is self-explanatory and easy to understand.

**Memory Tracking and Error Handling**
--------------------------------------

### Error Tracking

*   AI coding assistants should track errors and exceptions using the `memory.md` file. This ensures that errors are captured and reported correctly.

### Memory Leaks

*   AI coding assistants should detect memory leaks using the `memory.md` file. This ensures that memory is released correctly and prevents memory leaks.

**Conclusion**
----------

The ScribbleBox Visual Portfolio's AI coding assistant should follow these operational rules, code standards, and best practices to ensure high-quality code, efficient development, and a seamless user experience. By maintaining a strong focus on code quality, collaboration, and communication, the team can deliver exceptional results and ensure the long-term success of the project.