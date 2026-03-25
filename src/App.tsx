import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, Heart, ExternalLink, Info, Mail, StickyNote, FlaskConical, Play, Youtube, Video, ChevronRight, Share2, Check } from 'lucide-react';
import { Modal, BauhausButton } from './components/BauhausUI';
import { ScriptViewer, ScriptLine } from './components/ScriptViewer';
import { scripts } from './data/scripts';

interface Scene {
  id: string;
  title: string;
  summary: string;
  characters?: string;
  song?: string;
  lyric?: string;
  dialogue?: string;
  lines?: ScriptLine[];
  hasMusic?: boolean;
}

const quotes = [
  { text: `"Don't spiral."\n"I don't spiral. I orbit."`, source: '[Maxie & Geoff - Act 1, Scene 1]' },
  { text: `"You won't quit, Maxie. You'll smoke twice as much and your skin will wrinkle from all the stress"`, source: '[Geoff - Act 1, Scene 6]' },
  { text: `"I didn't disappear. I got kidnapped by the Department of Justice."`, source: '[Lila - Act 1, Scene 3]' },
  { text: `"Something will happen."`, source: '[Geoff - Act 1, Scene 1]' },
  { text: `"I like you."\n"You don't know me."\n"I know enough."\n"That's what the judge said."`, source: '[Geoff & Gus - Act 1, Scene 2]' },
  { text: `"Tell me which one are you, friend — the carpet or the bug?"\n"I'm the bug who ate the carpet then threw up on the rug,\nlost the job, then lost the wife, then found the bottom of the jug."`, source: '[Geoff & Gus - Act 1, Scene 2]' },
  { text: `"I choose to remember the man who saved me, not the monster I suspect you might be."`, source: '[Gus - Act 1, Scene 12]' },
  { text: `"I didn't touch - I didn't go - I didn't - that's not the point. She wasn't real but the moment was. And I know that matters."`, source: '[Gus - Act 2, Scene 9]' },
  { text: `"My situation is that woman."`, source: '[Ronnie - Act 2, Scene 13]' },
  { text: `"I have not given my signature to any document that is documentable to allow the transfer of the case and its context from SDNY. They, per the documented documents, retain jurisdiction. I am granting the contextually appropriate and legally required time to complete their investigation due to new evidence. My office will receive the case formally when they present a contextually and properly documented document, procedurally consistent with any signature a signatory might sign by design.  But until a signed documented with documentable and contextually and legally appropriate signature is presented and reviewed - in context - and with proper documents and or the signatory present to validate that the signature was properly affixed to require documents of transfer, then any future document you or I consider will lack sufficient documentation to affix any signature of our respective offices — or their Director's. Or, would the DOJ or the FBI care to arrest on new charges Mr. Gus here, or are you here to take the case formally?"`, source: '[Tammy - Act 2, Scene 14]' },
  { text: `"Excuse me. The coffee cart doesn't have enough booze on it. I know it's early but — Your outfit makes me want to start drinking something —"`, source: '[Maxie - Act 1, Scene 8]' },
  { text: `I have read every file.\nI have sat with every allegation.\nAnd I am not satisfied.\nIt would fly in the face of justice —\nIt would fly in the face of this office —\nIt would fly in the face of every word\nwritten down, ratified, and signed —\nto look at what these people have carried\nand say: not today.`, source: '[Tammy - Act 2, Scene 14]' },
  { text: `"A Southern social climber — very impressive. Unmarried, I notice. I mean — unpartnered. I mean — a strong, independent woman, high-profile role, no children — I'm assuming you're probably a les —"\n"Mr. President. Inappropriate."\n"I don't have any problem with the LGBT — D — I — X — *(losing count)* — whatever they're calling themselves this year. More letters every time I turn around. I think we should just call them all gay. I mean, they are gay, right? It's better than calling anyone a dy —"\n"I am not afraid to remove you from my office. Is there a reason you are here today, or did you come specifically to insult me?"`, source: '[Ronnie & Tammy - Act 2, Scene 8]' }
];

