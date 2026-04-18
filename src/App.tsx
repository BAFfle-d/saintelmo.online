import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { QuoteDisplay } from './components/QuoteDisplay';
import { ListenModal } from './components/ListenModal';
import { ActModal } from './components/ActModal';
import { SceneReaderModal } from './components/SceneReaderModal';
import { FullScriptModal } from './components/FullScriptModal';
import { NewsletterModal } from './components/NewsletterModal';
import { StaticModals } from './components/StaticModals';
import { themes, quotes, charities, youtubeTracks, sunoTracks, tiktokTracks, instagramTracks } from './constants';
import { allAct1Scenes, allAct2Scenes } from './data/scenes';
import { Scene, ScriptCard, ScriptLine } from './types';

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentCharityIndex, setCurrentCharityIndex] = useState(0);
  
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentAct, setCurrentAct] = useState<1 | 2>(1);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [scriptCards, setScriptCards] = useState<ScriptCard[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const currentTheme = themes[currentThemeIndex];
  const currentQuote = quotes[currentQuoteIndex];
  const currentCharity = charities[currentCharityIndex];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bauhaus-red', currentTheme.red);
    root.style.setProperty('--bauhaus-blue', currentTheme.blue);
    root.style.setProperty('--bauhaus-yellow', currentTheme.yellow);
    root.style.setProperty('--bauhaus-black', currentTheme.black);
    root.style.setProperty('--bauhaus-white', currentTheme.white);
    root.style.setProperty('--bauhaus-text', currentTheme.text);
    root.style.setProperty('--bauhaus-bg', currentTheme.bg);
  }, [currentTheme]);

  useEffect(() => {
    const hasSignedUp = localStorage.getItem('newsletter_signed_up');
    const lastPopupTime = localStorage.getItem('newsletter_last_popup');
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (!hasSignedUp && (!lastPopupTime || now - parseInt(lastPopupTime) > twentyFourHours)) {
      const timer = setTimeout(() => {
        setIsNewsletterOpen(true);
        localStorage.setItem('newsletter_last_popup', now.toString());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleTheme = () => {
    setCurrentThemeIndex((prev) => (prev + 1) % themes.length);
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    setCurrentCharityIndex((prev) => (prev + 1) % charities.length);
  };

  const processScript = (script: ScriptLine[]): ScriptCard[] => {
    const cards: ScriptCard[] = [];
    if (!script || script.length === 0) return cards;

    let currentCard: ScriptCard | null = null;

    script.forEach((line) => {
      if (line.type === 'stage-direction') {
        if (currentCard && currentCard.type === 'stage-direction') {
          currentCard.lines.push(line.text);
        } else {
          currentCard = { type: 'stage-direction', lines: [line.text] };
          cards.push(currentCard);
        }
      } else {
        if (currentCard && currentCard.type === 'dialogue' && currentCard.speaker === line.speaker) {
          currentCard.lines.push(line.text);
        } else {
          currentCard = { type: 'dialogue', speaker: line.speaker, lines: [line.text] };
          cards.push(currentCard);
        }
      }
    });
    return cards;
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem('sceneHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Map back to full scene objects
        const resolvedHistory = parsed.map((h: { sceneId: string, act: number, index: number }) => {
          const actScenes = h.act === 1 ? allAct1Scenes : allAct2Scenes;
          const scene = actScenes.find(s => s.id === h.sceneId);
          return scene ? { scene, act: h.act as 1 | 2, index: h.index } : null;
        }).filter(Boolean);
        
        if (resolvedHistory.length > 0) {
          setNavigationHistory(resolvedHistory);
          setCurrentHistoryIndex(resolvedHistory.length - 1);
        }
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [navigationHistory, setNavigationHistory] = useState<{ scene: Scene; act: 1 | 2; index: number }[]>([]);

  const openSceneText = (scene: Scene, act: 1 | 2, index: number, isFromHistory = false) => {
    setCurrentScene(scene);
    setCurrentAct(act);
    setCurrentSceneIndex(index);
    setScriptCards(processScript(scene.script || []));
    setCurrentLineIndex(0);
    setActiveModal('sceneText');

    if (!isFromHistory) {
      const newHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
      newHistory.push({ scene, act, index });
      setNavigationHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    }
  };

  const goBackHistory = () => {
    if (currentHistoryIndex > 0) {
      const prev = navigationHistory[currentHistoryIndex - 1];
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      openSceneText(prev.scene, prev.act, prev.index, true);
    }
  };

  const goForwardHistory = () => {
    if (currentHistoryIndex < navigationHistory.length - 1) {
      const next = navigationHistory[currentHistoryIndex + 1];
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      openSceneText(next.scene, next.act, next.index, true);
    }
  };

  const nextScene = () => {
    const scenes = currentAct === 1 ? allAct1Scenes : allAct2Scenes;
    if (currentSceneIndex < scenes.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      openSceneText(scenes[nextIdx], currentAct, nextIdx);
    }
  };

  const prevScene = () => {
    const scenes = currentAct === 1 ? allAct1Scenes : allAct2Scenes;
    if (currentSceneIndex > 0) {
      const prevIdx = currentSceneIndex - 1;
      openSceneText(scenes[prevIdx], currentAct, prevIdx);
    }
  };

  const nextLine = () => {
    if (currentLineIndex < scriptCards.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    }
  };

  const prevLine = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(prev => prev - 1);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setCurrentScene(null);
    setScriptCards([]);
    setCurrentLineIndex(0);
  };

  return (
    <div className="min-h-screen transition-colors duration-500 selection:bg-bauhaus-red selection:text-bauhaus-white" style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      <div className="bauhaus-grid fixed inset-0 pointer-events-none opacity-20" />
      
      {!currentTheme.hideControls && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={toggleTheme}
            className="p-4 border-4 border-bauhaus-black bg-bauhaus-white text-bauhaus-black shadow-[4px_4px_0px_0px_var(--bauhaus-black)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-display font-black uppercase tracking-widest text-xs"
            style={{ 
              borderColor: currentTheme.black,
              backgroundColor: currentTheme.white,
              color: currentTheme.black,
              boxShadow: `4px 4px 0px 0px ${currentTheme.black}`
            }}
          >
            {currentTheme.type === 'light' ? 'DARK' : 'LIGHT'} MODE
          </button>
        </div>
      )}

      <Navigation onOpenModal={setActiveModal} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-48">
        <Hero onOpenModal={setActiveModal} />
        <QuoteDisplay quote={currentQuote} theme={currentTheme} />
      </main>

      {!currentTheme.hideControls && (
        <Footer 
          charity={currentCharity} 
          onOpenModal={setActiveModal} 
          theme={currentTheme} 
        />
      )}

      <ListenModal 
        isOpen={activeModal === 'listen'} 
        onClose={closeModal}
        youtubeTracks={youtubeTracks}
        sunoTracks={sunoTracks}
        tiktokTracks={tiktokTracks}
        instagramTracks={instagramTracks}
      />

      <ActModal 
        isOpen={activeModal === 'act1'} 
        onClose={closeModal} 
        title="ACT 1: THE ISLAND"
        scenes={allAct1Scenes}
        actNumber={1}
        onReadScript={openSceneText}
        youtubeTracks={youtubeTracks}
      />

      <ActModal 
        isOpen={activeModal === 'act2'} 
        onClose={closeModal} 
        title="ACT 2: THE FALLOUT"
        scenes={allAct2Scenes}
        actNumber={2}
        onReadScript={openSceneText}
        youtubeTracks={youtubeTracks}
      />

      <SceneReaderModal 
        isOpen={activeModal === 'sceneText'}
        onClose={closeModal}
        currentScene={currentScene}
        currentAct={currentAct || 1}
        currentSceneIndex={currentSceneIndex}
        scriptCards={scriptCards}
        currentLineIndex={currentLineIndex}
        onNextLine={nextLine}
        onPrevLine={prevLine}
        onNextScene={nextScene}
        onPrevScene={prevScene}
        onOpenFullScript={() => setActiveModal('fullScript')}
        onBackToAct={() => setActiveModal(currentAct === 1 ? 'act1' : 'act2')}
        totalScenes={currentAct === 1 ? allAct1Scenes.length : allAct2Scenes.length}
        youtubeTracks={youtubeTracks}
        canGoBackHistory={currentHistoryIndex > 0}
        canGoForwardHistory={currentHistoryIndex < navigationHistory.length - 1}
        onBackHistory={goBackHistory}
        onForwardHistory={goForwardHistory}
      />

      <FullScriptModal 
        isOpen={activeModal === 'fullScript'}
        onClose={() => setActiveModal('sceneText')}
        currentScene={currentScene}
        onBackToReader={() => setActiveModal('sceneText')}
      />

      <NewsletterModal 
        isOpen={isNewsletterOpen} 
        onClose={() => setIsNewsletterOpen(false)} 
      />

      <StaticModals 
        activeModal={activeModal} 
        onClose={closeModal} 
        onOpenModal={setActiveModal} 
      />
    </div>
  );
}
