import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useContextStore = create(
  persist(
    (set) => ({
      isGenerating: false,
      generatedFiles: [],
      setGenerating: (val) => set({ isGenerating: val }),
      setGeneratedFiles: (files) => set((state) => ({
        generatedFiles: typeof files === 'function' ? files(state.generatedFiles) : files
      })),
      reset: () => set({ isGenerating: false, generatedFiles: [] }),
    }),
    {
      name: 'zenix-context-store',
      partialize: (state) => ({ generatedFiles: state.generatedFiles }),
    }
  )
)