const themes = [
  {
    name: 'Classic Bauhaus',
    type: 'light',
    bg: '#F1FAEE',
    text: '#1A1A1A',
    red: '#E63946',
    blue: '#1D3557',
    yellow: '#FFB703',
    black: '#1A1A1A',
    white: '#F1FAEE',
    hideControls: false
  },
  {
    name: 'Bauhaus Night',
    type: 'dark',
    bg: '#1A1A1A',
    text: '#F1FAEE',
    red: '#E63946',
    blue: '#457B9D',
    yellow: '#FFB703',
    black: '#000000',
    white: '#FFFFFF',
    hideControls: false
  },
  {
    name: 'Desert Bauhaus',
    type: 'light',
    bg: '#F4E1D2',
    text: '#3D2B1F',
    red: '#D9534F',
    blue: '#5BC0DE',
    yellow: '#F0AD4E',
    black: '#3D2B1F',
    white: '#F4E1D2',
    hideControls: false
  },
  {
    name: 'Midnight Bauhaus',
    type: 'dark',
    bg: '#0B132B',
    text: '#6FFFE9',
    red: '#FF0054',
    blue: '#3A506B',
    yellow: '#FFBD00',
    black: '#050814',
    white: '#6FFFE9',
    hideControls: false
  },
  {
    name: 'Concrete Bauhaus',
    type: 'light',
    bg: '#E0E0E0',
    text: '#212121',
    red: '#C62828',
    blue: '#1565C0',
    yellow: '#F9A825',
    black: '#212121',
    white: '#E0E0E0',
    hideControls: false
  },
  {
    name: 'Onyx Bauhaus',
    type: 'dark',
    bg: '#121212',
    text: '#FFFFFF',
    red: '#FF5252',
    blue: '#448AFF',
    yellow: '#FFD740',
    black: '#000000',
    white: '#FFFFFF',
    hideControls: false
  }
];

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [listenTab, setListenTab] = useState<'youtube' | 'tiktok' | 'suno'>('youtube');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentSunoTrackIndex, setCurrentSunoTrackIndex] = useState(0);
  const [selectedYoutubeIndex, setSelectedYoutubeIndex] = useState(0);
  const [selectedSunoIndex, setSelectedSunoIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [selectedAct1SceneIndex, setSelectedAct1SceneIndex] = useState(0);
  const [selectedAct2SceneIndex, setSelectedAct2SceneIndex] = useState(0);
  const [currentSceneText, setCurrentSceneText] = useState<{title: string, id: string, content: string} | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scriptViewerScene, setScriptViewerScene] = useState<Scene | null>(null);

  const currentTheme = themes[currentThemeIndex];
  const currentQuote = quotes[currentQuoteIndex];

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

  const toggleTheme = () => {
    setCurrentThemeIndex((prev) => (prev + 1) % themes.length);
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  useEffect(() => {
    if (copyStatus === 'copied') {
      const timer = setTimeout(() => setCopyStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus('copied');
  };

  const youtubeTracks = [
    { id: 'ETAlIfgJZKY', act: 'Act 1', scene: 'Intro', title: 'Allegedly' },
    { id: 'ysue5dEzxjI', act: 'Act 1', scene: 'Scene 1', title: 'Sweetheart Deal' },
    { id: '_lhwSoj4ilk', act: 'Act 1', scene: 'Scene 2', title: 'Who Was That (PrePrise 1)' },
    { id: 'BThrcKexGvA', act: 'Act 1', scene: 'Scene 3', title: 'They Were Only Boys' },
    { id: 'Qg-SA255BA4', act: 'Act 1', scene: 'Scene 4', title: 'Reasonable Man' },
    { id: 'RcVaEHwWUyo', act: 'Act 1', scene: 'Scene 5', title: 'Questions & Answers' },
    { id: '8yOpukgj600', act: 'Act 1', scene: 'Scene 6', title: 'Little Secrets' },
    { id: 'zT0aXnfWyIM', act: 'Act 1', scene: 'Scene 7', title: "Welcome to Lil'Elmo" },
    { id: 'wnLDgj_xywo', act: 'Act 1', scene: 'Scene 11', title: 'I Know What Happened on That Island' },
    { id: 'Y35kzg4vQBQ', act: 'Act 1', scene: 'Scene 12', title: 'Who Was That, Part 2' },
    { id: 'qIVQvbwPohQ', act: 'Act 1', scene: 'Scene 14', title: 'The Arrest' },
    { id: 'YBeARM-lNeo', act: 'Act 1', scene: 'Finale', title: 'Standard Procedure' },
    { id: 'YmZRKBgGhaw', act: 'Act 2', scene: 'Intro', title: 'Who Was That? (Part 3)' },
    { id: 'iJNhZs7p_2Y', act: 'Act 2', scene: 'Scene 5', title: 'Witch Hunt & Snowstorm' },
    { id: '08OeZli8uf8', act: 'Act 2', scene: 'Scene 8', title: 'What Did You Do' },
    { id: 'wdesqA9Er9c', act: 'Act 2', scene: 'Scene 9', title: 'Just Like Them, Just Like Me' },
    { id: 'Jk3R5NF6eqs', act: 'Act 2', scene: 'Scene 12', title: 'I Need to Walk' },
    { id: 'j1lVwTeycPQ', act: 'Act 2', scene: 'Scene 13', title: 'Not Unreasonable, Man' },
    { id: 'cSVe6MhYpC0', act: 'Act 2', scene: 'Scene 14', title: 'We the People' },
  ];

  const sunoTracks = [
    // v1.0 & v1.5
    { id: 'uLicnxYQQxWFYrEG', version: 'v1.0', title: 'Billion Here' },
    { id: 'Fkd7yUx7X9qLu78D', version: 'v1.0', title: 'Little Secrets' },
    { id: 'pgI8dQiFwApnxxaX', version: 'v1.0', title: 'Sweetheart Deal' },
    { id: 'SflPfMg5C2ALZyXk', version: 'v1.0', title: 'Welcome to Lil Elmo' },
    { id: 'uK9ghMGSfYgAKXdO', version: 'v1.0', title: 'They Were Only Boys' },
    { id: 'mRGl8dyZP1g64gej', version: 'v1.0', title: 'I Know What Happened' },
    { id: 'fEIPDMV1SUP1xAe5', version: 'v1.0', title: 'Who Was That (Preprise 1)' },
    { id: 'niNLu3u8FpsWeHhF', version: 'v1.0', title: 'Standard Procedure' },
    { id: 'JzuSPXoXHO5kUQfk', version: 'v1.0', title: 'Who Was That (Preprise 2)' },
    { id: 'iM11QEnVI1sDCGWs', version: 'v1.5', title: 'Who Was That (Preprise 2)' },
    { id: 'vTgWsZSVDFQtS0tE', version: 'v1.0', title: 'Questions' },
    { id: 'Nww4HkZosyvmRyf8', version: 'v1.0', title: 'Reasonable Man' },
    { id: 'eVcmOgm8DZsl5kQa', version: 'v1.0', title: 'The Arrest' },
    { id: 'BpXg1siK0Gk5VrXl', version: 'v1.5', title: 'Allegedly' },
    { id: '3GB5eAZiLDeV8oDJ', version: 'v1.0', title: 'Just Like' },
    { id: 'uhzD8Udjzwu89KOV', version: 'v1.0', title: 'Snowstorm & Witch Hunt' },
    { id: 'uhzD8Udjzwu89KOV', version: 'v1.0', title: 'Who Was That 3 (Full)' },
    { id: 'pfaY6ZDN5Ynan4UJ', version: 'v1.0', title: 'If You Only Knew' },
    { id: 'Gu6VYg0IuvWf5Iq3', version: 'v1.0', title: 'What Did You Do' },
    { id: 'TQgI3U311Jj0ffrP', version: 'v1.0', title: 'I Need to Walk' },
    { id: 'dWWqqLz3Ie5aPR7w', version: 'v1.0', title: 'We the People' },
    { id: 'vUXOUgfpehjCXpe6', version: 'v1.0', title: 'A Reasonable Vice (President)' },
    // v2.0
    { id: 'RhZ3OAIIJk2IiK88', version: 'v2.0', title: 'Reasonable Man' },
    { id: 'eTmFxsTFifeHgvdd', version: 'v2.0', title: 'Snowstorm & Witch Hunt' },
  ];

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % youtubeTracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + youtubeTracks.length) % youtubeTracks.length);
  };

  const nextSunoTrack = () => {
    setCurrentSunoTrackIndex((prev) => (prev + 1) % sunoTracks.length);
  };

  const prevSunoTrack = () => {
    setCurrentSunoTrackIndex((prev) => (prev - 1 + sunoTracks.length) % sunoTracks.length);
  };

  const closeModal = () => {
    setActiveModal(null);
    setCurrentSceneText(null);
    setCurrentLineIndex(0);
  };

  const openSceneText = (scene: Scene) => {
    // For now, we'll use the summary as the text content, split by sentences or lines
    // In a real app, this would be the actual script text
    const content = scene.summary;
    setCurrentSceneText({ title: scene.title, id: scene.id, content });
    setCurrentLineIndex(0);
    setActiveModal('sceneText');
  };

  const nextLine = () => {
    if (!currentSceneText) return;
    const lines = currentSceneText.content.split('. ');
    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    }
  };

  const prevLine = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModal === 'sceneText') {
        if (e.key === 'ArrowRight' || e.key === ' ') nextLine();
        if (e.key === 'ArrowLeft') prevLine();
        if (e.key === 'Escape') closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, currentLineIndex, currentSceneText]);

  const scrollToScene = (index: number) => {
    const element = document.getElementById(`scene-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const act1Scenes: Scene[] = [
    { id: "01-00", title: "Allegedly", summary: "TBA", hasMusic: true },
    { id: "01-01", title: "Sweetheart Deal", summary: "TBA", hasMusic: true },
    { id: "01-02", title: "Who Was That - Preprise 1", summary: "TBA", hasMusic: true },
    { id: "01-03", title: "Scene 3", summary: "TBA", hasMusic: false },
    { id: "01-04", title: "They Were Just Boys", summary: "TBA", hasMusic: true },
    { id: "01-05", title: "Reasonable Man", summary: "TBA", hasMusic: true },
    { id: "01-06", title: "A Billion Here, A Favor There", summary: "TBA", hasMusic: true },
    { id: "01-07", title: "Questions & Answers", summary: "TBA", hasMusic: true },
    { id: "01-08", title: "Little Secrets", summary: "TBA", hasMusic: true },
    { id: "01-09a", title: "Scene 9a", summary: "TBA", hasMusic: false },
    { id: "01-09b", title: "Scene 9b", summary: "TBA", hasMusic: false },
    { id: "01-09c", title: "Scene 9c", summary: "TBA", hasMusic: false },
    { id: "01-09d", title: "Scene 9d", summary: "TBA", hasMusic: false },
    { id: "01-10", title: "I Know What Happened On That Island", summary: "TBA", hasMusic: true },
    { id: "01-11", title: "Who Was That? (Preprise 2)", summary: "TBA", hasMusic: true },
    { id: "01-12", title: "Scene 12", summary: "TBA", hasMusic: false },
    { id: "01-13", title: "The Arrest Waltz", summary: "TBA", hasMusic: true },
    { id: "01-Finale", title: "Finale Standard Procedure", summary: "TBA", hasMusic: true },
  ];

  const act2Scenes: Scene[] = [
    { id: "02-01", title: "Who Was That? (Part 3)", summary: "TBA", hasMusic: true },
    { id: "02-02", title: "Scene 2", summary: "TBA", hasMusic: false },
    { id: "02-03", title: "Scene 3", summary: "TBA", hasMusic: false },
    { id: "02-04", title: "Scene 4", summary: "TBA", hasMusic: false },
    { id: "02-05", title: "Witch Hunt & Snowstorm", summary: "TBA", hasMusic: true },
    { id: "02-06", title: "Scene 6", summary: "TBA", hasMusic: false },
    { id: "02-07", title: "Scene 7", summary: "TBA", hasMusic: false },
    { id: "02-08", title: "What Did You Do?", summary: "TBA", hasMusic: true },
    { id: "02-09", title: "Just Like Them, Just Like Me", summary: "TBA", hasMusic: true },
    { id: "02-10", title: "Scene 10", summary: "TBA", hasMusic: false },
    { id: "02-11", title: "Scene 11", summary: "TBA", hasMusic: false },
    { id: "02-12", title: "I Need to Walk", summary: "TBA", hasMusic: true },
    { id: "02-13", title: "Not Unreasonable, Man", summary: "TBA", hasMusic: true },
    { id: "02-14", title: "We the People", summary: "TBA", hasMusic: true },
    { id: "02-15", title: "A Reasonable Vice (President)", summary: "TBA", hasMusic: true },
    { id: "02-16", title: "Park Bench Sobriety", summary: "TBA", hasMusic: true },
    { id: "02-Finale", title: "Finale Standard Procedure", summary: "TBA", hasMusic: true },
  ];

  return (
    <div className="min-h-screen transition-colors duration-500 selection:bg-bauhaus-red selection:text-bauhaus-white" style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      <div className="bauhaus-grid fixed inset-0 pointer-events-none opacity-20" />
      
      {/* Theme Toggle */}
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

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b-4 border-bauhaus-black bg-bauhaus-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-display font-black tracking-tighter uppercase">
            G<span className="text-bauhaus-red">&</span>M
          </div>
          <div className="flex gap-4 md:gap-8">
            {[
              { id: 'characters', label: 'Characters', icon: <Heart size={18} /> },
              { id: 'bts', label: 'Behind the Scenes', icon: <Video size={18} /> },
              { id: 'notes', label: 'Notes', icon: <StickyNote size={18} /> },
              { id: 'about', label: 'About', icon: <Info size={18} /> },
              { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
              { id: 'beta', label: 'Beta', icon: <FlaskConical size={18} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModal(item.id)}
                className="flex items-center gap-2 font-display font-black uppercase text-[10px] tracking-[0.2em] hover:text-bauhaus-red transition-colors"
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-48">
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 w-full"
          >
            <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-6xl md:text-9xl font-display font-black uppercase leading-none tracking-tighter flex justify-between w-full">
                {"GEOFF".split('').map((c, i) => <span key={i}>{c}</span>)}
                <span className="text-bauhaus-red">&</span>
                {"MAXIE".split('').map((c, i) => <span key={i}>{c}</span>)}
              </h1>
              <div className="bg-bauhaus-black text-bauhaus-white py-4 px-6">
                <p className="text-xs md:text-2xl font-display font-bold uppercase tracking-[0.4em] flex justify-between w-full">
                  {"A NEW MUSICAL PARODY ABOUT AN ISLAND".split('').map((c, i) => (
                    <span key={i}>{c === ' ' ? '\u00A0' : c}</span>
                  ))}
                </p>
              </div>
              <p className="text-[10px] md:text-lg font-display font-medium uppercase tracking-[0.5em] italic opacity-60 flex justify-between w-full mt-2">
                {"(AND THE MONSTERS THAT LIVE ON IT)".split('').map((c, i) => (
                  <span key={i}>{c === ' ' ? '\u00A0' : c}</span>
                ))}
              </p>
            </div>

            {/* Banner Image */}
            <div className="w-full h-48 md:h-80 overflow-hidden border-4 border-bauhaus-black relative mb-8">
              <img 
                src="https://drive.google.com/thumbnail?id=1hHeHXi3Y-um24IOq2B5K8-fT9t7OwivD&sz=w1600" 
                alt="Geoff & Maxie Banner" 
                className="w-full h-[200%] object-cover object-top"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/geoffmaxie/1600/600";
                }}
              />
              <div className="absolute inset-0 bg-bauhaus-red/5 mix-blend-multiply" />
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 mb-8 w-full">
            <BauhausButton 
              onClick={() => setActiveModal('listen')}
              variant="yellow"
              className="flex-[1.4] py-8 !text-3xl md:!text-5xl"
            >
              Listen
            </BauhausButton>
            <BauhausButton 
              onClick={() => setActiveModal('act1')}
              variant="red"
              className="flex-1 py-8 !text-3xl md:!text-5xl"
            >
              Act 1
            </BauhausButton>
            <BauhausButton 
              onClick={() => setActiveModal('act2')}
              variant="blue"
              className="flex-1 py-8 !text-3xl md:!text-5xl"
            >
              Act 2
            </BauhausButton>
          </div>

          {/* Quote Callout */}
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full p-10 border-4 border-bauhaus-black bg-bauhaus-white/5 backdrop-blur-md relative overflow-hidden"
            style={{ borderColor: currentTheme.black }}
          >
            <div className="absolute top-0 left-0 w-4 h-full bg-bauhaus-red" style={{ backgroundColor: currentTheme.red }} />
            <div className="absolute top-0 right-0 w-4 h-full bg-bauhaus-blue" style={{ backgroundColor: currentTheme.blue }} />
            <div className="absolute top-0 left-0 w-full h-4 bg-bauhaus-yellow" style={{ backgroundColor: currentTheme.yellow }} />
            
            <p className="text-lg md:text-2xl font-display font-medium italic mb-6 whitespace-pre-line leading-tight">
              {currentQuote.text}
            </p>
            <p className="text-base md:text-xl uppercase tracking-[0.3em] font-black opacity-80">
              {currentQuote.source}
            </p>
          </motion.div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      {!currentTheme.hideControls && (
        <nav 
          className="fixed bottom-0 left-0 right-0 z-40 py-6 px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] border-t-4"
          style={{ 
            backgroundColor: currentTheme.black, 
            color: currentTheme.white,
            borderColor: currentTheme.type === 'dark' ? currentTheme.red : currentTheme.black
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2 w-full md:w-auto">
              {[
                { name: 'TBA Charity 1', msg: 'TBA Message 1', link: '#' },
                { name: 'TBA Charity 2', msg: 'TBA Message 2', link: '#' },
                { name: 'TBA Charity 3', msg: 'TBA Message 3', link: '#' },
              ].map((charity, i) => (
                <a
                  key={i}
                  href={charity.link}
                  className="group flex items-center gap-4 hover:text-bauhaus-yellow transition-colors shrink-0"
                >
                  <div className="p-3 border-2 border-bauhaus-white group-hover:border-bauhaus-yellow transition-all group-hover:rotate-12">
                    <Heart size={20} className="group-hover:fill-bauhaus-yellow" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest">{charity.name}</p>
                    <p className="text-[9px] opacity-40 uppercase tracking-widest">{charity.msg}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
                © 2026 BARRY FLOORE. ALL RIGHTS RESERVED.
              </div>
              <div className="flex gap-6">
                <button onClick={() => setActiveModal('notes')} className="text-[10px] font-black uppercase tracking-widest hover:text-bauhaus-yellow transition-colors">Notes</button>
                <button onClick={() => setActiveModal('about')} className="text-[10px] font-black uppercase tracking-widest hover:text-bauhaus-yellow transition-colors">About</button>
                <button onClick={() => setActiveModal('contact')} className="text-[10px] font-black uppercase tracking-widest hover:text-bauhaus-yellow transition-colors">Contact</button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Act 1 Modal */}
      <Modal isOpen={activeModal === 'act1'} onClose={closeModal} title="ACT 1: THE ISLAND">
        <div className="flex flex-col md:flex-row h-[70vh] -m-8 overflow-hidden">
          {/* Scene List Sidebar - 25% width */}
          <div className="w-full md:w-1/4 border-r-4 border-bauhaus-black bg-bauhaus-white overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-2">
              {act1Scenes.map((scene, i) => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedAct1SceneIndex(i)}
                  className={`w-full text-left p-4 border-2 transition-all flex items-center justify-between group ${
                    selectedAct1SceneIndex === i 
                      ? 'bg-bauhaus-black text-bauhaus-white border-bauhaus-black translate-x-1' 
                      : 'bg-bauhaus-white text-bauhaus-black border-bauhaus-black/10 hover:border-bauhaus-black'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[8px] font-display font-black opacity-40 uppercase tracking-widest">{scene.id}</span>
                    <span className="font-display font-bold uppercase tracking-tight leading-tight text-sm">{scene.title}</span>
                  </div>
                  {scene.hasMusic && (
                    <div className={`w-6 h-6 flex items-center justify-center ${selectedAct1SceneIndex === i ? 'bg-bauhaus-red text-bauhaus-white' : 'bg-bauhaus-black text-bauhaus-white'}`}>
                      <Music size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scene Content Area - 75% width */}
          <div className="w-full md:w-3/4 p-8 md:p-12 overflow-y-auto bg-bauhaus-white/50">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-bauhaus-red font-display font-black text-4xl block mb-2">{act1Scenes[selectedAct1SceneIndex].id}</span>
                  <h3 className="text-4xl font-display font-black uppercase leading-none">{act1Scenes[selectedAct1SceneIndex].title}</h3>
                </div>
                <BauhausButton 
                  onClick={() => openSceneText(act1Scenes[selectedAct1SceneIndex])}
                  variant="black"
                  className="!text-sm py-2"
                >
                  Read Script
                </BauhausButton>
              </div>

              <div className="space-y-6">
                <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="text-xs font-display font-black uppercase tracking-widest mb-4 opacity-40">Scene Summary</h4>
                  <p className="text-lg font-sans leading-relaxed">{act1Scenes[selectedAct1SceneIndex].summary}</p>
                </div>

                {act1Scenes[selectedAct1SceneIndex].hasMusic && (
                  <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-yellow">
                    <h4 className="text-xs font-display font-black uppercase tracking-widest mb-4 opacity-40">Musical Number</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-bauhaus-black text-bauhaus-white flex items-center justify-center">
                        <Music size={24} />
                      </div>
                      <p className="text-xl font-display font-black uppercase">{act1Scenes[selectedAct1SceneIndex].title}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Act 2 Modal */}
      <Modal isOpen={activeModal === 'act2'} onClose={closeModal} title="ACT 2: THE FALLOUT">
        <div className="flex flex-col md:flex-row h-[70vh] -m-8 overflow-hidden">
          {/* Scene List Sidebar - 25% width */}
          <div className="w-full md:w-1/4 border-r-4 border-bauhaus-black bg-bauhaus-white overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-2">
              {act2Scenes.map((scene, i) => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedAct2SceneIndex(i)}
                  className={`w-full text-left p-4 border-2 transition-all flex items-center justify-between group ${
                    selectedAct2SceneIndex === i 
                      ? 'bg-bauhaus-black text-bauhaus-white border-bauhaus-black translate-x-1' 
                      : 'bg-bauhaus-white text-bauhaus-black border-bauhaus-black/10 hover:border-bauhaus-black'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[8px] font-display font-black opacity-40 uppercase tracking-widest">{scene.id}</span>
                    <span className="font-display font-bold uppercase tracking-tight leading-tight text-sm">{scene.title}</span>
                  </div>
                  {scene.hasMusic && (
                    <div className={`w-6 h-6 flex items-center justify-center ${selectedAct2SceneIndex === i ? 'bg-bauhaus-blue text-bauhaus-white' : 'bg-bauhaus-black text-bauhaus-white'}`}>
                      <Music size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scene Content Area - 75% width */}
          <div className="w-full md:w-3/4 p-8 md:p-12 overflow-y-auto bg-bauhaus-white/50">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-bauhaus-blue font-display font-black text-4xl block mb-2">{act2Scenes[selectedAct2SceneIndex].id}</span>
                  <h3 className="text-4xl font-display font-black uppercase leading-none">{act2Scenes[selectedAct2SceneIndex].title}</h3>
                </div>
                <BauhausButton 
                  onClick={() => openSceneText(act2Scenes[selectedAct2SceneIndex])}
                  variant="black"
                  className="!text-sm py-2"
                >
                  Read Script
                </BauhausButton>
              </div>

              <div className="space-y-6">
                <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="text-xs font-display font-black uppercase tracking-widest mb-4 opacity-40">Scene Summary</h4>
                  <p className="text-lg font-sans leading-relaxed">{act2Scenes[selectedAct2SceneIndex].summary}</p>
                </div>

                {act2Scenes[selectedAct2SceneIndex].hasMusic && (
                  <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-yellow">
                    <h4 className="text-xs font-display font-black uppercase tracking-widest mb-4 opacity-40">Musical Number</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-bauhaus-black text-bauhaus-white flex items-center justify-center">
                        <Music size={24} />
                      </div>
                      <p className="text-xl font-display font-black uppercase">{act2Scenes[selectedAct2SceneIndex].title}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'sceneText'} onClose={closeModal} title="SCENE READER">
        {currentSceneText && (
          <div 
            className="h-[50vh] flex flex-col justify-center items-center p-8 bg-bauhaus-white cursor-pointer select-none relative border-4 border-bauhaus-black"
            onClick={nextLine}
          >
            <div className="absolute top-6 left-6 flex items-center gap-4">
              <span className={`text-3xl font-display font-black ${currentSceneText.id.startsWith('01') ? 'text-bauhaus-red' : 'text-bauhaus-blue'}`}>
                {currentSceneText.id}
              </span>
              <span className="uppercase font-black tracking-[0.3em] text-xs opacity-40">{currentSceneText.title}</span>
            </div>

            <motion.div
              key={currentLineIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-5xl font-display font-black text-center max-w-3xl uppercase leading-tight text-bauhaus-black"
            >
              {currentSceneText.content.split('. ')[currentLineIndex]}
            </motion.div>

            <div className="absolute bottom-6 right-6 flex items-center gap-6">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">
                LINE {currentLineIndex + 1} / {currentSceneText.content.split('. ').length}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevLine(); }}
                  className="w-12 h-12 border-4 border-bauhaus-black flex items-center justify-center hover:bg-bauhaus-black hover:text-bauhaus-white transition-all disabled:opacity-10"
                  disabled={currentLineIndex === 0}
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextLine(); }}
                  className="w-12 h-12 border-4 border-bauhaus-black flex items-center justify-center hover:bg-bauhaus-black hover:text-bauhaus-white transition-all disabled:opacity-10"
                  disabled={currentLineIndex === currentSceneText.content.split('. ').length - 1}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={activeModal === 'listen'} onClose={closeModal} title="LISTEN NOW">
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 border-b-4 border-bauhaus-black pb-4">
            {(['youtube', 'suno'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setListenTab(tab)}
                className={`px-8 py-3 font-display font-black uppercase tracking-widest text-sm border-4 border-bauhaus-black transition-all ${
                  listenTab === tab ? 'bg-bauhaus-black text-bauhaus-white' : 'bg-bauhaus-white text-bauhaus-black hover:bg-bauhaus-yellow'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {listenTab === 'youtube' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {youtubeTracks.map((track, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedYoutubeIndex(i)}
                  className={`p-6 border-4 border-bauhaus-black text-left transition-all ${
                    selectedYoutubeIndex === i ? 'bg-bauhaus-yellow shadow-none translate-x-1 translate-y-1' : 'bg-bauhaus-white shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:bg-bauhaus-red hover:text-bauhaus-white'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-1">{track.act} - {track.scene}</p>
                  <p className="text-xl font-display font-black uppercase">{track.title}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sunoTracks.map((track, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSunoIndex(i)}
                  className={`p-6 border-4 border-bauhaus-black text-left transition-all ${
                    selectedSunoIndex === i ? 'bg-bauhaus-yellow shadow-none translate-x-1 translate-y-1' : 'bg-bauhaus-white shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:bg-bauhaus-blue hover:text-bauhaus-white'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-1">{track.version}</p>
                  <p className="text-xl font-display font-black uppercase">{track.title}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'characters'} onClose={closeModal} title="CHARACTER BIOGRAPHIES">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-bauhaus-black">
          <div className="space-y-6">
            <div className="aspect-square bg-bauhaus-red border-4 border-bauhaus-black relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-bauhaus-black rounded-full" />
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-bauhaus-yellow" />
              </div>
              <img 
                src="https://picsum.photos/seed/geoff/600/600" 
                alt="Geoff" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-4xl font-display font-black uppercase tracking-tighter">Geoffrey "Geoff" Goldstein</h3>
            <p className="font-sans text-lg leading-relaxed">
              A charismatic billionaire con artist who operates a private island playground for the wealthy. 
              Charming, Continental, and convicted, he receives a sweetheart deal that keeps him under house arrest while his empire thrives.
            </p>
          </div>
          <div className="space-y-6">
            <div className="aspect-square bg-bauhaus-blue border-4 border-bauhaus-black relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[100px] border-l-transparent border-r-[100px] border-r-transparent border-b-[173px] border-b-bauhaus-black" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-bauhaus-red" />
              </div>
              <img 
                src="https://picsum.photos/seed/maxie/600/600" 
                alt="Maxie" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-4xl font-display font-black uppercase tracking-tighter">Isabella "Maxie" Laurent</h3>
            <p className="font-sans text-lg leading-relaxed">
              Geoff's brilliant partner who manages the logistics of their elite network. 
              She is the architect of their secrecy, ensuring that favors are currency and silence is survival in their world of privilege.
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'bts'} onClose={closeModal} title="BEHIND THE SCENES">
        <div className="space-y-12 text-bauhaus-black">
          <section>
            <h3 className="text-2xl font-display font-black uppercase mb-6 bg-bauhaus-yellow inline-block px-2">Concept Art</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-video bg-bauhaus-black border-2 border-bauhaus-black relative overflow-hidden group">
                  <img 
                    src={`https://picsum.photos/seed/bts-${i}/400/300`} 
                    alt={`Concept ${i}`} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-display font-black uppercase mb-6 bg-bauhaus-red text-bauhaus-white inline-block px-2">Script Excerpts</h3>
            <div className="p-8 border-4 border-bauhaus-black bg-bauhaus-white font-mono text-sm space-y-4">
              <p className="font-bold">GEOFF</p>
              <p className="pl-8 italic">Something will happen. It always does. The universe abhors a vacuum, and it especially abhors a billionaire with nothing to do.</p>
              <p className="font-bold">MAXIE</p>
              <p className="pl-8">The universe doesn't care about your vacuum, Geoff. The Department of Justice does.</p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-display font-black uppercase mb-6 bg-bauhaus-blue text-bauhaus-white inline-block px-2">Composer Notes</h3>
            <div className="p-8 border-4 border-bauhaus-black bg-bauhaus-yellow/20">
              <p className="font-sans leading-relaxed italic">
                "The score should feel like a collision between 1920s cabaret and modern electronic tension. 
                Use sharp, geometric rhythms to mirror the Bauhaus aesthetic. The 'Island Theme' needs to sound 
                both inviting and deeply unsettling—a siren song with a jagged edge."
              </p>
            </div>
          </section>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'notes'} onClose={closeModal} title="A NOTE ON GEOFF & MAXIE">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar text-bauhaus-black">
          <div className="bg-bauhaus-red text-bauhaus-white p-4 font-display uppercase tracking-widest text-sm mb-6">
            On Parody, Intent, and Responsibility
          </div>
          
          <div className="space-y-4 font-sans text-base leading-relaxed">
            <p>
              This musical is a parody. It is a parody of the spectacle, the political theater, the media circus, 
              the justice system failures, and the cultural obsession that have defined how powerful people evade accountability.
            </p>
            <p>
              The musical is not about the victims. It does not speak for them, to them, or on their behalf. 
              We make no claim to represent their experiences, their pain, or their truth. A single victim is portrayed 
              prominently because to extract that aspect of the atrocity would be disingenuous and castrate the purpose of parody. 
              However, the views in this show do not represent the point of view of the individuals who experienced 
              similar traumas at the hands of real monsters.
            </p>
            <p>
              The musical is also not an excuse for alleged perpetrators. It is not a platform for rehabilitation or 
              sympathy toward the powerful. Our purpose is not to seek understanding or acceptance of their crimes, 
              nor justify their behavior until it becomes socially acceptable. GEOFF & MAXIE was created explicitly 
              to combat the normalization of Lil'Elmo and similar places in the real world.
            </p>
            <p>
              The purpose is to satirize the monsters in all of us that allowed such things to take root, to grow and thrive, 
              and to be covered up once exposed. No monsters lived on Lil'Elmo, they only visited and came home. 
              Whither then their monstrosity?
            </p>
            <p>
              GEOFF & MAXIE is a mirror held up to everyone who watched, everyone who politicked, everyone who hedged, 
              everyone who knew, and everyone who looked away. It is about what we as a society have tolerated, 
              celebrated, and protected when money and influence are involved.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-bauhaus-black/20 text-sm italic opacity-80">
            The atrocities that occurred are real. The victims are real. The failure to deliver full accountability is real. 
            The parody is of the people and systems that made sure it stayed that way.
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'about'} onClose={closeModal} title="ABOUT THE MUSICAL">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar text-bauhaus-black">
          <div className="bg-bauhaus-blue text-bauhaus-white p-4 font-display uppercase tracking-widest text-sm mb-6">
            Geoff & Maxie: A New Musical Parody
          </div>
          
          <div className="space-y-4 font-sans text-base leading-relaxed">
            <p>
              What happens when a charismatic billionaire con artist walks free while justice watches from the sidelines? 
              <strong> Geoff & Maxie</strong> plunges you into a glittering world of power, privilege, and the secrets that bind them together.
            </p>
            <p>
              Geoffrey Aaron "Geoff" Goldstein—charming, Continental, convicted—receives a sweetheart deal that keeps him under house arrest while his empire thrives. 
              Alongside his brilliant partner Isabella Maximillian "Maxie" Laurent, he operates a private island playground for the wealthy and powerful, 
              where favors are currency and silence is survival. When Geoff offers a second chance to Gus, a homeless man with nothing to lose, 
              he inadvertently invites a conscience into a world that abandoned morality long ago.
            </p>
            <p>
              As the island's secrets begin to surface, a web of complicity emerges: a buffoonish President who operates through plausible deniability, 
              a principled Solicitor General who refuses to be manipulated, survivors demanding justice, and institutional forces working overtime to contain the scandal. 
              When federal charges finally land, Geoff mysteriously vanishes from custody while Maxie enjoys comfortable confinement—exposing a justice system with two very different sets of rules.
            </p>
            
            <div className="border-l-8 border-bauhaus-red pl-6 py-4 my-8 italic text-xl font-display">
              "The question isn't what happened. It's whether anyone with power will be held accountable."
            </div>
            <div className="pt-8 border-t-4 border-bauhaus-black/10">
              <BauhausButton 
                onClick={() => setActiveModal('bts')}
                variant="yellow"
                className="w-full py-6 !text-2xl"
              >
                Behind the Scenes
              </BauhausButton>
            </div>
            
            <p>
              Through darkly comic musical numbers, sharp dialogue, and a cast of characters ranging from predators to survivors, 
              <strong> Geoff & Maxie</strong> explores how "standard procedure" protects the powerful while punishing the vulnerable, 
              how documentation becomes weaponized, and whether redemption is possible for those who've chosen silence over truth.
            </p>
            <p>
              Will Gus's testimony matter when the news cycle moves on? Can Tammy build a case when evidence keeps disappearing? 
              What happens when a canary yellow phone holds secrets the world isn't ready to hear?
            </p>
            
            <p className="font-display uppercase tracking-widest text-bauhaus-red font-bold pt-4">
              Some monsters live on islands. Others walk among us every day.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t-4 border-bauhaus-black">
            <h3 className="font-display uppercase tracking-[0.2em] text-lg mb-4 bg-bauhaus-yellow inline-block px-2">A Note on AI Collaboration</h3>
            <div className="space-y-4 text-sm opacity-80">
              <p>
                This musical proudly leverages AI technology to amplify a voice that demands to be heard. 
                While the storyline, lyrics, and dialogue are entirely original creations by <strong>B. Floore</strong>, 
                the editing, workshopping, and musical generation were developed in collaboration with AI partners including 
                Claude.ai (Anthropic), ChatGPT (OpenAI), Gemini (Google), Notion AI, Suno AI, and Veed.io.
              </p>
              <p>
                The result is a complete theatrical package—a parody designed to entertain, provoke, and one day grace the stage. 
                If you're interested in collaborating on staging and production, or if you're a musician who wants to help refine 
                the score toward a full theatrical production, please use the contact form on the home page.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-xs italic opacity-60 border-l-2 border-bauhaus-black pl-4">
            Because some stories are too important to tell quietly. And our silence will be held against us for far longer than our words.
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'beta'} onClose={closeModal} title="BETA ACCESS INFORMATION">
        <div className="space-y-8 py-4 text-bauhaus-black">
          <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-display font-black text-2xl mb-2 uppercase tracking-tighter">DRAFT 0.1</h3>
            <p className="font-sans text-lg leading-relaxed">
              This is a draft version. As you read through each scene, use the 
              <button onClick={() => setActiveModal('contact')} className="mx-1 text-bauhaus-blue font-bold underline hover:text-bauhaus-red transition-colors">Contact</button> 
              tab to share notes on dialogue, songs, structure, or to get involved. Thank you for your feedback!
            </p>
          </div>

          <div className="pt-8 border-t-2 border-bauhaus-black/10">
            <h4 className="font-display uppercase tracking-widest text-xs font-bold mb-4 opacity-40">Copyright Summary</h4>
            <p className="text-sm font-sans opacity-70 leading-relaxed">
              This production is a work of parody and satire. Any resemblance to real persons, living or dead, 
              or actual events is purely coincidental and intended for humorous effect as part of the satirical nature of the work. 
              No allegations of fact are intended.
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'contact'} onClose={closeModal} title="CONTACT & COLLABORATION">
        <div className="py-8 text-bauhaus-black">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-bauhaus-red flex items-center justify-center text-bauhaus-white shrink-0">
              <Mail size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-display font-black uppercase">Get in Touch</h3>
              <p className="opacity-60 text-sm">For production, collaboration, or feedback.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="font-sans leading-relaxed">
              We are actively looking for musical collaborators, production partners, and feedback on the current draft. 
              If you're interested in the project, please reach out.
            </p>
            
            <div className="bg-bauhaus-black text-bauhaus-white p-6 border-l-8 border-bauhaus-yellow">
              <div className="text-xs uppercase tracking-widest opacity-60 mb-2">Primary Contact</div>
              <div className="text-xl font-display font-bold">Barry.Floore@gmail.com</div>
            </div>
            
            <div className="pt-6 border-t border-bauhaus-black/10">
              <p className="text-xs uppercase tracking-widest opacity-40">
                Note: This is a work in progress. All inquiries regarding staging and rights are welcome.
              </p>
            </div>
          </div>
        </div>
      </Modal>
          {/* Script Viewer Modal - password protected */}
                <ScriptViewer
                        isOpen={scriptViewerScene !== null}
                                onClose={() => setScriptViewerScene(null)}
                                        sceneId={scriptViewerScene?.id ?? ''}
                                                sceneTitle={scriptViewerScene?.title ?? ''}
                                                        lines={scriptViewerScene ? scripts[scriptViewerScene.id] : undefined}
                                                              />
    </div>
  );
}
