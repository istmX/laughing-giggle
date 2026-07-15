const fs = require('fs');

let content = fs.readFileSync('frontend/src/features/project/ui/NewProjectPage.jsx', 'utf8');

// Replace imports
content = content.replace(
  "import { QuestionCard } from './components/QuestionCard'",
  "import { OptionButton } from './components/OptionButton'\nimport { SpecReadyPanel } from './components/SpecReadyPanel'\nimport { AiIcon } from './components/AiIcon'\nimport { AiThinking } from './components/AiThinking'"
);

content = content.replace(
  "import { ArrowLeft, Sparkles, Check, MessageSquare, ArrowRight } from 'lucide-react'",
  "import { ArrowLeft, Sparkles, Check, MessageSquare, ArrowRight, ArrowUp } from 'lucide-react'"
);

// Add chatInput state
content = content.replace(
  "const [ideaId, setIdeaId] = useState(null)",
  "const [ideaId, setIdeaId] = useState(null)\n  const [chatInput, setChatInput] = useState('')\n  const chatInputRef = useRef(null)"
);

// We need to rewrite the main render part.
const renderStart = content.indexOf('{/* Step 0: Initial Prompt or Summary */}');
const renderEnd = content.lastIndexOf('</div>\n        )}');

if (renderStart === -1 || renderEnd === -1) {
    console.log("Could not find render boundaries");
    process.exit(1);
}

const renderReplacement = `{/* Step 0: Initial Prompt or Summary */}
            {step === 0 ? (
              <PromptInput onSubmit={handlePromptSubmit} isLoading={isAnalyzing} initialValue={prompt} />
            ) : step === 999 ? (
              <SpecReadyPanel 
                specContent={refinedSpec} 
                onContinue={() => navigate(\`/projects/\${projectId}/chat\`, { replace: true })}
                artifactCount={4}
              />
            ) : (
              <div className="flex flex-col w-full pb-[140px] pt-4">
                
                {/* Initial Prompt as the first user message */}
                <div className="flex justify-end mb-8 w-full group">
                  <div className="max-w-[85%] text-[15px] leading-relaxed text-ink font-normal bg-surface-soft px-5 py-3.5 rounded-[20px] rounded-tr-[4px] border border-hairline/60">
                    {prompt}
                  </div>
                </div>

                {/* History of Q&A */}
                {history.map((item, idx) => (
                  <div key={idx} className="flex flex-col w-full">
                    {/* AI Question */}
                    <div className="flex gap-4 mb-8 w-full">
                      <AiIcon isAnimating={false} />
                      <div className="flex-1 max-w-[85%]">
                        <div className="text-[15px] leading-relaxed text-ink font-normal whitespace-pre-wrap">
                          {item.question}
                        </div>
                      </div>
                    </div>
                    
                    {/* User Answer */}
                    <div className="flex justify-end mb-8 w-full">
                      <div className="max-w-[85%] text-[15px] leading-relaxed text-ink font-normal bg-surface-soft px-5 py-3.5 rounded-[20px] rounded-tr-[4px] border border-hairline/60 whitespace-pre-wrap">
                        {item.answer}
                      </div>
                    </div>
                    
                    {/* Divider after each turn pair */}
                    <div className="w-full h-[1px] bg-hairline/30 mb-8" />
                  </div>
                ))}

                {/* Current Question & Options */}
                {currentQuestion && (
                  <div className="flex flex-col w-full animate-fade-in">
                    <div className="flex gap-4 mb-6 w-full">
                      <AiIcon isAnimating={isRefining} />
                      <div className="flex-1 max-w-[85%]">
                        {isRefining && !currentQuestion.question ? (
                          <div className="py-1"><AiThinking /></div>
                        ) : (
                          <div className="text-[15px] leading-relaxed text-ink font-normal whitespace-pre-wrap">
                            {currentQuestion.question || currentQuestion.title}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Options (if available and not refining) */}
                    {!isRefining && currentQuestion.options && currentQuestion.options.length > 0 && (
                      <div className="flex gap-4 w-full mb-8">
                        <div className="w-6 shrink-0" /> {/* Spacer for icon */}
                        <div className="flex-1 flex flex-col gap-2 max-w-[85%]">
                          {currentQuestion.options.map((opt, i) => (
                            <OptionButton 
                              key={i}
                              label={opt}
                              onClick={() => handleQuestionSubmit(opt)}
                              isSelected={false}
                            />
                          ))}
                          {/* Built-in Decider button for late questions */}
                          {step >= 10 && (
                            <OptionButton 
                              label="Let Zenix decide all remaining questions"
                              onClick={() => handleQuestionSubmit("Let Zenix decide for all remaining")}
                              isSelected={false}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div ref={endOfFlowRef} className="h-10" />

                {/* Floating Input Bar */}
                <div className="fixed bottom-0 inset-x-0 pb-8 pt-12 bg-gradient-to-t from-canvas via-canvas/90 to-transparent pointer-events-none z-40">
                  <div className="w-full max-w-[760px] mx-auto px-4 sm:px-0 pointer-events-auto">
                    <div className="relative group">
                      <textarea 
                        ref={chatInputRef}
                        value={chatInput}
                        onChange={(e) => {
                          setChatInput(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (chatInput.trim() && !isRefining) {
                              handleQuestionSubmit(chatInput.trim());
                              setChatInput('');
                              e.target.style.height = 'auto';
                            }
                          }
                        }}
                        disabled={isRefining}
                        placeholder={isRefining ? "Thinking..." : "Type your answer or let Zenix decide..."}
                        className="floating-input w-full min-h-[56px] max-h-[160px] rounded-[28px] bg-canvas border border-hairline shadow-[0_4px_24px_rgba(0,0,0,0.04)] py-[16px] pl-6 pr-14 text-[15px] font-normal text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-indigo/30 focus:ring-[4px] focus:ring-brand-indigo/5 resize-none transition-all overflow-y-auto disabled:opacity-50"
                      />
                      <button 
                        disabled={!chatInput.trim() || isRefining}
                        onClick={() => {
                          if (chatInput.trim() && !isRefining) {
                            handleQuestionSubmit(chatInput.trim());
                            setChatInput('');
                            if (chatInputRef.current) chatInputRef.current.style.height = 'auto';
                          }
                        }}
                        className="absolute right-2 top-2 h-10 w-10 rounded-full bg-ink flex items-center justify-center text-canvas hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}`;

content = content.substring(0, renderStart) + renderReplacement + '\n            ' + content.substring(renderEnd);

fs.writeFileSync('frontend/src/features/project/ui/NewProjectPage.jsx', content);
console.log("Rewrite successful");
