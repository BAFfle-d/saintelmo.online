import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, Heart, ExternalLink, Info, Mail, StickyNote, FlaskConical, Play, Youtube, Video, ChevronRight, Share2, Check } from 'lucide-react';
import { Modal, BauhausButton, BauhausInput } from './components/BauhausUI';

interface ScriptLine {
  type: 'dialogue' | 'stage-direction' | 'musical-number';
  speaker?: string;
  text: string;
}

interface Scene {
  id: string;
  title: string;h
  summary: string;
  characters?: string;
  song?: string;
  lyric?: string;
  script?: ScriptLine[];
  hasMusic?: boolean;
  youtubeId?: string;
}

const quotes = [
  { text: `The people being ignored by the opposition in their — Socialist — Autocratic — Centralized federal — States' rights rhetorical — Mess.`, source: `[CAM & ASH - Act 1, Scene 7]` },
  { text: `He's not like us the way I thought.`, source: `[Geoff - Act 1, scene 8]` },
  { text: `I wasn’t protecting you, sir. I was protecting people from you.`, source: `[Officer Watson - Act 1, Scene 9]` },
  { text: `First of all, she’s very talented. Very talented. Second — we need more women in positions like this. We really do. I looked around the room the other day and I said, “Where are the women  lawyers?” And somebody said, “Well, sir, we have Tammy.” And I said, “Good. Let’s get Tammy up here.” But in all seriousness, she’s earned it.`, source: `[Ronnie - Act 1, Scene 12]` },
  { text: `I don't spiral. I orbit.`, source: `[Geoff - Act 1, Scene 12]` },
  { text: `You won't quit, Maxie. You'll smoke twice as much and your skin will wrinkle from all the stress.`, source: `[Geoff - Act 1, Scene 6]` },
  { text: `I didn't disappear. I got kidnapped by the Department of Justice.`, source: `[Lila - Act 1, Scene 3]` },
  { text: `Something will happen.`, source: `[Geoff - Act 1, Scene 12]` },
  { text: `"I like you." "You don't know me." "I know enough." "That's what the judge said."`, source: `[Geoff & Guess - Act 1, Scene 2]` },
  { text: `"Tell me which one are you, friend — the carpet or the bug?" "I'm the bug who ate the carpet then threw up on the rug, lost the job, then lost the wife, then found the bottom of the jug."`, source: `[Geoff & Guess - Act 1, Scene 2]` },
  { text: `I choose to remember the man who saved me, not the monster I suspect you might be.`, source: `[Geoff & Guess - Act 1, Scene 1]` },
  { text: `I didn't touch - I didn't go - I didn't - that's not the point. She wasn't real but the moment was. And I know that matters.`, source: `[Gus - Act 2, Scene 9]` },
  { text: `My situation is that woman.`, source: `[Ronnie - Act 2, Scene 13]` },
  { text: `I have not given my signature to any document that is documentable to allow the transfer of the case and its context from SDNY. They, per the documented documents, retain jurisdiction. I am granting the contextually appropriate and legally required time to complete their investigation due to new evidence. My office will receive the case formally when they present a contextually and properly documented document, procedurally consistent with any signature a signatory might sign by design. But until a signed documented with documentable and contextually and legally appropriate signature is presented and reviewed - in context - and with proper documents and or the signatory present to validate that the signature was properly affixed to require documents of transfer, then any future document you or I consider will lack sufficient documentation to affix any signature of our respective offices — or their Director's. Or, would the DOJ or the FBI care to arrest on new charges Mr. Gus here, or are you here to take the case formally?`, source: `[Tammy - Act 2, Scene 14]` },
  { text: `Excuse me. The coffee cart doesn't have enough booze on it. I know it's early but — Your outfit makes me want to start drinking something.`, source: `[Maxie - Act 1, Scene 8]` },
  { text: `I have read every file. I have sat with every allegation. And I am not satisfied. It would fly in the face of justice — It would fly in the face of this office — It would fly in the face of every word written down, ratified, and signed — to look at what these people have carried and say: not today.`, source: `[Tammy - Act 2, Scene 14]` },
  { text: `A Southern social climber — very impressive. Unmarried, I notice. I mean — unpartnered. I mean — a strong, independent woman, high-profile role, no children — I'm assuming you're probably a les — I don't have any problem with the LGBT — D — I — X —  — whatever they're calling themselves this year. More letters every time I turn around. I think we should just call them all gay. I mean, they are gay, right? It's better than calling anyone a dy —`, source: `[Ronnie - Act 2, Scene 8]` }
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

interface ScriptCard {
  type: 'dialogue' | 'stage-direction';
  speaker?: string;
  lines: string[];
}

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentCharityIndex, setCurrentCharityIndex] = useState(0);
  const [listenTab, setListenTab] = useState<'playlist' | 'links'>('playlist');
  const [selectedYoutubeVersion, setSelectedYoutubeVersion] = useState('1.5');
  const [selectedSunoId, setSelectedSunoId] = useState('');
  const [selectedTiktokId, setSelectedTiktokId] = useState('');
  const [selectedYoutubeLinkId, setSelectedYoutubeLinkId] = useState('');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentSunoTrackIndex, setCurrentSunoTrackIndex] = useState(0);
  const [selectedYoutubeIndex, setSelectedYoutubeIndex] = useState(0);
  const [selectedSunoIndex, setSelectedSunoIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [selectedAct1SceneIndex, setSelectedAct1SceneIndex] = useState(0);
  const [selectedAct2SceneIndex, setSelectedAct2SceneIndex] = useState(0);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentAct, setCurrentAct] = useState<1 | 2>(1);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [scriptCards, setScriptCards] = useState<ScriptCard[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [email, setEmail] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const charities = [
    { name: "RAINN", url: "https://donate.rainn.org", msg: "Rape, Abuse & Incest National Network" },
    { name: "Polaris Project", url: "https://polarisproject.org/donate", msg: "Working to end human trafficking" },
    { name: "Intl. Justice Mission", url: "https://www.ijm.org/give", msg: "Protecting people from violence" },
    { name: "PACT", url: "https://www.wearepact.org/donate", msg: "Protecting children from exploitation" },
    { name: "Joyful Heart", url: "https://www.joyfulheartfoundation.org/donate", msg: "Healing and justice for survivors" }
  ];

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

  const toggleTheme = () => {
    setCurrentThemeIndex((prev) => (prev + 1) % themes.length);
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    setCurrentCharityIndex((prev) => (prev + 1) % charities.length);
  };

  useEffect(() => {
    if (copyStatus === 'copied') {
      const timer = setTimeout(() => setCopyStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus('copied');
  };

  const youtubeTracks = [
  { id: 'ETAIIfgJZKY', act: 'Act 1', scene: 'Intro', title: 'Allegedly', versions: { '1.0': 'ETAIIfgJZKY' } },
  { id: 'ysue5dEzxjl', act: 'Act 1', scene: 'Scene 1', title: 'Sweetheart Deal', versions: { '1.0': 'ysue5dEzxjl' } },
  { id: '_lhwSoj4Ilk', act: 'Act 1', scene: 'Scene 2', title: 'Who Was That (PrePrise 1)', versions: { '1.0': '_lhwSoj4Ilk' } },
  { id: 'BThrcKexGvA', act: 'Act 1', scene: 'Scene 3', title: 'They Were Only Boys', versions: { '1.0': 'BThrcKexGvA' } },
  { id: 'Qg-SA255BA4', act: 'Act 1', scene: 'Scene 4', title: 'Reasonable Man', versions: { '1.0': 'Qg-SA255BA4' } },
  { id: 'RcVaEHwWUyo', act: 'Act 1', scene: 'Scene 5', title: 'Questions & Answers', versions: { '1.0': 'RcVaEHwWUyo' } },
  { id: '8yOpukgj600', act: 'Act 1', scene: 'Scene 6', title: 'Little Secrets', versions: { '1.0': '8yOpukgj600' } },
  { id: 'zT0aXnfWyIM', act: 'Act 1', scene: 'Scene 7', title: "Welcome to Lil'Elmo", versions: { '1.0': 'zT0aXnfWyIM' } },
  { id: 'wnLDgj_xywo', act: 'Act 1', scene: 'Scene 11', title: 'I Know What Happened on That Island', versions: { '1.0': 'wnLDgj_xywo' } },
  { id: 'Y35kzg4vQBQ', act: 'Act 1', scene: 'Scene 12', title: 'Who Was That, Part 2', versions: { '1.0': 'Y35kzg4vQBQ' } },
  { id: 'wg2brKqY6x0', act: 'Act 1', scene: 'Scene 14', title: 'The Arrest', versions: { '1.0': 'wg2brKqY6x0' } },
  { id: 'YBeARM-lNeo', act: 'Act 1', scene: 'Finale', title: 'Standard Procedure', versions: { '1.0': 'YBeARM-lNeo' } },
  { id: 'YmZRKBgGhaw', act: 'Act 2', scene: 'Intro', title: 'Who Was That? (Part 3)', versions: { '1.0': 'YmZRKBgGhaw' } },
  { id: 'bdb6xQDCGZU', act: 'Act 2', scene: 'Scene 4', title: 'In Transit', versions: { '1.0': 'bdb6xQDCGZU', '2.0': '4VD1OXasPsI' } },
  { id: 'iJNhZs7p_2Y', act: 'Act 2', scene: 'Scene 5', title: 'Witch Hunt & Snowstorm', versions: { '1.0': 'iJNhZs7p_2Y', '2.0': 'S_ai5KR5Gjg', '2.1': '1O7g--H0PCg' } },
  { id: '08OeZlI8uf8', act: 'Act 2', scene: 'Scene 8', title: 'What Did You Do', versions: { '1.0': '08OeZlI8uf8' } },
  { id: 'wdesqA9Er9c', act: 'Act 2', scene: 'Scene 9', title: 'Just Like Them, Just Like Me', versions: { '1.0': 'wdesqA9Er9c' } },
  { id: 'QqsgRN2zKkM', act: 'Act 2', scene: 'Scene 11', title: 'Good for Us', versions: { '2.0': 'QqsgRN2zKkM' } },
  { id: 'Jk3R5NF6eqs', act: 'Act 2', scene: 'Scene 12', title: 'I Need to Walk', versions: { '1.0': 'Jk3R5NF6eqs' } },
  { id: 'j1lVwTeycPQ', act: 'Act 2', scene: 'Scene 13', title: 'Not Unreasonable, Man', versions: { '1.0': 'j1lVwTeycPQ' } },
  { id: 'cSVe6MhYpC0', act: 'Act 2', scene: 'Scene 14', title: 'We the People', versions: { '1.0': 'cSVe6MhYpC0' } },
  { id: 'GuEb_Erov3s', act: 'Act 2', scene: 'Scene 15', title: 'A Reasonable Version of Events', versions: { '2.0': 'GuEb_Erov3s' } },
  { id: 'dv-ZFkmz_Bk', act: 'Act 2', scene: 'Finale', title: 'If You Only Knew', versions: { '1.0': 'dv-ZFkmz_Bk', '2.0': '8NaFydqCrDA' } },
];

  const sunoTracks = [
  { id: 'BpXg1siK0Gk5VrXl', version: 'v1.0', act: 'Act 1', scene: 'Intro', title: 'Allegedly' },
  { id: 'pgI8dQiFwApnxxaX', version: 'v1.0', act: 'Act 1', scene: 'Scene 1', title: 'Sweetheart Deal' },
  { id: 'fEIPDMV1SUP1xAe5', version: 'v1.0', act: 'Act 1', scene: 'Scene 2', title: 'Who Was That (Preprise 1)' },
  { id: 'uK9ghMGSfYgAKXdO', version: 'v1.0', act: 'Act 1', scene: 'Scene 3', title: 'They Were Only Boys' },
  { id: 'ACLv76ZONDEEa3dR', version: 'v2.0', act: 'Act 1', scene: 'Scene 3', title: 'They Were Only Boys' },
  { id: 'Nww4HkZosyvmRyf8', version: 'v1.0', act: 'Act 1', scene: 'Scene 4', title: 'Reasonable Man' },
  { id: 'RhZ3OAIIJk2IiK88', version: 'v1.5', act: 'Act 1', scene: 'Scene 4', title: 'Reasonable Man' },
  { id: 'vTgWsZSVDFQtS0tE', version: 'v1.0', act: 'Act 1', scene: 'Scene 5', title: 'Questions & Answers' },
  { id: 'uLicnxYQQxWFYrEG', version: 'v1.0', act: 'Act 1', scene: 'Scene 6', title: 'Billion Here' },
  { id: 's0VOzra9aQ3DCddb', version: 'v1.5', act: 'Act 1', scene: 'Scene 6', title: 'Billion Here' },
  { id: 'TxyT0kjG6KpHyODM', version: 'v2.0', act: 'Act 1', scene: 'Scene 6', title: 'Billion Here' },
  { id: 'Fkd7yUx7X9qLu78D', version: 'v1.0', act: 'Act 1', scene: 'Scene 6', title: 'Little Secrets' },
  { id: 'SflPfMg5C2ALZyXk', version: 'v1.0', act: 'Act 1', scene: 'Scene 7', title: "Welcome to Lil'Elmo" },
  { id: 'mRGl8dyZP1g64gej', version: 'v1.0', act: 'Act 1', scene: 'Scene 11', title: 'I Know What Happened' },
  { id: 'Y35kzg4vQBQ', version: 'v1.0', act: 'Act 1', scene: 'Scene 12', title: 'Who Was That, Part 2' },
  { id: 'eVcmOgm8DZsl5kQa', version: 'v1.0', act: 'Act 1', scene: 'Scene 14', title: 'The Arrest' },
  { id: 'niNLu3u8FpsWeHhF', version: 'v1.0', act: 'Act 1', scene: 'Finale', title: 'Standard Procedure' },
  { id: 'AqNQgKhLvMTK6gkL', version: 'v1.0', act: 'Act 2', scene: 'Intro', title: 'Who Was That? (Part 3)' },
  { id: 'uhzD8Udjzwu89KOV', version: 'v1.0', act: 'Act 2', scene: 'Scene 5', title: 'Snowstorm & Witch Hunt' },
  { id: 'eTmFxsTFifeHgvdd', version: 'v2.0', act: 'Act 2', scene: 'Scene 5', title: 'Snowstorm & Witch Hunt' },
  { id: 'Gu6VYg0IuvWf5lq3', version: 'v1.0', act: 'Act 2', scene: 'Scene 8', title: 'What Did You Do' },
  { id: '3GB5eAZiLDeV8oDJ', version: 'v1.0', act: 'Act 2', scene: 'Scene 9', title: 'Just Like Them, Just Like Me' },
  { id: 'TQgI3U311Jj0ffrP', version: 'v1.0', act: 'Act 2', scene: 'Scene 12', title: 'I Need to Walk' },
  { id: 'dWWqqLz3le5aPR7w', version: 'v1.0', act: 'Act 2', scene: 'Scene 14', title: 'We the People' },
  { id: 'vUXOUgfpehjCXpe6', version: 'v2.0', act: 'Act 2', scene: 'Scene 15', title: 'A Reasonable Version of Events' },
  { id: 'pfaY6ZDN5Ynan4UJ', version: 'v1.0', act: 'Act 2', scene: 'Scene 17', title: 'If You Only Knew' },
  { id: 'L9HH0p95YCl8rMYp', version: 'v2.0', act: 'Act 2', scene: 'Finale', title: 'If You Only Knew' },
  { id: 'Y04mCXJMMCuaSeho', version: 'v2.0', act: 'Act 2', scene: 'Finale', title: 'If You Only Knew (Alt)' },
];

  const tiktokTracks = [
    { id: '7345678901234567890', title: 'Allegedly - Dance' },
    { id: '7345678901234567891', title: 'Sweetheart Deal - POV' },
    { id: '7345678901234567892', title: 'Standard Procedure - Remix' },
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
    setCurrentScene(null);
    setScriptCards([]);
    setCurrentLineIndex(0);
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

  const openSceneText = (scene: Scene, act: 1 | 2, index: number) => {
    setCurrentScene(scene);
    setCurrentAct(act);
    setCurrentSceneIndex(index);
    setScriptCards(processScript(scene.script || []));
    setCurrentLineIndex(0);
    setActiveModal('sceneText');
  };

  const openLyrics = (scene: Scene) => {
    if (scene.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${scene.youtubeId}`, '_blank');
    }
  };

  const nextScene = () => {
    const scenes = currentAct === 1 ? act1Scenes : act2Scenes;
    if (currentSceneIndex < scenes.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      const nextS = scenes[nextIdx];
      if (currentAct === 1) setSelectedAct1SceneIndex(nextIdx);
      else setSelectedAct2SceneIndex(nextIdx);
      openSceneText(nextS, currentAct!, nextIdx);
    }
  };

  const prevScene = () => {
    const scenes = currentAct === 1 ? act1Scenes : act2Scenes;
    if (currentSceneIndex > 0) {
      const prevIdx = currentSceneIndex - 1;
      const prevS = scenes[prevIdx];
      if (currentAct === 1) setSelectedAct1SceneIndex(prevIdx);
      else setSelectedAct2SceneIndex(prevIdx);
      openSceneText(prevS, currentAct!, prevIdx);
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
  }, [activeModal, currentLineIndex, scriptCards]);

  const scrollToScene = (index: number) => {
    const element = document.getElementById(`scene-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const act1Scenes: Scene[] = [
    { 
      id: "01-00", 
      title: "Allegedly", 
      summary: "The opening number establishing the media circus and the 'alleged' nature of the crimes.", 
      characters: "Reporters, Geoff, Maxie, Ensemble",
      hasMusic: true,
      youtubeId: "ETAIIfgJZKY",
      lyric: "ALLEGEDLY! ALLEGEDLY!\nWe must use the word 'allegedly' until the final gavel falls.\nGeoffrey Aaron Goldstein. Convicted. Continental. Charismatic.\nThe world is a stage, and I've simply bought the best seats.",
      script: [
        { type: 'musical-number', speaker: `SONG`, text: `[ALLEGEDLY - Full cast number]` }
      ]
    },
    { 
      id: "01-01", 
      title: "Sweetheart Deal", 
      summary: "Geoff secures a lenient house arrest deal while his empire continues to grow.", 
      characters: "Geoff, Maxie, Buck Jr, Stacey, Officer",
      hasMusic: true,
      youtubeId: "ysue5dEzxjl",
      script: [
        { type: 'dialogue', speaker: `BUCK JR.`, text: `We pushed as far as we could.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `You’re well above the curve on this.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I prefer attention and elegance.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `This feels... transactional.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Obvious. Painfully so.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I’ll order a Chanel ankle monitor cover for that  - thing.` },
        { type: 'stage-direction', text: `STACEY enters with OFFICER.` },
        { type: 'stage-direction', text: `Quietly, to MAXIE.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Best behavior, old girl, the fuzz is in the building.` },
        { type: 'stage-direction', text: `MAXIE and GEOFF laugh.` },
        { type: 'stage-direction', text: `Clears throat.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `You'll have an escort from Pine Ridge Minimum Security. They will stay with you here - 8 to 8, six days a week. Sundays, you stay in the facility.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `How liturgical.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `They do have religious services there, and the rabbi sits on the release board. You should make a strong impression to him.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I’ll practice my Hebrew.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Wouldn’t it be God’s joke - to lock you up solely to bring you back into the flock?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `If God is real, he’s really funny, especially if that’s his use of divine power.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `Consider the time good for reflection. Think optics, and early release. You could be out in a year - maybe 15 months at most - if you’re on your best behavior.` },
        { type: 'stage-direction', text: `STACEY pulls phone out - it’s buzzing. The STACEY taps BUCK JR on the shoulder and hands the phone to him.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `I have to take this. A moment.` },
        { type: 'stage-direction', text: `BUCK JR step out the door, BUCK on the phone.` },
        { type: 'dialogue', speaker: `STACEY`, text: `Mr. Goldstein?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Um - yes? Who are you, princess?` },
        { type: 'dialogue', speaker: `STACEY`, text: `Mr. Buck’s paralegal, sir. While he’s out, I was wondering if you’ve finished the prescreening forms for your approved guests.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I’ll have it tomorrow. And the staff list?` },
        { type: 'stage-direction', text: `Looks confused` },
        { type: 'dialogue', speaker: `STACEY`, text: `I'll check, but the court didn't mention a staff list.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Thank you, princess. I’ll get it done as soon as we finish.` },
        { type: 'stage-direction', text: `Beat` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You have my direct line?` },
        { type: 'stage-direction', text: `Stacey nods.` },
        { type: 'stage-direction', text: `MAXIE notes the interaction, smiling.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You’re very pretty. Exquisite bone structure.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Very patrician. Old World.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I almost feel I’m looking at one of my sisters. What’s your name?` },
        { type: 'dialogue', speaker: `STACEY`, text: `Yes, Ms. Laurent, my name-` },
        { type: 'stage-direction', text: `BUCK JR returns, sees electricity in the air, dismisses  STACEY.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Thank you, Stacey. I’ll see you back at the office.` },
        { type: 'stage-direction', text: `To Geoff` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Any questions?` },
        { type: 'stage-direction', text: `STACEY leaves, blushes and smiles and waves at GEOFF before she leaves.` },
        { type: 'stage-direction', text: `STACEY gone.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Lawyers always ruin the fun.` },
        { type: 'stage-direction', text: `Sigh` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Less temptation is good for the solitude, I suppose.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Builds character.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `But there’s always temptation.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Something will nibble.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You will bite.` },
        { type: 'stage-direction', text: `The POLICE OFFICER shifts slightly.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `As your legal counsel, I advise that you take your time seriously. Grow, Reflect. Try to make all of our jobs easier.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Of course.  I always do.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `My father sends his regards. That was him, on the phone.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `How is old Buck Senior?` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `Just fine. He retired, divorced Mom, and is on month six of a trans-world cruise. I think he’s in Jakarta today.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Of course he is. He sent me pictures this morning.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `He was very specific that I should take excellent care, Jeff-` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Gee-off.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `I’m sorry?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `It's pronounced Gee-off.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Gee-off. Jeff is so - new world. So-` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Honky-tonk.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Tax deductible.` },
        { type: 'stage-direction', text: `Inside joke laughter..` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `Gee-off.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `Of course.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `It’s continental.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `It travels better.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `International.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `Right.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `Well.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `He thinks the world of you.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `For everything you did for him.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I look after my friends.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Buck was a good man.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Raised a good family.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Smart kids.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `Thank you.` },
        { type: 'stage-direction', text: `A flicker of pride.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `I just wish we could have done better.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You did well.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I made a mistake.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `We all pay the piper.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Expensive piper.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Legal talent costs money.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Breeding saves time.` },
        { type: 'stage-direction', text: `Beat*.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `This is a deal any man could dream of.` },
        { type: 'stage-direction', text: `He adjusts his cuff.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Tell your father you did well, kid.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `And keep me in mind if you ever need a recommendation.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `It’s quite the arrangement.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `No.` },
        { type: 'stage-direction', text: `Beat*.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `It’s a sweetheart deal.` },
        { type: 'musical-number', speaker: `SONG`, text: `[Musical number occurs here]` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Counsel.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Do you have anything on your schedule now?` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `No.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `I’m free — if there’s anything else you need.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Good.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I need to review the holding structures and the offshore allocations.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I have the paperwork pulled up in my office.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Shall we?` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `Yes.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `Yes, of course.` },
        { type: 'dialogue', speaker: `BUCK JR`, text: `They begin to move.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Oh — and that noisy woman on the Hill.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `What are we—` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Maxie.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Let the boy breathe.` },
        { type: 'stage-direction', text: `MAXIE stops.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Turns slowly to Geoff.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `He will.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `On his time.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Don’t spiral.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I don’t spiral.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You orbit.` },
        { type: 'stage-direction', text: `She turns and exits down the hall.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `The LAWYER follows immediately.` },
        { type: 'stage-direction', text: `Door closes.` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'stage-direction', text: `Geoff remains with the POLICE OFFICER.` },
        { type: 'stage-direction', text: `He adjusts his cuff.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `She’s quite a dame.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `The OFFICER grunts. Nothing more.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You smoke?` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Nope.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Mind if I?` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Go ahead.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Care to join me?` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Nope.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `I’ll watch from here.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `It’s cold.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `You’re not going anywhere.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Right.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `The monitor.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I wear it all the time.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `That’s the plan.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I’ll just be outside.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Mm-hm.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `I know.` },
        { type: 'stage-direction', text: `Geoff studies him a moment.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Tough crowd.` },
        { type: 'stage-direction', text: `The OFFICER does not react.` },
        { type: 'stage-direction', text: `Geoff moves toward the door.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `It opens.` },
        { type: 'stage-direction', text: `Cold morning light spills in.` },
        { type: 'stage-direction', text: `He steps outside.` },
        { type: 'stage-direction', text: `Blackout.` }
      ]
    },
    { 
      id: "01-02", 
      title: "Who Was That - Preprise 1", 
      summary: "Gus, a homeless man, catches a glimpse of the island's inner workings.", 
      characters: "Gus, Maxie",
      hasMusic: true,
      youtubeId: "_lhwSoj4Ilk",
      lyric: "WHO WAS THAT?\nIn the shadows of the pier.\nWHO WAS THAT?\nA face I shouldn't fear.\nBut the eyes, they tell a story\nOf a power and a glory\nThat I'll never, ever know.",
      script: [
        { type: 'stage-direction', text: `Exterior terrace / sidewalk.` },
        { type: 'stage-direction', text: `GUS sits on a milk crate. Cardboard sign. Doesn’t look up.` },
        { type: 'dialogue', speaker: `GUS`, text: `Hey — you got a dollar?` },
        { type: 'stage-direction', text: `Geoff steps down.` },
        { type: 'musical-number', speaker: `SONG`, text: `[Musical number occurs here]` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Stay right here. I'll be right back.` },
        { type: 'stage-direction', text: `GEOFF goes inside to a drink cart, ignoring the OFFICER who has been watching. GEOFF begins to pour. One cup. Then, without breaking rhythm, a second.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Two cups. How nice. I prefer mine black.` },
        { type: 'stage-direction', text: `Geoff takes a breath in, a little startled but not sweating.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Of course. Please — mi casa es—` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Su casa?` },
        { type: 'stage-direction', text: `He brings it to his nose. A genuine moment of curiosity.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Good roast. Strong. Hints of — cinnamon? Cacao?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You know coffee.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `I know a lot of things.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Single-origin cooperative. High elevation. Volcanic soil. Direct trade. Very clean finish. Patagonia.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Mm. Never heard of any of that. I'll look it up on my break.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Your job must be killer.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Sure beats working the corner, right?` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Staff is cleared to come and go?` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Yes. Why?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `My personal assistant is here. New guy — started during the trial. He's essential, runs all over the city. I wasn't sure if he could come play, with all the commotion and everything—` },
        { type: 'stage-direction', text: `A glance at his cup.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `—coffee beans.` },
        { type: 'stage-direction', text: `He moves past the Officer before another question can form.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `I wasn't made aware of one. Who is that?` },
        { type: 'stage-direction', text: `Geoff is already at the terrace door.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I'll grab him. Great guy. You'll love him.` },
        { type: 'stage-direction', text: `Exterior terrace. Geoff steps out with the second cup of coffee for Gus.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Coffee.` },
        { type: 'dialogue', speaker: `GUS`, text: `Thanks.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Couldn't bring the dry outside.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Gus smells it. Makes a face.` },
        { type: 'dialogue', speaker: `GUS`, text: `Did you put chocolate syrup in this?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Don't tell Sherlock. To him it's Eritrea's finest.` },
        { type: 'dialogue', speaker: `GUS`, text: `Eritrea?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Ethiopia. Maybe Chile. I said something - expensive sounding. (leaning in) It's from the convenience store down the block. I add cocoa powder.` },
        { type: 'stage-direction', text: `Gus laughs.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Lucky for you, I have a proposition you'd be foolish not to consider. You need a job. You need a bed. I need assistance.` },
        { type: 'dialogue', speaker: `GUS`, text: `I'm not—` },
        { type: 'stage-direction', text: `He stops himself. Looks around. Feels the cold.` },
        { type: 'dialogue', speaker: `GUS`, text: `I mean. It is getting cold.` },
        { type: 'stage-direction', text: `A beat. Then, carefully:` },
        { type: 'dialogue', speaker: `GUS`, text: `I'm not the punk, though. Deal?` },
        { type: 'stage-direction', text: `Geoff freezes. Then laughs — genuinely, which is rare.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You won't be anyone's punk standing next to me. (grinning) And you're not my type either. Relax. But just in case it gets lonely, I'll take your preference under advisement.` },
        { type: 'stage-direction', text: `Gus smirks.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Come on in. Let's get you set up.` },
        { type: 'dialogue', speaker: `GUS`, text: `I'm allowed?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `It's my house.` },
        { type: 'dialogue', speaker: `GUS`, text: `The cop.` },
        { type: 'stage-direction', text: `Geoff knocks on the glass. The Officer opens the door just enough.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Sherlock — this is—` },
        { type: 'dialogue', speaker: `GUS`, text: `Gus.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Gus.` },
        { type: 'stage-direction', text: `He looks Gus over like he's reading a document.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `He's staff?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Personal assistant. He assists me. Personally.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `He checks in when he leaves and when he returns. Will he be here at night when you're up the street?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `He's a grown man. He sleeps where he likes. He will be taking the guest apartment around back. But Gus - (approving) Gus - here will be absolutely necessary while I'm on site.` },
        { type: 'stage-direction', text: `A beat. Geoff tilts his head, almost charmed by his own situation. He walks by OFFICER, GUS follows hesitantly, excusing himself and offering a hand.` },
        { type: 'dialogue', speaker: `GUS`, text: `Nice to meet you.` },
        { type: 'stage-direction', text: `The OFFICER looks at him, then at GEOFF, then back at GUS.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `(holding out hand) Gus` },
        { type: 'dialogue', speaker: `GUS`, text: `Gus.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Geoff! Gus?` },
        { type: 'dialogue', speaker: `OFFICER`, text: `We'll make sure we have all the paperwork arranged for you tomorrow, Mr. Gus.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You know, this whole incarceration arrangement — very nice of the State of New York to provide a doorman and security. But HR is my business, Sherlock. I'll call Scotland Yard myself.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Watson.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I'm sorry.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `Officer Watson - that's my name, Gee-off.` },
        { type: 'stage-direction', text: `Stunned Silence.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Of course, Watson, Gus?` },
        { type: 'dialogue', speaker: `GUS`, text: `I'm right behind you.` },
        { type: 'dialogue', speaker: `OFFICER`, text: `I'll be here.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `He's very good at his job. And what a sweetheart, isn't he?` }
      ]
    },
    { 
      id: "01-03", 
      title: "The Conscience Clause", 
      summary: "Maxie and Geoff discuss the need for a 'conscience' in their operation.", 
      characters: "Geoff, Maxie",
      hasMusic: false,
      script: [
        { type: 'stage-direction', text: `Interior – Federal courthouse hallway. Midday.` },
        { type: 'stage-direction', text: `LILA exits her office with her bag. STACEY waits near the elevators, scrolling her phone.` },
        { type: 'dialogue', speaker: `LILA`, text: `Ready?` },
        { type: 'dialogue', speaker: `STACEY`, text: `Starving.` },
        { type: 'dialogue', speaker: `STACEY`, text: `They start walking.` },
        { type: 'stage-direction', text: `TAMMY steps out of her office behind them, holding a folder.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Lila — the sentencing memo from—` },
        { type: 'stage-direction', text: `She stops when she sees Stacey.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Do you work here too?` },
        { type: 'dialogue', speaker: `STACEY`, text: `Oh — no — next building. Corporate defense.` },
        { type: 'dialogue', speaker: `STACEY`, text: `We’re neighbors, basically.` },
        { type: 'dialogue', speaker: `LILA`, text: `Stacey was on that case a few months ago — before you came in.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Which case?` },
        { type: 'dialogue', speaker: `STACEY`, text: `Eager.` },
        { type: 'dialogue', speaker: `STACEY`, text: `The one with the—` },
        { type: 'stage-direction', text: `Tammy keeps looking at her.` },
        { type: 'stage-direction', text: `Stacey falters.` },
        { type: 'dialogue', speaker: `STACEY`, text: `— you know.` },
        { type: 'dialogue', speaker: `STACEY`, text: `The very generous plea deal.` },
        { type: 'dialogue', speaker: `STACEY`, text: `About the girls.` },
        { type: 'stage-direction', text: `A small silence.` },
        { type: 'dialogue', speaker: `LILA`, text: `The one everyone said was… unusual.` },
        { type: 'dialogue', speaker: `LILA`, text: `Right before your predecessor’s appointment.` },
        { type: 'stage-direction', text: `Small silence` },
        { type: 'dialogue', speaker: `LILA`, text: `People thought maybe he did someone a favor—` },
        { type: 'dialogue', speaker: `LILA`, text: `STACEY elbows LILA too late.` },
        { type: 'dialogue', speaker: `LILA`, text: `— they gave him a sweetheart deal.` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `My office prosecuted it.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `And her office defended it.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `STACEY and LILA nod.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `I didn’t catch your name.` },
        { type: 'dialogue', speaker: `STACEY`, text: `Stacey.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Stacey.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Would you understand if I asked my legal secretary to have lunch at her desk?` },
        { type: 'dialogue', speaker: `STACEY`, text: `Yes, ma’am. Completely.` },
        { type: 'stage-direction', text: `STACEY backs toward the elevator.` },
        { type: 'dialogue', speaker: `STACEY`, text: `We’ll— talk sometime.` },
        { type: 'stage-direction', text: `She exits.` },
        { type: 'stage-direction', text: `TAMMY turns to LILA.` },
        { type: 'dialogue', speaker: `LILA`, text: `What did I do?` },
        { type: 'dialogue', speaker: `TAMMY`, text: `You speculated about a prosecution in a hallway.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `In front of opposing counsel.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Find the memo I asked for this morning.` },
        { type: 'dialogue', speaker: `LILA`, text: `Yes.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `If you can’t, we’ll discuss whether this office is the right place for you.` },
        { type: 'stage-direction', text: `A long beat.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Do you understand?` },
        { type: 'dialogue', speaker: `LILA`, text: `Yes.` },
        { type: 'stage-direction', text: `TAMMY nods once. Enters her office.` },
        { type: 'stage-direction', text: `Door closes.` },
        { type: 'stage-direction', text: `Lights shift.` }
      ]
    },
    { 
      id: "01-04", 
      title: "They Were Just Boys", 
      summary: "A haunting number about the vulnerability of those caught in the web.", 
      characters: "Survivor, Ensemble",
      hasMusic: true,
      youtubeId: "BThrcKexGvA",
      lyric: "THEY WERE JUST BOYS\nWith dreams of a life they'd never see.\nTHEY WERE JUST BOYS\nCaught in a web of luxury.\nNow the silence is the only sound\nIn a world where justice can't be found.",
      script: [
        { type: 'dialogue', speaker: `MAXIE`, text: `I had doubts.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You still do.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Moving someone in after one conversation?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `It wasn’t one conversation.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `It was a song.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `It was a good one.` },
        { type: 'stage-direction', text: `(She studies him.)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You don’t know his history.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Yes, I do.` },
        { type: 'stage-direction', text: `(Silence. She waits.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `His background check cleared. He’s not CIA - he’s not even KGB.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Putin or non-Putin KGB?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Was there a non-Putin KGB?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `There was a non-Hoover CIA.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `NEver mind - I read it all - the court case, his foreclosure, the divorse.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You said you thought he was - like us? Or shared - interests?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I thought so, but I don’t know. He’s smart - honest - proficient - funny -` },
        { type: 'dialogue', speaker: `MAXIE`, text: `And?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `He doesn’t ask questions. Logistics and the way I like my coffee.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `That’s what worries me.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `That’s why I trust him.` },
        { type: 'stage-direction', text: `Gus enters from the back hall carrying groceries and dry cleaning. Comfortable. Not timid.` },
        { type: 'dialogue', speaker: `GUS`, text: `They were out of oat milk. I got almond.` },
        { type: 'stage-direction', text: `Maxie glances at Geoff automatically.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `That’s fine.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `On principle.` },
        { type: 'dialogue', speaker: `GUS`, text: `You have milk principles?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I hate cows. And I hate soybeans.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Ask him about it after I go. I don’t need to hear this story again.` },
        { type: 'stage-direction', text: `She zips the suitcase.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I’m leaving tonight. Three weeks. Maybe four.` },
        { type: 'dialogue', speaker: `GUS`, text: `Fundraisers?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Conferences. Golfing with Ronnie.` },
        { type: 'stage-direction', text: `Imitates.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `He thinks you’re great - the most great - the greatest woman the world has -` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Shut up. He’s a handsy old creep.` },
        { type: 'dialogue', speaker: `GUS`, text: `Wait - Ronnie? The President?` },
        { type: 'stage-direction', text: `Sighs*.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Yes.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Maxie loves Ronnie, and Ronnie loves Maxie.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `He insists on hugging me - just me. A little extra squeeze.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `He’s touchy feely, and just a little leacherous.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `He’s adhesive. I smell him after for days.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `The proximity is vital.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `The proximity is torture.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `But I do like to destroy him in golf. Nothing brings me greater joy than seeing his little bottom lip out about to cry when I get a hole in one` },
        { type: 'stage-direction', text: `Imitates.` },
        { type: 'dialogue', speaker: `GUS`, text: `A good golfer - the best. Better than the best woman any other country has.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'stage-direction', text: `GEOFF breaks out in laughter and claps his hands.` },
        { type: 'stage-direction', text: `Smiling warmly` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Exactly. I’m off to the money.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You’re more interested in the office, darling, now run along - the Emerald City awaits.` },
        { type: 'stage-direction', text: `Officer Watson appears quietly in the doorway.` },
        { type: 'dialogue', speaker: `WATSON`, text: `Afternoon.` },
        { type: 'dialogue', speaker: `GUS`, text: `Afternoon, sir.` },
        { type: 'stage-direction', text: `A familiar nod passes between them. Watson does not acknowledge Geoff.` },
        { type: 'stage-direction', text: `GEOFF looks hurt` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Attorney-client privilege extend to golf invitations?` },
        { type: 'dialogue', speaker: `WATSON`, text: `I file who comes and goes. Why. And anything illegal I hear discussed.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `WATSON`, text: `That’s the legally required minimum.` },
        { type: 'stage-direction', text: `Watson remains at ease, leaning in shadow.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Are you a maximalist, Officer Watson?` },
        { type: 'dialogue', speaker: `WATSON`, text: `I do my job, I go home. It’s a tough job, this.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Keep a close eye on the two of them. This mid-afternoon boy’s club I’ve not been invited to in here sounds dangerous if unattended to.` },
        { type: 'stage-direction', text: `OFFICER nods*. *MAXIE puts her hand on her luggage.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Car’s waiting.` },
        { type: 'stage-direction', text: `Gus steps forward.` },
        { type: 'dialogue', speaker: `GUS`, text: `I’ll carry it.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `How positively genteel - thank you, but I can get it.` },
        { type: 'dialogue', speaker: `GUS`, text: `Never said you couldn’t. Just helping out.` },
        { type: 'stage-direction', text: `He takes the suitcase anyway.` },
        { type: 'stage-direction', text: `Maxie watches him a moment, follows him outside.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `He likes you.` },
        { type: 'dialogue', speaker: `GUS`, text: `I’m sorry?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Geoff. He doesn’t like many people.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `He’s awfully likable, though.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `He is. We run in different circles where likability is-` },
        { type: 'stage-direction', text: `She waves her hand vaguely. Silence.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `The older you get, it seems, the more time you spend surrounded by people you’re required to be around, not who you want to be around.` },
        { type: 'stage-direction', text: `She watches for a response.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Donors. Voters. Advisors. Old friends you can’t quite shake.` },
        { type: 'stage-direction', text: `Very few you’d choose.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `And very few you’d actually choose.` },
        { type: 'stage-direction', text: `Gus holds steady.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You two will get along fine, I think.` },
        { type: 'dialogue', speaker: `GUS`, text: `I try not to be difficult.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Don’t get into the whisky.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `If I do - and I won’t - you’ll be my first and only call.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Why?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Bail money.` },
        { type: 'stage-direction', text: `She laughs*.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Have a good trip. The President awaits.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `The President and all the other boys who were kingdoms without any idea of what to do with them.` },
        { type: 'stage-direction', text: `Lights shift.` },
        { type: 'musical-number', speaker: `SONG`, text: `[Musical number occurs here]` }
      ]
    },
    { 
      id: "01-05", 
      title: "Reasonable Man", 
      summary: "The Solicitor General struggles with the pressure to look the other way.", 
      characters: "Solicitor General, Assistant",
      hasMusic: true,
      youtubeId: "Qg-SA255BA4",
      lyric: "I'M A REASONABLE MAN\nI follow the law, I follow the plan.\nBut when the truth is a jagged pill\nAnd the powerful have the will to kill\nCan I still be a reasonable man?",
      script: [
        { type: 'dialogue', speaker: `RONNIE`, text: `Thirteen months already. Time flies when you’re governing at a very high level. Very high. People don’t understand the pace. It’s exhausting being right this often.` },
        { type: 'stage-direction', text: `(He scrolls.)` },
        { type: 'dialogue', speaker: `ASH`, text: `Yes, sir. But-` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `-thirteen months of what sir?` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Geoff is getting out. My ol’buddy - you know the poor bastard that got caught by the police right in my backyard - right there in Queens, I mean, had I known that I could pick up such sweet-` },
        { type: 'dialogue', speaker: `ASH`, text: `You don’t mean Geoff -` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Goldstein. The guy who was -` },
        { type: 'dialogue', speaker: `ASH`, text: `-you know, he got the deal for -` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `-with all those young-` },
        { type: 'dialogue', speaker: `ASH`, text: `-you don’t mean your buddy, sir-` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `-surely, you mean, Geoff the p-` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Yes! That one! Great guy - the best! Could get you just about anything you asked for - could get anything you wanted! He was a getter, a real fixer - yes sir, poor bastard if that dumb little -` },
        { type: 'dialogue', speaker: `ASH`, text: `Eighteen months. He was serving eighteen months.` },
        { type: 'stage-direction', text: `He became eligible at 13.` },
        { type: 'dialogue', speaker: `ASH`, text: `You can’t seriously say that he was on -` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Good behavior the whole time! The rabbi spoke for him personally at the hearing, and he’s never so positive! I didn’t know Geoff knew Hebrew. Read the - whatever book they read for the - not Christmas thing-` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Hanukah, sir.` },
        { type: 'dialogue', speaker: `ASH`, text: `Chanukkiah, actually.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `CHANUKKAH! Yah! He reads Hebrew. But I guess they all do you. I mean you really can’t walk around New York without hearing Hebrew from one of th-` },
        { type: 'dialogue', speaker: `ASH`, text: `Should we reopen the file? He served time. Maybe we just-` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `-let the whole matter die. It would make our jobs-` },
        { type: 'dialogue', speaker: `ASH`, text: `-much easier.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Easier? Sure! Let’s not move on him. He’s earned a few days - months - hell, years off from all that legal entanglement. I’ll speak to the AG of NY myself. Make sure he knows not to worry about Geoff - that he’s under my` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Sir I cannot emphasize to you enough the importance of not being associated in any way with Geoffrey Aaron Goldstein.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `(*Silence. They look at ASH.)*` },
        { type: 'dialogue', speaker: `ASH`, text: `What? Same. What she said.` },
        { type: 'stage-direction', text: `(RONNIE stands. Moves. Fills the room.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `You agree, huh? Do you ever not agree? Did you two plan this together?` },
        { type: 'dialogue', speaker: `ASH`, text: `Sir, you brought it up.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We had no idea until just now.` },
        { type: 'stage-direction', text: `(*Laughs*.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Of course not! All the power of the US Federal government - the freaking White House through three Presidents - Senators, Ambassadors, Kings, and Attorneys General and Directors of the FBI - like you two -` },
        { type: 'stage-direction', text: `(*CAMMIE and ASH look at each other.*)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `No one’s touched him in over a decade! I will be perfectly fine going to one last hoo-rah on his little island - yes, even as President - before I quietly cut ties with him forever, or at least until my term of office is over.` },
        { type: 'dialogue', speaker: `ASH`, text: `Event on-` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `-St. Elmo?` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Oh yes - LIL ELMO he calls it - or something. I’m always too distracted by his little assistant lady - (*impersonates a Frenchman)* Isabella Maximillion Laurent. French is the language of love. I love French - I speak French, the best French. I’d like to get my hand on some patries, some of Maxie’s sweet sweet French -` },
        { type: 'dialogue', speaker: `ASH`, text: `She’s Bavarian, sir.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Or Hungarian. But you cannot go.` },
        { type: 'dialogue', speaker: `ASH`, text: `Imagine the narrative control.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `SDNY is still sniffing about. You don’t want` },
        { type: 'dialogue', speaker: `ASH`, text: `to be caught with your pants down.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Don’t we run them too, the S- D - what was it again? Who’s sniffing whose-` },
        { type: 'dialogue', speaker: `ASH`, text: `SDNY - no, sir. However, The DOJ and -` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The FBI both have open cases.` },
        { type: 'stage-direction', text: `Neither are currently interested` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Or obliged to take the lead.` },
        { type: 'dialogue', speaker: `ASH`, text: `We are operationally aligned.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And structurally consistent.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `With what.` },
        { type: 'dialogue', speaker: `ASH`, text: `The position.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The objective.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Which is.` },
        { type: 'dialogue', speaker: `ASH`, text: `Stability.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Continuity.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Those are the same thing.` },
        { type: 'dialogue', speaker: `ASH`, text: `Practically.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Functionally.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I love that. Practically and functionally. Very different. Very similar. That’s government.` },
        { type: 'stage-direction', text: `(He nods, pleased.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `So we’re all in agreement.` },
        { type: 'dialogue', speaker: `ASH`, text: `Completely.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Entirely.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Wonderful. I adore unity. I love it when we all agree! Now I am in the middle of a streak. Hey, get Geoff on the phone so I can find out when the shindig is going down.` },
        { type: 'stage-direction', text: `(He turns back to his phone.)` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We are advising against it-` },
        { type: 'dialogue', speaker: `ASH`, text: `As we previously mentioned.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And just discussed.` },
        { type: 'dialogue', speaker: `ASH`, text: `New eyes are on it..` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Additional oversight, but not from us.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And someone we can’t stop, huh? Shit - everyone wants oversight until they’re the ones being overseen. Very unfair. Very selective fairness. This is practically a witch hunt - or is this a hoax? I forget, what word are we using this week?` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Tomfoolery?` },
        { type: 'dialogue', speaker: `ASH`, text: `An excellent word, but let’s talk about-` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `A distraction. For them.` },
        { type: 'dialogue', speaker: `ASH`, text: `For you, too. A Retirement.` },
        { type: 'stage-direction', text: `(RONNIE jumps)` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Not yours.` },
        { type: 'dialogue', speaker: `ASH`, text: `The tired one.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `They’re all tired. They’ve looked tired since the nineties. All my appointees - I got three Supreme Court appointments the first time and they all look so tired already. What does everyone do around here? How much work could they possibly be doing - it’s the government!` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The Solicitor General is very close to retirement` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And is in a most useful position to stop questions if asked-` },
        { type: 'dialogue', speaker: `ASH`, text: `Firmly.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Respectfully.` },
        { type: 'dialogue', speaker: `ASH`, text: `The current one will disappear` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And we have a better one waiting.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `You’re not killing the Solicitor General, are you. Because that’s messy. People overreact to that. And I recommend we find a more secure location to discuss this if you are - and I’m not saying we should - but it’s messy business to off someone, maybe we should head into the bunker where -` },
        { type: 'dialogue', speaker: `ASH`, text: `Not killing.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Poor man, he’s in such poor health.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Good. Great. I didn’t mean to suggest we should kill anyone. I was just saying if you were discussing - for your safety we should - but good. I prefer illness. Illness has sympathy. Murder has paperwork. Poor man. So sick. Aw. Boo hoo.` },
        { type: 'stage-direction', text: `(Silence.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Nobody will care. It’s the fucking Solicitor General. It wont make a headline. You both are - what are your jobs again? - whatever - i’m making this your job to keep Geoff off the radar. I dream of an island in the sun when I leave office. And so many other things like -` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The best sunsets in the hemiphere.` },
        { type: 'dialogue', speaker: `ASH`, text: `Yes, sir, we’ve heard. But not before.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Relax. I’m joking. Mostly.` },
        { type: 'stage-direction', text: `(He adjusts his cuffs. Steps downstage slightly.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I’m a very reasonable man.` },
        { type: 'stage-direction', text: `Lights shift toward the beginning of the song.` },
        { type: 'musical-number', speaker: `SONG`, text: `[Musical number occurs here]` }
      ]
    },
    { 
      id: "01-06", 
      title: "A Billion Here, A Favor There", 
      summary: "The currency of the island is exposed.", 
      characters: "Geoff, Maxie, Ensemble",
      hasMusic: true,
      lyric: "A BILLION HERE, A FAVOR THERE\nThat's how you build a world that's fair.\nFair for us, and fair for them\nAs long as we can keep the gem\nOf silence in the air.",
      script: [
        { type: 'stage-direction', text: `**New York Mansion – Offices**` },
        { type: 'stage-direction', text: `Late afternoon.` },
        { type: 'stage-direction', text: `Geoff's office occupies the ground floor of the New York mansion. Architectural renderings and renovation photographs of **LIL' ELMO ISLAND** sit across a large table.` },
        { type: 'stage-direction', text: `Officer Watson stands quietly near the door.` },
        { type: 'stage-direction', text: `Geoff's ankle monitor is visible beneath his trouser leg.` },
        { type: 'stage-direction', text: `Maxie and Buck Jr. review documents.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `So. You rebuilt the island while I was gone.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You were busy. It was dreary. The palm trees were dying — they've been moved or replaced. The roofs were leaking — they've been patched and the buildings repainted.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `And the lodge?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Has been extended but — don't worry — I didn't touch your office. Now there's more room. It doesn't feel like your neighbor's basement man cave.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I leave for a year and you redesign the kingdom.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You left me unsupervised. It's mostly cosmetic.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `The renovations are complete and all meet the local requirements. Your runway and helicopter pad are up to code and legal, as is the expanded dock — *finally*. Do you want to know how much you were siphoning off to pay the fees and *(clears throat)* other costs associated with your out-of-code dock alone?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Not really.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Was it a lot?` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `The folk over on Saint Elmo Island West are very grateful for the contributions to their children's college fund. The managerial staff alone — all eight of them — have sent their children to college at no cost to themselves.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I've always supported higher education.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `He loves young minds. But the dock will house your ship —` },
        { type: 'dialogue', speaker: `GEOFF`, text: `The RMS Sea-Geoff Sail?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Yes, your party boat can be docked and fit two additional large craft or up to four small ones.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Details about the governing corporations are clean. The island functions under a separate, offshore corporate entity from your other properties. Your non-profit foundation is the official beneficiary of any and all events, and we have updated your liability waivers for your guests and your — *(pause, looks at Watson)* — other guests.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Yes, my staff and entertainment never had to sign previously. Always thought that was a big loophole.` },
        { type: 'stage-direction', text: `(Stepping back.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `This looks amazing. Do I even need to be here? You've got it covered to the last detail.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Operations. I hate it. After you are released, either you take over completely, or find someone, or I will quit.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You won't quit, Maxie. You'll smoke twice as much and your skin will wrinkle from all the stress —` },
        { type: 'stage-direction', text: `(Maxie gasps playfully.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `But I think we have someone in the family already for the job.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I clocked it. I knew you'd suggest it. But you can't just throw him on the island.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I threw him into my life at the most chaotic moment and here we are. Level-headed, smart, doesn't ask questions.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Wait — who?` },
        { type: 'stage-direction', text: `Gus enters. Buck tries to hand him his drink. Gus takes it and sets it down on the coffee cart.` },
        { type: 'dialogue', speaker: `GUS`, text: `Thank you for not leaving it to stain the wood. I'll take it to the kitchen in a moment.` },
        { type: 'stage-direction', text: `To Geoff.` },
        { type: 'dialogue', speaker: `GUS`, text: `You said you wanted to see me?` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Wait — who are —` },
        { type: 'dialogue', speaker: `MAXIE`, text: `He's the operator. You might have to learn his name, Junior.` },
        { type: 'stage-direction', text: `Waves at the map.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `What do you think, darling?` },
        { type: 'dialogue', speaker: `GUS`, text: `That's... bigger than I expected. Is that — *(to Geoff)* yours?` },
        { type: 'stage-direction', text: `(Geoff nods proudly.)` },
        { type: 'dialogue', speaker: `GUS`, text: `For all you talk about the size — it's bigger than I expected.` },
        { type: 'stage-direction', text: `(Does not smile.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I don't get many complaints.` },
        { type: 'dialogue', speaker: `GUS`, text: `But you've gotten some, I bet.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Boys, stop it.` },
        { type: 'stage-direction', text: `To Gus.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You've been doing well.` },
        { type: 'dialogue', speaker: `GUS`, text: `Thank you.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You've been down to Florida twice — handled the whole deal with the Prince and his entourage quietly and professionally. Everyone left happy.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `We hear good things.` },
        { type: 'dialogue', speaker: `GUS`, text: `It's just herding cats. Simple if you can avoid the claws.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `There it is — that's the job.` },
        { type: 'dialogue', speaker: `GUS`, text: `Actually, one thing though, just so I know how to respond if the question comes up again - the man, the prince - he was asking for -` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Oh. Mansour. *That.*` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Wait - you met Prince Mansour bin Hashim al-Zayani? You met that Prince? You let him meet that Prince? What is your name again? Who is this guy?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Relax, Buck. Our little operator handled it beautifully. His father even extended his thanks for delivering Mansour on time, not letting him disgrace his family. They're very devout.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `(to Gus) You find Mansours everywhere — I just seem to attract them. Every one calls me their best friend.` },
        { type: 'dialogue', speaker: `GUS`, text: `So, it's all-` },
        { type: 'dialogue', speaker: `MAXIE`, text: `It's good. He's just - Gee-off?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Handsy and inappropriate. It's his whole personality. And the royal family was grateful for his timeliness, though the Prince had a case of blue balls.` },
        { type: 'stage-direction', text: `(GUS and GEOFF laugh nervously, as if staged - neither belief GEOFF. the room is tense. MAXIE steps forward)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Which brings us to our next point - our various *roles* here in this operation. Geoff is obviously the pretty face.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Shocking because I'm not even the prettiest face in the room. I also dabble in dollars since I'm technically an accountant.` },
        { type: 'dialogue', speaker: `GUS`, text: `You are? I would have never thought that.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `But now that you know, it kinda makes sense, right? I'm even a CPA - but it means I run the books for our little multi-million-dollar operation. And little Buck here does the tedious shit.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `(annoyed - he's heard this before) I'm your lawyer. Paperwork and compliance is not tedious.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `It's tedious.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You're not tedious, Buckie, just the paperwork. Maxie gets the fun part — networking, playing golf, hobnobbing.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `And that covers just about all the major roles. We work almost exclusively in-house, a mom-and-pop, as you'd say.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `How do you feel about a little promotion?` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Promote him? You don't even know him! What did you pick him up off the street or something?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `(to BUCK) Yes. A year ago. (to GUS) What do you think?` },
        { type: 'dialogue', speaker: `GUS`, text: `Promotion to what? Head bus boy?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Operations, darling. You'll go ahead of us to Lil' Elmo — Geoff's first trip back — make sure everything's perfect. Walk the runway, cross the t's.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Make sure she didn't destroy my office.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `The staff is hired already - JB is the local go-to for staffing. You'll work with him in the future on that. You'll need to come back to New York when we arrive, though. Private party.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Sorry, old chum, your invite got lost in the mail, but someone's got to make sure this old shack doesn't fall apart.` },
        { type: 'dialogue', speaker: `GUS`, text: `You're serious.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Are you serious? (Starts going through his bag) I've got all sorts of paperwork for - *this guy* to fill out. Liability, indemnity - fuck, does he have a W2?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `He'll remain technically Geoff's PA until we return - it's more of a freelance thing, anyways.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Oh! He's an independent contractor? Great! Let me get Stacey to send the 1099 forms -` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Buck, sit down. He's going as a guest, meeting some people. He'll return. Whatever paperwork, bore him with it when he gets back — if he wants to be promoted to — um — (stumbles)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `(thinking quickly) We'll think of something fabulous. Darling, don't I technically have a title or two?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Yes, you are Vice President of Sales and Marketing... and something else.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Vice President of Sales and Marketing and Strategic Global Partnerships and Development.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `See? Big and fancy, just like the Yankees like - (gets cut off)` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `And Chief Director of Philanthropic Initiatives and Institutional Advancement, Secretary of External Partner Relationships —` },
        { type: 'dialogue', speaker: `MAXIE`, text: `(attempts to speak)` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Chief Executive for Stakeholder Engagement, Vice President of Goldstein & Associates Incorporated, President of Goldstein and Laurent Holdings LLC, Executive Director of the Geoffrey Aaron Goldstein Foundation, President of the Laurent Foundation by your father's designation, President of the I. M. Laurent Foundation in your own right —` },
        { type: 'dialogue', speaker: `MAXIE`, text: `OK, maybe this is a little too-` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Chief Strategist for Domestic Communication and Development.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Well, what's *you* title, Junior?` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `Chief Legal Officer.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Director has a good ring to start, but it's really just something to tell people who need that sort of thing. Director of Operations. For here in New York- and Saint Elmo Island South.` },
        { type: 'dialogue', speaker: `GUS`, text: `And Florida? And a raise with a per diem - (beat, smiling) - of course?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `(laughs) Attaboy! Buck will handle the details while you're gone — formal offer when you're back, if everything goes swimmingly. JB knows the place better than I do at this point. Just make it perfect, old chap. God knows I need a rest after these months of —` },
        { type: 'dialogue', speaker: `MAXIE`, text: `(cuts him off) Imprisonment.` },
        { type: 'dialogue', speaker: `GUS`, text: `When do I leave?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Do you have clothing for the Caribbean?` },
        { type: 'dialogue', speaker: `GUS`, text: `Who does?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I do.` },
        { type: 'dialogue', speaker: `BUCK JR.`, text: `(begrudgingly) I do.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `We all do. But if you don't have swimmies and ugly Hawaiian shirts, darling, Auntie Maxie can provide! I think it's time for a - can you guess?` },
        { type: 'dialogue', speaker: `GUS`, text: `A montage?` },
        { type: 'stage-direction', text: `(Beat. No one acknowledges this.)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Darling, let's go shopping!` },
        { type: 'dialogue', speaker: `GUS`, text: `Oh that's not necessary, it's only 48 hours, and I'm sure I've got some shorts buried somewhere-` },
        { type: 'dialogue', speaker: `GEOFF`, text: `(to GUS) Who designed your shorts? What are they made of? (beat) (to MAXIE) He doesn't even know what his shorts are made of. We have work to do.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Darling, when you have money like we do, nothing is out of reach.` },
        { type: 'stage-direction', text: `Music begins.` },
        { type: 'musical-number', text: `[Musical number occurs here]` }
      ]
    },
    { 
      id: "01-07", 
      title: "Questions & Answers", 
      summary: "A tense interrogation scene.", 
      characters: "Tammy, Maxie",
      hasMusic: true,
      youtubeId: "RcVaEHwWUyo",
      lyric: "QUESTIONS AND ANSWERS\nA dance for the chancers.\nI ask the truth, you tell a lie\nAnd we both wait for the day to die\nIn this game of questions and answers.",
      script: [
        { type: 'stage-direction', text: `Washington, D.C. – Department of Justice` },
        { type: 'stage-direction', text: `A quiet office. Late evening. A desk lamp glows over stacks of legal briefs.` },
        { type: 'stage-direction', text: `ASH and CAMMIE stand reviewing a folder. There is something slightly too comfortable about how they occupy someone else's office.` },
        { type: 'stage-direction', text: `TAMMY enters.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `You wanted to see me?` },
        { type: 'dialogue', speaker: `ASH`, text: `Your work at the Southern District has been impressive.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `In Alabama too, where you were —` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Attorney General of the state of Mississippi.` },
        { type: 'dialogue', speaker: `ASH`, text: `Alabama, Mississippi.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `No one in this town knows the difference.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `I do.` },
        { type: 'stage-direction', text: `(smiling)` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `That's why we like you.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `ASH`, text: `The people you've protected. Quietly. Without headlines.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The people being ignored by the opposition in their —` },
        { type: 'dialogue', speaker: `ASH`, text: `Socialist —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Autocratic —` },
        { type: 'dialogue', speaker: `ASH`, text: `Centralized federal —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `States' rights rhetorical —` },
        { type: 'dialogue', speaker: `ASH`, text: `Mess.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Which one is it?` },
        { type: 'dialogue', speaker: `ASH`, text: `Depends on the week.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And the audience.` },
        { type: 'dialogue', speaker: `ASH`, text: `Too many leftists on television.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Too many centrists.` },
        { type: 'dialogue', speaker: `ASH`, text: `Too many right-wing commentators pretending to be lawyers.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Your strength is that you're an actual lawyer.` },
        { type: 'dialogue', speaker: `ASH`, text: `Who happens to be quiet about it.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `ASH`, text: `The President has noticed.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `He was impressed.` },
        { type: 'dialogue', speaker: `ASH`, text: `He would like you to serve as Solicitor General of the United States.` },
        { type: 'stage-direction', text: `A pause. Tammy doesn't perform surprise. She thinks.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `What happens to my cases at the Southern District?` },
        { type: 'dialogue', speaker: `ASH`, text: `Reassigned within the office.` },
        { type: 'stage-direction', text: `A beat. She understands exactly what that means.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `That's a significant transition.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `It's a promotion.` },
        { type: 'dialogue', speaker: `ASH`, text: `A constitutional role.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `National responsibility.` },
        { type: 'stage-direction', text: `(stopping them)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Is there a reason you're offering me a promotion?` },
        { type: 'stage-direction', text: `ASH and CAMMIE exchange a look. Something shifts — less HR, more disclosure.` },
        { type: 'dialogue', speaker: `ASH`, text: `Your alignment with the President's position on the Constitution —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Strict construction.` },
        { type: 'dialogue', speaker: `ASH`, text: `The kind that plays well in Mississippi.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `But not on television.` },
        { type: 'stage-direction', text: `(Beat — they smile, almost in unison.)` },
        { type: 'dialogue', speaker: `ASH`, text: `Quiet legal movement.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Careful argument.` },
        { type: 'dialogue', speaker: `ASH`, text: `Precision.` },
        { type: 'stage-direction', text: `(flatly)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `What is the government dealing with?` },
        { type: 'stage-direction', text: `The smiles don't disappear exactly. They just become something else.` },
        { type: 'dialogue', speaker: `ASH`, text: `Rumors.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Witnesses.` },
        { type: 'dialogue', speaker: `ASH`, text: `Flight records.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Depositions.` },
        { type: 'dialogue', speaker: `ASH`, text: `Questions.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Lots of questions.` },
        { type: 'stage-direction', text: `Beat. Tammy looks at the folder on the desk.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Are any of them about me?` },
        { type: 'dialogue', speaker: `ASH`, text: `Not yet.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `That's the idea.` },
        { type: 'stage-direction', text: `Tammy looks at them both. A long moment. She picks up the folder.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `I'd like to review the file before I give you an answer.` },
        { type: 'dialogue', speaker: `ASH`, text: `Of course.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Take your time.` },
        { type: 'stage-direction', text: `(Beat — then, together, almost warm:)` },
        { type: 'dialogue', speaker: `ASH / CAMMIE`, text: `There isn't much.` },
        { type: 'stage-direction', text: `Lights shift.` },
        { type: 'musical-number', speaker: `SONG`, text: `[QUESTIONS AND ANSWERS - Full cast number]` }
      ]
    },
    { 
      id: "01-08", 
      title: "Little Secrets", 
      summary: "Maxie's solo about the power of knowing what others hide.", 
      characters: "Maxie",
      hasMusic: true,
      youtubeId: "8yOpukgj600",
      lyric: "LITTLE SECRETS\nI keep them in a jar.\nLITTLE SECRETS\nI know exactly who you are.\nAnd when the time is right\nI'll bring them to the light\nAnd watch you fall from afar.",
      script: [
        { type: 'stage-direction', text: `**New York – Geoff's Office**` },
        { type: 'stage-direction', text: `Morning. GUS rolls in with a suitcase in a Hawaiian shirt and unmatched long pants with a wide-brimmed white hat and colored ribbon. MAXIE is reading some paperwork in the corner and turns and starts laughing. GEOFF looks up from his desk, pauses, and sets down his pen.` },
        { type: 'dialogue', speaker: `GUS`, text: `Well, how do I look?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Like you want to hurt your Aunt Maxie and I. We're older, young man. Your outfit is very — hard on the eyes.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Darling, when we told you to relax and have fun — I, well —` },
        { type: 'dialogue', speaker: `GUS`, text: `It's certainly fun.` },
        { type: 'stage-direction', text: `MAXIE laughs.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Excuse me. The coffee cart doesn't have enough booze on it. I know it's early but —` },
        { type: 'stage-direction', text: `(She looks him up and down.)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Your outfit makes me want to start drinking something —` },
        { type: 'dialogue', speaker: `GUS`, text: `Fruity?` },
        { type: 'stage-direction', text: `MAXIE laughs again and leaves.` },
        { type: 'stage-direction', text: `(Calls after her.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Make it two, Maxie!` },
        { type: 'stage-direction', text: `(He looks to GUS.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Gus'll have a Shirley Temple.` },
        { type: 'dialogue', speaker: `GUS`, text: `Do you hate me or something? Just because I don’t drink alcohol does not mean the next best option is a child actress.` },
        { type: 'dialogue', speaker: `GUS`, text: `Wait — when was she an actress? Is she dead?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Even if she’s in a nursing home she’s too high class for you.` },
        { type: 'dialogue', speaker: `GUS`, text: `She was too young for me anyway. What would the neighbors think? A man of my age.` },
        { type: 'stage-direction', text: `(Laughs. Almost.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Well. You ready? Got everything?` },
        { type: 'dialogue', speaker: `GUS`, text: `Yeah — you sure I don't need a passport or something?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Don’t be silly. Saint Elmo South and West are technically American.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Certainly American-adjacent.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You’ll spend twenty minutes switching planes in Cuba.` },
        { type: 'dialogue', speaker: `GUS`, text: `Cuba? Can we go there?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I can. Why wouldn’t you?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You’re just changing planes. If anyone asks questions, tell Rodrigo at the airport to call me.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I’ll CashApp him a copy of your passport.` },
        { type: 'dialogue', speaker: `GUS`, text: `This is a lot different than I thought it would be.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Traveling? Or the job?` },
        { type: 'dialogue', speaker: `GUS`, text: `The everything.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `GUS`, text: `I've been meaning to ask something.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `That's dangerous.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Part of the reason I liked you is how few questions you asked.` },
        { type: 'dialogue', speaker: `GUS`, text: `One of the reasons I liked working here was that it didn't seem like I needed to ask any.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `What changed?` },
        { type: 'dialogue', speaker: `GUS`, text: `The prince.` },
        { type: 'stage-direction', text: `(A small beat.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You want to know about… everything.` },
        { type: 'dialogue', speaker: `GUS`, text: `Is there an everything to know?` },
        { type: 'dialogue', speaker: `GUS`, text: `He's not the only one. People say things.` },
        { type: 'dialogue', speaker: `GUS`, text: `Things I could always write off.` },
        { type: 'dialogue', speaker: `GUS`, text: `But the prince —` },
        { type: 'dialogue', speaker: `GUS`, text: `he was very insistent.` },
        { type: 'dialogue', speaker: `GUS`, text: `Dangerously insistent.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Yes, he told me he was — threatening. Inappropriately. I'd say he apologized, but he didn't. He said you held the line and that it was the correct thing to do. That's about all the gratitude you'll get.` },
        { type: 'stage-direction', text: `(Sighs.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `He's not a very good best friend.` },
        { type: 'dialogue', speaker: `GUS`, text: `I don't need details.` },
        { type: 'dialogue', speaker: `GUS`, text: `But I need to know something.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `GUS`, text: `I'm not hurting anyone, am I.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `GUS`, text: `That's not a question I should have to ask.` },
        { type: 'stage-direction', text: `(A quiet pause.)` },
        { type: 'dialogue', speaker: `GUS`, text: `And you're not trying to hurt me.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `That's a loaded question.` },
        { type: 'dialogue', speaker: `GUS`, text: `It's a question that needs an answer.` },
        { type: 'stage-direction', text: `(Geoff studies him. For a moment he almost explains.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You have the right to ask.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Especially if you're going to be doing more.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `See — a long time ago I realized people have certain —` },
        { type: 'stage-direction', text: `(searching)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `— desires. Things they can't get anywhere else. And I was very good at finding those things.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Secrets.` },
        { type: 'stage-direction', text: `(Silence. She has been listening.)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `We deal in people's secrets.` },
        { type: 'stage-direction', text: `(She closes a folder calmly.)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `When someone trusts you with a secret…` },
        { type: 'dialogue', speaker: `MAXIE`, text: `they become very generous.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `GUS`, text: `That's all it is?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `That's all it ever is.` },
        { type: 'stage-direction', text: `(She looks directly at Geoff for a moment.)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `And the most important thing about secrets…` },
        { type: 'stage-direction', text: `(lights begin shifting)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `…is knowing which ones to keep, and leveraging the ones you already have in the right way.` },
        { type: 'stage-direction', text: `— SONG: "LITTLE SECRETS" —` },
        { type: 'stage-direction', text: `Geoff and Maxie are waving at Gus's car driving away.` },
        { type: 'musical-number', speaker: `SONG`, text: `[Musical number occurs here]` },
        { type: 'dialogue', speaker: `MAXIE`, text: `That's that, huh?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Yeah.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `He's not like us the way I thought.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Will he be okay on the island alone?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Yeah.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I told him not to go into the office — just make sure it's still there.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `He understood. He'll do it.` },
        { type: 'stage-direction', text: `(A pause.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I mean, he won't — *(stops)* He'd do it. If I asked him to.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I'm not going to ask him.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Are you okay?` },
        { type: 'dialogue', speaker: `GEOFF`, text: `We can say goodbye to him on the island.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Or he can stay. If he decides he wants that.` },
        { type: 'stage-direction', text: `(Geoff watches the door Gus exited through.)` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I don't think he will.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `The world welcomes you back by stripping you of a friend.` },
        { type: 'stage-direction', text: `(Beat.)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I'd make a joke about the cruel irony, but I liked him too.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You just can't risk —` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I know. I wouldn't ask him to.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I know.` },
        { type: 'stage-direction', text: `Lights fade.` }
      ]
    },
    { 
      id: "01-09a", 
      title: "The Sidewalk Meeting", 
      summary: "Geoff meets Gus on the sidewalk and offers him a job as his personal assistant.", 
      characters: "Geoff, Gus, Officer Watson",
      hasMusic: true,
      youtubeId: "zT0aXnfWyIM",
      script: [
        { type: 'stage-direction', text: "[SECTION: 9a: Goodbye Watson]" },
        { type: 'dialogue', speaker: "WATSON", text: "Wallet." },
        { type: 'dialogue', speaker: "WATSON", text: "Phone." },
        { type: 'dialogue', speaker: "WATSON", text: "Watch." },
        { type: 'dialogue', speaker: "WATSON", text: "You're free to go." },
        { type: 'dialogue', speaker: "GEOFF", text: "Thank you, officer." },
        { type: 'stage-direction', text: "Watson reaches under the desk and produces a **small bag of coffee beans**." },
        { type: 'dialogue', speaker: "GEOFF", text: "He slides it across." },
        { type: 'dialogue', speaker: "WATSON", text: "For you." },
        { type: 'dialogue', speaker: "GEOFF", text: "Coffee?" },
        { type: 'dialogue', speaker: "WATSON", text: "From that place you mentioned." },
        { type: 'dialogue', speaker: "WATSON", text: "The one with cacao." },
        { type: 'dialogue', speaker: "WATSON", text: "Turns out it's pretty good." },
        { type: 'dialogue', speaker: "WATSON", text: "Real cacao." },
        { type: 'dialogue', speaker: "WATSON", text: "Not chocolate syrup." },
        { type: 'stage-direction', text: "Geoff pauses." },
        { type: 'dialogue', speaker: "WATSON", text: "Just because someone doesn't correct you" },
        { type: 'dialogue', speaker: "WATSON", text: "doesn't mean they didn't know you were full of shit the whole time." },
        { type: 'stage-direction', text: "Geoff picks up the bag." },
        { type: 'dialogue', speaker: "GEOFF", text: "I'll treasure it." },
        { type: 'dialogue', speaker: "WATSON", text: "Give Gus my best." },
        { type: 'dialogue', speaker: "WATSON", text: "Don't ruin him." },
        { type: 'dialogue', speaker: "WATSON", text: "He's too good for you." },
        { type: 'stage-direction', text: "Geoff turns to leave, then pauses." },
        { type: 'dialogue', speaker: "GEOFF", text: "What happens now?" },
        { type: 'dialogue', speaker: "GEOFF", text: "Retirement?" },
        { type: 'dialogue', speaker: "WATSON", text: "That's the plan." },
        { type: 'dialogue', speaker: "WATSON", text: "Thought this would be a nice easy assignment to end on." },
        { type: 'dialogue', speaker: "WATSON", text: "Protect and serve." },
        { type: 'dialogue', speaker: "GEOFF", text: "Well." },
        { type: 'dialogue', speaker: "GEOFF", text: "You did an admirable job protecting me." },
        { type: 'dialogue', speaker: "WATSON", text: "I wasn't protecting you, sir." },
        { type: 'dialogue', speaker: "WATSON", text: "I was protecting people from you." },
        { type: 'stage-direction', text: "A beat." },
        { type: 'stage-direction', text: "Geoff studies him." },
        { type: 'dialogue', speaker: "GEOFF", text: "Before you go…" },
        { type: 'dialogue', speaker: "GEOFF", text: "I never did get your first name." },
        { type: 'dialogue', speaker: "WATSON", text: "Jeffrey." },
        { type: 'stage-direction', text: "Geoff blinks." },
        { type: 'dialogue', speaker: "WATSON", text: "The American spelling." },
        { type: 'dialogue', speaker: "WATSON", text: "I know." },
        { type: 'dialogue', speaker: "WATSON", text: "A little honky-tonk." },
        { type: 'dialogue', speaker: "WATSON", text: "But it's still who I am." },
        { type: 'stage-direction', text: "Watson returns to his paperwork." },
        { type: 'dialogue', speaker: "WATSON", text: "You have a nice day, sir." },
        { type: 'stage-direction', text: "Geoff exits." },
        { type: 'stage-direction', text: "Watson watches him go." },
        { type: 'stage-direction', text: "Lights fade." }
      ]
    },
    { 
      id: "01-09b", 
      title: "Friends, Old and New", 
      summary: "Two old friends (Lila and Stacey) reunite in a DOJ corridor, leading to an impromptu first meeting between Buck Jr. and Tammy before her confirmation hearing.", 
      characters: "Lila, Stacey, Buck Jr., Tammy",
      hasMusic: false,
      script: [
        { type: 'stage-direction', text: "[SECTION: 9b: Friends, Old and New]" },
        { type: 'stage-direction', text: "## Summary" },
        { type: 'stage-direction', text: "**Narrative Beats:** Two old friends (Lila and Stacey) reunite in a DOJ corridor, leading to an impromptu first meeting between Buck Jr. and Tammy before her confirmation hearing." },
        { type: 'stage-direction', text: "**Thematic Beats:** Professional intimidation vs. competence; the weight of reputation; power dynamics in legal/political circles." },
        { type: 'stage-direction', text: "**Characters:**" },
        { type: 'stage-direction', text: "- **Lila:** Junior DOJ staffer, simultaneously terrified of and impressed by her boss Tammy; earnest, slightly overwhelmed" },
        { type: 'stage-direction', text: "- **Stacey:** Works with Buck Jr.; old friend of Lila's; mediator/witness to the Buck-Tammy encounter" },
        { type: 'stage-direction', text: "- **Buck Jr.:** Attorney; confident, strategic, deliberately informal; tests boundaries through \"hallway conversations\"" },
        { type: 'stage-direction', text: "- **Tammy:** DOJ official awaiting confirmation; formidable, exacting, controlled; commands respect through precision and stillness" },
        { type: 'stage-direction', text: "Mini Scene – DOJ Corridor (Tammy / Buck Jr.)" },
        { type: 'stage-direction', text: "Washington – DOJ Corridor Outside a Hearing Room" },
        { type: 'stage-direction', text: "Staff moving quickly. Press noise somewhere nearby." },
        { type: 'stage-direction', text: "LILA waits with a stack of folders." },
        { type: 'stage-direction', text: "STACEY approaches." },
        { type: 'dialogue', speaker: "STACEY", text: "Lila?" },
        { type: 'dialogue', speaker: "LILA", text: "Stacey?!" },
        { type: 'stage-direction', text: "They hug." },
        { type: 'dialogue', speaker: "LILA", text: "Oh my god, I haven't seen you in forever." },
        { type: 'dialogue', speaker: "STACEY", text: "You disappeared." },
        { type: 'dialogue', speaker: "LILA", text: "I didn't disappear." },
        { type: 'dialogue', speaker: "LILA", text: "I got kidnapped by the Department of Justice." },
        { type: 'dialogue', speaker: "STACEY", text: "Working for Tammy now, right?" },
        { type: 'dialogue', speaker: "LILA", text: "Yes." },
        { type: 'stage-direction', text: "(excited whisper)" },
        { type: 'dialogue', speaker: "LILA", text: "She's terrifying." },
        { type: 'dialogue', speaker: "STACEY", text: "I've heard." },
        { type: 'dialogue', speaker: "LILA", text: "No you haven't." },
        { type: 'dialogue', speaker: "LILA", text: "You've heard rumors." },
        { type: 'dialogue', speaker: "LILA", text: "She reads everything." },
        { type: 'dialogue', speaker: "LILA", text: "Footnotes." },
        { type: 'dialogue', speaker: "LILA", text: "Appendices." },
        { type: 'dialogue', speaker: "LILA", text: "One time I cited the wrong subsection and she just looked at me like—" },
        { type: 'stage-direction', text: "(demonstrates Tammy's stare)" },
        { type: 'dialogue', speaker: "LILA", text: "—and I thought my organs were shutting down." },
        { type: 'dialogue', speaker: "STACEY", text: "Lila—" },
        { type: 'dialogue', speaker: "LILA", text: "And she never raises her voice." },
        { type: 'dialogue', speaker: "LILA", text: "That's the worst part." },
        { type: 'dialogue', speaker: "LILA", text: "You just feel stupid all the time." },
        { type: 'dialogue', speaker: "LILA", text: "A voice from behind them." },
        { type: 'dialogue', speaker: "BUCK JR", text: "I imagine it's educational." },
        { type: 'dialogue', speaker: "BUCK JR", text: "They turn." },
        { type: 'dialogue', speaker: "BUCK JR", text: "Buck Jr stands there." },
        { type: 'dialogue', speaker: "STACEY", text: "Buck." },
        { type: 'dialogue', speaker: "STACEY", text: "This is Lila." },
        { type: 'dialogue', speaker: "BUCK JR", text: "Pleasure." },
        { type: 'dialogue', speaker: "LILA", text: "Oh!" },
        { type: 'dialogue', speaker: "LILA", text: "You're the attorney." },
        { type: 'dialogue', speaker: "BUCK JR", text: "One of them." },
        { type: 'dialogue', speaker: "LILA", text: "Do you have any openings?" },
        { type: 'dialogue', speaker: "LILA", text: "Because honestly if Tammy fires me I'm going to need somewhere to go." },
        { type: 'dialogue', speaker: "STACEY", text: "Lila—" },
        { type: 'dialogue', speaker: "LILA", text: "I'm serious." },
        { type: 'dialogue', speaker: "LILA", text: "She's impossible." },
        { type: 'dialogue', speaker: "LILA", text: "A calm voice behind them." },
        { type: 'dialogue', speaker: "TAMMY", text: "Is something happening here?" },
        { type: 'dialogue', speaker: "TAMMY", text: "They turn." },
        { type: 'stage-direction', text: "Tammy stands there holding a folder." },
        { type: 'dialogue', speaker: "TAMMY", text: "Still. Watching." },
        { type: 'dialogue', speaker: "LILA", text: "Ms. Tammy—" },
        { type: 'dialogue', speaker: "STACEY", text: "We were just—" },
        { type: 'dialogue', speaker: "BUCK JR", text: "Introducing ourselves." },
        { type: 'dialogue', speaker: "BUCK JR", text: "Buck Jr." },
        { type: 'dialogue', speaker: "TAMMY", text: "I know who you are." },
        { type: 'dialogue', speaker: "BUCK JR", text: "I thought it might be polite to say hello before your confirmation." },
        { type: 'dialogue', speaker: "TAMMY", text: "Professional courtesy would have been scheduling a meeting." },
        { type: 'dialogue', speaker: "BUCK JR", text: "I find hallway conversations more honest." },
        { type: 'dialogue', speaker: "TAMMY", text: "They're usually more careless." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'stage-direction', text: "Buck smiles." },
        { type: 'dialogue', speaker: "BUCK JR", text: "Congratulations, by the way." },
        { type: 'dialogue', speaker: "TAMMY", text: "Nothing has happened yet." },
        { type: 'dialogue', speaker: "BUCK JR", text: "It will." },
        { type: 'dialogue', speaker: "TAMMY", text: "We'll see." },
        { type: 'stage-direction', text: "She turns to Lila." },
        { type: 'dialogue', speaker: "TAMMY", text: "We should go." },
        { type: 'dialogue', speaker: "TAMMY", text: "Lila quickly gathers her folders." },
        { type: 'dialogue', speaker: "BUCK JR", text: "I look forward to working with you." },
        { type: 'dialogue', speaker: "TAMMY", text: "You may not." },
        { type: 'stage-direction', text: "Tammy walks away." },
        { type: 'dialogue', speaker: "TAMMY", text: "Lila hurries after her." },
        { type: 'stage-direction', text: "Buck watches them go." },
        { type: 'dialogue', speaker: "STACEY", text: "Well." },
        { type: 'dialogue', speaker: "STACEY", text: "You got your meeting." },
        { type: 'dialogue', speaker: "BUCK JR", text: "I did." },
        { type: 'stage-direction', text: "(beat)" },
        { type: 'dialogue', speaker: "BUCK JR", text: "She's good." },
        { type: 'stage-direction', text: "Lights fade." }
      ]
    },
    { 
      id: "01-09c", 
      title: "From Cuba to the Dock", 
      summary: "Gus meets Ginnie at the dock while waiting for the ferry to the island.", 
      characters: "Ginnie, Gus",
      hasMusic: true,
      script: [
        { type: 'stage-direction', text: "[SECTION: 9c: From Cuba to the Dock]" },
        { type: 'dialogue', speaker: "GINNIE", text: "You here for the island?" },
        { type: 'dialogue', speaker: "GUS", text: "Yeah." },
        { type: 'dialogue', speaker: "GINNIE", text: "Housekeeping." },
        { type: 'dialogue', speaker: "GINNIE", text: "You?" },
        { type: 'dialogue', speaker: "GUS", text: "Something like that." },
        { type: 'dialogue', speaker: "GUS", text: "She studies his outfit." },
        { type: 'dialogue', speaker: "GINNIE", text: "You working for the guy?" },
        { type: 'dialogue', speaker: "GUS", text: "Geoff?" },
        { type: 'dialogue', speaker: "GINNIE", text: "Yeah." },
        { type: 'dialogue', speaker: "GUS", text: "We've met." },
        { type: 'dialogue', speaker: "GINNIE", text: "Good luck with that." },
        { type: 'dialogue', speaker: "GUS", text: "That bad?" },
        { type: 'dialogue', speaker: "GINNIE", text: "Depends what you're there for." },
        { type: 'dialogue', speaker: "GINNIE", text: "It's good money though." },
        { type: 'dialogue', speaker: "GINNIE", text: "Just gotta get on, do what I came to do, and get out." },
        { type: 'dialogue', speaker: "GUS", text: "Temporary?" },
        { type: 'dialogue', speaker: "GINNIE", text: "Forty-eight hours." },
        { type: 'dialogue', speaker: "GINNIE", text: "Set-up crew." },
        { type: 'dialogue', speaker: "GINNIE", text: "Weekend crew." },
        { type: 'dialogue', speaker: "GINNIE", text: "Clean-up crew." },
        { type: 'dialogue', speaker: "GINNIE", text: "Nobody stays longer than they have to." },
        { type: 'dialogue', speaker: "GINNIE", text: "Good thing we're set-up." },
        { type: 'dialogue', speaker: "GINNIE", text: "We'll be gone before the crazy folk arrive." },
        { type: 'dialogue', speaker: "GUS", text: "Crazy folk?" },
        { type: 'dialogue', speaker: "GINNIE", text: "You'll see." },
        { type: 'stage-direction', text: "(lower voice)" },
        { type: 'dialogue', speaker: "GINNIE", text: "Do you know how much this guy is spending on this weekend?" },
        { type: 'dialogue', speaker: "GINNIE", text: "Buying the island." },
        { type: 'dialogue', speaker: "GINNIE", text: "Renovating everything." },
        { type: 'dialogue', speaker: "GINNIE", text: "The boats." },
        { type: 'dialogue', speaker: "GINNIE", text: "All that equipment in his office." },
        { type: 'dialogue', speaker: "GINNIE", text: "And the helicopter the new supervisor's coming in on." },
        { type: 'dialogue', speaker: "GINNIE", text: "Meanwhile we're taking the ferry." },
        { type: 'dialogue', speaker: "GINNIE", text: "Must be nice." },
        { type: 'stage-direction', text: "Ferry horn." },
        { type: 'stage-direction', text: "Workers begin boarding." },
        { type: 'dialogue', speaker: "GINNIE", text: "Maintenance ferry's next." },
        { type: 'dialogue', speaker: "GINNIE", text: "All the guys are on that one." },
        { type: 'dialogue', speaker: "GINNIE", text: "I'm housekeeping." },
        { type: 'dialogue', speaker: "GINNIE", text: "See you over there." },
        { type: 'dialogue', speaker: "GINNIE", text: "She boards." },
        { type: 'dialogue', speaker: "GINNIE", text: "The ferry pulls away." },
        { type: 'stage-direction', text: "GUS watches it go." },
        { type: 'stage-direction', text: "Helicopter rotors begin faintly in the distance." },
        { type: 'stage-direction', text: "Lights shift." }
      ]
    },
    { 
      id: "01-09d", 
      title: "Jean-Baptiste de La Cruz", 
      summary: "Gus meets JB, the island's supervisor, and sees Ginnie again.", 
      characters: "Gus, JB, Ginnie",
      hasMusic: false,
      script: [
        { type: 'stage-direction', text: "[SECTION: 9d: Jean-Baptiste de La Cruz]" },
        { type: 'dialogue', speaker: "GUS", text: "Nice to meet you, Mr. de la Cruz." },
        { type: 'dialogue', speaker: "JB", text: "Please, call me JB. Everyone does, even my wife and I would rather her not call me at all!" },
        { type: 'dialogue', speaker: "GUS", text: "And call me Gus." },
        { type: 'dialogue', speaker: "GUS", text: "They shake hands." },
        { type: 'dialogue', speaker: "JB", text: "You're here two days ahead of the weekend." },
        { type: 'dialogue', speaker: "JB", text: "Set-up crew is already working." },
        { type: 'dialogue', speaker: "JB", text: "Weekend staff arrive tomorrow." },
        { type: 'dialogue', speaker: "JB", text: "Clean-up crew follows after." },
        { type: 'dialogue', speaker: "JB", text: "Nobody stays longer than necessary." },
        { type: 'dialogue', speaker: "GUS", text: "Right." },
        { type: 'dialogue', speaker: "JB", text: "I'll be with you as much as I can." },
        { type: 'dialogue', speaker: "JB", text: "But we both have priorities." },
        { type: 'stage-direction', text: "(checking clipboard)" },
        { type: 'dialogue', speaker: "JB", text: "There's a schedule for the teams." },
        { type: 'dialogue', speaker: "JB", text: "Maintenance." },
        { type: 'dialogue', speaker: "JB", text: "Dock crew." },
        { type: 'dialogue', speaker: "JB", text: "Kitchen rotation." },
        { type: 'dialogue', speaker: "JB", text: "Housekeeping." },
        { type: 'dialogue', speaker: "JB", text: "Their supervisor is over there." },
        { type: 'stage-direction', text: "Workers pass. Ginnie struggles behind." },
        { type: 'dialogue', speaker: "JB", text: "And this is Ginnie." },
        { type: 'dialogue', speaker: "JB", text: "She's new to the staff." },
        { type: 'dialogue', speaker: "JB", text: "But she's… familiar with the island." },
        { type: 'dialogue', speaker: "JB", text: "If you know what I mean." },
        { type: 'stage-direction', text: "GUS turns." },
        { type: 'stage-direction', text: "GINNIE freezes for a moment when she recognizes him." },
        { type: 'dialogue', speaker: "GINNIE", text: "Oh." },
        { type: 'dialogue', speaker: "GINNIE", text: "Hi." },
        { type: 'dialogue', speaker: "GINNIE", text: "She moves off quickly." },
        { type: 'dialogue', speaker: "JB", text: "People come and go quickly here." },
        { type: 'dialogue', speaker: "JB", text: "Best not to get attached." },
        { type: 'dialogue', speaker: "JB", text: "He gestures toward the island." },
        { type: 'dialogue', speaker: "JB", text: "Shall we begin?" },
        { type: 'dialogue', speaker: "JB", text: "They walk into the island." },
        { type: 'stage-direction', text: "Lights shift toward the next sequence" }
      ]
    },
    { id: "01-10", title: "I Know What Happened On That Island", summary: "Gus finally speaks out.", hasMusic: true, youtubeId: "wnLDgj_xywo", script: [
        { type: 'stage-direction', text: `Scene: Outside Geoff’s Office` },
        { type: 'stage-direction', text: `Dim corridor on the island. Late evening. Quiet.` },
        { type: 'stage-direction', text: `A heavy door marked **PRIVATE**. This is Geoff’s office.` },
        { type: 'stage-direction', text: `GUS stands outside it, turning a key slowly in his fingers.` },
        { type: 'stage-direction', text: `He studies the door but doesn’t open it.` },
        { type: 'stage-direction', text: `The hallway feels wrong to him.` },
        { type: 'stage-direction', text: `He tries the handle.` },
        { type: 'stage-direction', text: `Locked.` },
        { type: 'stage-direction', text: `He looks down the corridor.` },
        { type: 'stage-direction', text: `Movement.` },
        { type: 'stage-direction', text: `GINNY appears near the end of the hall. She freezes when she sees him.` },
        { type: 'stage-direction', text: `They recognize each other.` },
        { type: 'dialogue', speaker: `GUS`, text: `You.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Dock guy.` },
        { type: 'stage-direction', text: `A small pause. The memory lands.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Earlier that day: a brief flirtation on the dock. She thought he was a worker. He thought she was housekeeping.` },
        { type: 'dialogue', speaker: `GUS`, text: `Thought you ran.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Thought you were maintenance.` },
        { type: 'dialogue', speaker: `GUS`, text: `Thought you were housekeeping.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'stage-direction', text: `Neither of them laughs.` },
        { type: 'stage-direction', text: `GUS gestures toward the office door.` },
        { type: 'dialogue', speaker: `GUS`, text: `You looking for something?` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Just cleaning.` },
        { type: 'dialogue', speaker: `GUS`, text: `In Geoff’s office.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Is that whose it is?` },
        { type: 'stage-direction', text: `Gus studies her.` },
        { type: 'dialogue', speaker: `GUS`, text: `You’re not very good at this.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `At what.` },
        { type: 'dialogue', speaker: `GUS`, text: `Whatever this is.` },
        { type: 'dialogue', speaker: `GUS`, text: `Silence hangs between them.` },
        { type: 'stage-direction', text: `Gus glances down the hall.` },
        { type: 'dialogue', speaker: `GUS`, text: `Then the thought spills out before he can stop it.` },
        { type: 'dialogue', speaker: `GUS`, text: `This place is strange.` },
        { type: 'stage-direction', text: `Ginny watches him carefully.` },
        { type: 'dialogue', speaker: `GUS`, text: `I landed yesterday.` },
        { type: 'stage-direction', text: `They tell you where you can’t go before they tell you where you can.` },
        { type: 'stage-direction', text: `He gestures to the door.` },
        { type: 'dialogue', speaker: `GUS`, text: `That door’s one of them.` },
        { type: 'stage-direction', text: `He lifts the key slightly.` },
        { type: 'dialogue', speaker: `GUS`, text: `Funny thing is…` },
        { type: 'dialogue', speaker: `GUS`, text: `they still gave me the key.` },
        { type: 'stage-direction', text: `Ginny studies him.` },
        { type: 'stage-direction', text: `Something shifts.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `You don’t know.` },
        { type: 'dialogue', speaker: `GUS`, text: `Know what.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `You work for him.` },
        { type: 'dialogue', speaker: `GUS`, text: `Yeah.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `But you don’t know.` },
        { type: 'dialogue', speaker: `GUS`, text: `Know what.` },
        { type: 'stage-direction', text: `Long pause.` },
        { type: 'stage-direction', text: `She decides.` },
        { type: 'stage-direction', text: `Music begins quietly.` },
        { type: 'musical-number', speaker: `SONG`, text: `[Musical number occurs here]` },
        { type: 'stage-direction', text: `Gus stands still.` },
        { type: 'stage-direction', text: `Everything about the island suddenly makes sense.` },
        { type: 'dialogue', speaker: `GUS`, text: `The restricted doors.` },
        { type: 'dialogue', speaker: `GUS`, text: `The strange rules.` },
        { type: 'dialogue', speaker: `GUS`, text: `The unease.` },
        { type: 'stage-direction', text: `He cannot look at her.` },
        { type: 'dialogue', speaker: `GUS`, text: `After a long moment, he turns and walks down the hall.` },
        { type: 'stage-direction', text: `He exits.` },
        { type: 'stage-direction', text: `Ginny waits until he is gone.` },
        { type: 'dialogue', speaker: `GUS`, text: `Her posture changes.` },
        { type: 'dialogue', speaker: `GUS`, text: `Efficient now.` },
        { type: 'stage-direction', text: `She slips the key from where Gus left it hanging in the lock.` },
        { type: 'stage-direction', text: `She enters the office.` },
        { type: 'dialogue', speaker: `GUS`, text: `The door closes.` },
        { type: 'stage-direction', text: `Lights shift.` },
        { type: 'stage-direction', text: `End scene.` },
        { type: 'dialogue', speaker: `GUS`, text: `**End of Ginny’s song**` },
        { type: 'dialogue', speaker: `GINNIE`, text: `You can go.` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'stage-direction', text: `Gus stands there, absorbing what he’s just heard.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `After a long beat, he reaches for the office door and unlocks it.` },
        { type: 'stage-direction', text: `The lock clicks.` },
        { type: 'stage-direction', text: `He opens the door slightly, then looks back at Ginny.` },
        { type: 'dialogue', speaker: `GUS`, text: `It appears the office requires a dusting.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `What?` },
        { type: 'dialogue', speaker: `GUS`, text: `You work in housekeeping. I assume you dust.` },
        { type: 'stage-direction', text: `Ginny nods.` },
        { type: 'dialogue', speaker: `GUS`, text: `Then dust.` },
        { type: 'stage-direction', text: `He gestures toward the office.` },
        { type: 'dialogue', speaker: `GUS`, text: `Geoff comes back tomorrow. Lots of renovation dust.` },
        { type: 'dialogue', speaker: `GUS`, text: `Hasn't been cleaned.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `I imagine it shouldn't take long.` },
        { type: 'stage-direction', text: `He gestures toward the end of the hallway.` },
        { type: 'dialogue', speaker: `GUS`, text: `I'm going to get a coffee from the kitchen.` },
        { type: 'dialogue', speaker: `GUS`, text: `Up the stairs. End of the hall.` },
        { type: 'stage-direction', text: `He leaves the door unlocked.` },
        { type: 'dialogue', speaker: `GUS`, text: `When I get back, I hope the place is properly dusted.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `And I'll lock up. Geoff would have me fired` },
        { type: 'dialogue', speaker: `GUS`, text: `if his office wasn't properly dusted.` },
        { type: 'stage-direction', text: `A small pause.` },
        { type: 'dialogue', speaker: `GUS`, text: `That was on my list, by the way.` },
        { type: 'dialogue', speaker: `GUS`, text: `Another beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `You know you shouldn't be down here.` },
        { type: 'stage-direction', text: `He points to the door.` },
        { type: 'dialogue', speaker: `GUS`, text: `Dust.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `Go.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `Don't be here when I return.` },
        { type: 'dialogue', speaker: `GUS`, text: `Then, quietly:` },
        { type: 'dialogue', speaker: `GUS`, text: `And I'm taking credit for the task.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `Understood?` },
        { type: 'stage-direction', text: `Ginny nods.` },
        { type: 'dialogue', speaker: `GUS`, text: `Good.` },
        { type: 'stage-direction', text: `He turns to leave.` },
        { type: 'dialogue', speaker: `GUS`, text: `Excuse me. My coffee is cold.` },
        { type: 'stage-direction', text: `A small gesture toward the office.` },
        { type: 'dialogue', speaker: `GUS`, text: `Now dust.` },
        { type: 'stage-direction', text: `Gus exits.` },
        { type: 'stage-direction', text: `Ginny waits.` },
        { type: 'dialogue', speaker: `GUS`, text: `Listens.` },
        { type: 'stage-direction', text: `The hallway is empty.` },
        { type: 'stage-direction', text: `She slips into the office.` },
        { type: 'dialogue', speaker: `GUS`, text: `A brief moment passes.` },
        { type: 'stage-direction', text: `She emerges again, calm but moving quickly.` },
        { type: 'stage-direction', text: `She disappears down the corridor.` },
        { type: 'dialogue', speaker: `GUS`, text: `Footsteps.` },
        { type: 'stage-direction', text: `Gus reappears holding a coffee cup.` },
        { type: 'stage-direction', text: `He approaches the office door.` },
        { type: 'stage-direction', text: `He checks the handle.` },
        { type: 'dialogue', speaker: `GUS`, text: `Unlocked.` },
        { type: 'stage-direction', text: `He nods once.` },
        { type: 'dialogue', speaker: `GUS`, text: `Good.` },
        { type: 'stage-direction', text: `He begins to lock the door.` },
        { type: 'dialogue', speaker: `GUS`, text: `Then hesitates.` },
        { type: 'stage-direction', text: `The words of the song echo in his head.` },
        { type: 'stage-direction', text: `He opens the door and steps inside.` },
        { type: 'dialogue', speaker: `GUS`, text: `The door closes behind him.` }
      ] },
    { id: "01-11", title: "Who Was That? (Preprise 2)", summary: "The mystery deepens.", hasMusic: true, youtubeId: "Y35kzg4vQBQ", script: [
        { type: 'stage-direction', text: `Morning.` },
        { type: 'stage-direction', text: `The office door opens.` },
        { type: 'stage-direction', text: `GEOFF enters casually, loosening his tie.` },
        { type: 'stage-direction', text: `He stops.` },
        { type: 'stage-direction', text: `GUS is sitting calmly in a chair with a cup of coffee.` },
        { type: 'stage-direction', text: `Waiting.` },
        { type: 'stage-direction', text: `A beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `There you are.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I've been looking everywhere for you.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I wasn't sure you'd make it in here.` },
        { type: 'stage-direction', text: `He glances around the office.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Then again… I figured if anyone would snoop, it would be you.` },
        { type: 'stage-direction', text: `Geoff pours himself a whiskey.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Little early, but you have coffee.` },
        { type: 'stage-direction', text: `He lifts the glass.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Happy hour.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `We could get Watson on the phone.` },
        { type: 'dialogue', speaker: `GUS`, text: `Not necessary.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Silence?` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Right.` },
        { type: 'stage-direction', text: `He sits.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `It'll be like he's right here with us.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `Does Watson know?` },
        { type: 'stage-direction', text: `He knows enough of my existing legal history.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `But there's been nothing new because, as you know, I've been incarcerated—` },
        { type: 'dialogue', speaker: `GUS`, text: `It was quite a sweetheart deal for you, wasn't it?` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'stage-direction', text: `Geoff studies him carefully.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `What do you want to know?` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Ask me anything.` },
        { type: 'dialogue', speaker: `GUS`, text: `Anything.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Anything.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `A longer silence.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Gus doesn't ask.` },
        { type: 'stage-direction', text: `Geoff understands the test.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I'll answer honestly.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Still nothing.` },
        { type: 'dialogue', speaker: `GUS`, text: `I spent the morning thinking.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `Funny thing about punishment.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Oh?` },
        { type: 'dialogue', speaker: `GUS`, text: `Sometimes you do the crime.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `Sometimes the universe picks something else.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You’re being dramatic.` },
        { type: 'dialogue', speaker: `GUS`, text: `But isn’t reality quite dramatic sometimes?` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `I prefer the lesser drama.` },
        { type: 'stage-direction', text: `He looks directly at Geoff.` },
        { type: 'dialogue', speaker: `GUS`, text: `And I choose to remember the man who saved me.` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'stage-direction', text: `Geoff exhales slowly.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `You're leaving.` },
        { type: 'dialogue', speaker: `GUS`, text: `Yeah.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `What will you do?` },
        { type: 'dialogue', speaker: `GUS`, text: `I leveraged my resources.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `Your friends have been handing me business cards the whole time.` },
        { type: 'dialogue', speaker: `GUS`, text: `Just in case you were ever too much.` },
        { type: 'dialogue', speaker: `GUS`, text: `Small smile.` },
        { type: 'dialogue', speaker: `GUS`, text: `I made some calls.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `I have a job.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `I found a place.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `I'll be gone by the time you get back.` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `What will you tell people?` },
        { type: 'dialogue', speaker: `GUS`, text: `Nothing.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `I don't have anything to say.` },
        { type: 'dialogue', speaker: `GUS`, text: `Another beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `When asked, I told them I was promoted…` },
        { type: 'dialogue', speaker: `GUS`, text: `and realized I'd prefer to stay statewide.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `Closer to family.` },
        { type: 'stage-direction', text: `He hesitates slightly.` },
        { type: 'dialogue', speaker: `GUS`, text: `I didn't feel the advancement of responsibilities` },
        { type: 'dialogue', speaker: `GUS`, text: `would keep me close to… my people.` },
        { type: 'stage-direction', text: `The sadness sits there.` },
        { type: 'stage-direction', text: `Geoff understands.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I know.` },
        { type: 'stage-direction', text: `Gus looks up.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I got several calls yesterday.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `People asking about you. Indirectly.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I spoke the world of you.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Said it was my fault.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `That I pushed to go international too fast.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `And that I knew how important it was for you` },
        { type: 'dialogue', speaker: `GEOFF`, text: `to stay close.` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `I told them I was sad.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `That I was losing the best assistant I ever had.` },
        { type: 'stage-direction', text: `Long pause.` },
        { type: 'stage-direction', text: `Geoff nearly loses composure.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `The best…` },
        { type: 'stage-direction', text: `Gus answers quietly.` },
        { type: 'dialogue', speaker: `GUS`, text: `The best employer I ever had.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `It was just too much in the wrong direction.` },
        { type: 'stage-direction', text: `Music begins.` },
        { type: 'musical-number', speaker: `SONG`, text: `[Musical number occurs here]` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Does it matter?` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Who is that, who walks out like he had somewhere to be?` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Who is that, like the help is someone anyone would see?` },
        { type: 'stage-direction', text: `They come, they go, they pour the drinks, they fold, they sweep the floor —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Who is that?` },
        { type: 'dialogue', speaker: `MAXIE`, text: `No one you'd remember, Ronald. Close the door.` },
        { type: 'stage-direction', text: `Ronnie exits.` },
        { type: 'stage-direction', text: `A beat.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Do you still think he was… one of us?` },
        { type: 'stage-direction', text: `He was.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'stage-direction', text: `He is.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Just the same in the wrong direction than I thought.` },
        { type: 'dialogue', speaker: `GEOFF`, text: `Scene.` }
      ] },
    { 
      id: "01-12", 
      title: "The Appointment", 
      summary: "Ronnie announces Tammy as Solicitor General, but the ceremony is interrupted by urgent news.", 
      characters: "Ronnie, Tammy, Ash, Cammy",
      hasMusic: false, 
      script: [
        { type: 'stage-direction', text: "Podium. Flags. Cameras." },
        { type: 'stage-direction', text: "RONNIE steps to the podium. Applause from staffers and press." },
        { type: 'stage-direction', text: "TAMMY stands slightly behind and to the side." },
        { type: 'stage-direction', text: "RONNIE smiles broadly." },
        { type: 'dialogue', speaker: "RONNIE", text: "Thank you. Thank you very much." },
        { type: 'dialogue', speaker: "RONNIE", text: "Today we're making an important announcement for the administration and for the country." },
        { type: 'dialogue', speaker: "RONNIE", text: "As you know, the Department of Justice has been working very hard — tremendous pressure, tremendous attacks, frankly — from people who don't like the work we're doing and don't like the results we're getting." },
        { type: 'dialogue', speaker: "RONNIE", text: "But we keep winning." },
        { type: 'dialogue', speaker: "RONNIE", text: "And when you keep winning, you need very good lawyers." },
        { type: 'dialogue', speaker: "RONNIE", text: "The best lawyers." },
        { type: 'dialogue', speaker: "RONNIE", text: "And today I'm pleased to announce the appointment of Tam- Tamuh - Tameeluh- Caldwell as Solicitor General of the United States." },
        { type: 'stage-direction', text: "Whispered" },
        { type: 'dialogue', speaker: "TAMMY", text: "Tamela." },
        { type: 'dialogue', speaker: "RONNIE", text: "Tamela? That's a name, is it? Tamela? Can't be having a name no one can pronounce." },
        { type: 'dialogue', speaker: "TAMMY", text: "Tammy is fine sir." },
        { type: 'dialogue', speaker: "RONNIE", text: "Tammy. That's a good down home American name. I like it." },
        { type: 'dialogue', speaker: "RONNIE", text: "Tammy Caldwell. I'm appointing her the Solicitor General of the United States." },
        { type: 'stage-direction', text: "Applause." },
        { type: 'dialogue', speaker: "RONNIE", text: "RONNIE gestures toward Tammy." },
        { type: 'dialogue', speaker: "RONNIE", text: "Tammy comes to us from the Southern District of New York, where she has served with distinction after earlier work in Alabama. A tremendous record. Very tough. Very sharp." },
        { type: 'dialogue', speaker: "RONNIE", text: "A lot of people in Washington like to talk about legal theory and constitutional interpretation and all of these big words." },
        { type: 'dialogue', speaker: "RONNIE", text: "Tammy actually understands them." },
        { type: 'dialogue', speaker: "RONNIE", text: "And more importantly — she understands what this administration is trying to do for the American people." },
        { type: 'dialogue', speaker: "RONNIE", text: "That's not always easy to find." },
        { type: 'dialogue', speaker: "RONNIE", text: "Some lawyers, they want to fight the government." },
        { type: 'dialogue', speaker: "RONNIE", text: "Some lawyers want to fight the president." },
        { type: 'dialogue', speaker: "RONNIE", text: "Some lawyers wake up in the morning and say, \"How do I stop the administration today?\"" },
        { type: 'dialogue', speaker: "RONNIE", text: "We've seen a lot of that." },
        { type: 'dialogue', speaker: "RONNIE", text: "But Tammy has shown something very rare in Washington." },
        { type: 'dialogue', speaker: "RONNIE", text: "Alignment." },
        { type: 'dialogue', speaker: "RONNIE", text: "She understands the legal vision of this administration and the direction we're taking the country." },
        { type: 'dialogue', speaker: "RONNIE", text: "And frankly — it's nice to have someone on our side for a change." },
        { type: 'stage-direction', text: "Some laughter in the room." },
        { type: 'dialogue', speaker: "RONNIE", text: "Now people say, \"Why Tammy?\"" },
        { type: 'dialogue', speaker: "RONNIE", text: "And there are a lot of reasons." },
        { type: 'dialogue', speaker: "RONNIE", text: "First of all, she's very talented." },
        { type: 'dialogue', speaker: "RONNIE", text: "Very talented." },
        { type: 'dialogue', speaker: "RONNIE", text: "Second — we need more women in positions like this." },
        { type: 'dialogue', speaker: "RONNIE", text: "We really do." },
        { type: 'dialogue', speaker: "RONNIE", text: "I looked around the room the other day and I said, \"Where are the women lawyers?\"" },
        { type: 'dialogue', speaker: "RONNIE", text: "And somebody said, \"Well, sir, we have Tammy.\"" },
        { type: 'dialogue', speaker: "RONNIE", text: "And I said, \"Good. Let's get Tammy up here.\"" },
        { type: 'dialogue', speaker: "RONNIE", text: "But in all seriousness, she's earned it." },
        { type: 'dialogue', speaker: "RONNIE", text: "She's tough, she's loyal, and she understands that when this administration sets a legal strategy, the job is to carry it forward." },
        { type: 'dialogue', speaker: "RONNIE", text: "That's the job." },
        { type: 'dialogue', speaker: "RONNIE", text: "And she'll do it very well." },
        { type: 'dialogue', speaker: "RONNIE", text: "We've had some people in government who think their job is to question leadership." },
        { type: 'dialogue', speaker: "RONNIE", text: "To slow things down." },
        { type: 'dialogue', speaker: "RONNIE", text: "To ask whether the president is right." },
        { type: 'dialogue', speaker: "RONNIE", text: "That's not the job." },
        { type: 'dialogue', speaker: "RONNIE", text: "The job is to win." },
        { type: 'dialogue', speaker: "RONNIE", text: "And Tammy understands winning." },
        { type: 'dialogue', speaker: "RONNIE", text: "So we're very excited about this appointment." },
        { type: 'dialogue', speaker: "RONNIE", text: "I think she's going to be tremendous." },
        { type: 'dialogue', speaker: "RONNIE", text: "Just tremendous." },
        { type: 'dialogue', speaker: "RONNIE", text: "He gestures toward her." },
        { type: 'stage-direction', text: "ASH and CAMMY, speaking almost simultaneously." },
        { type: 'dialogue', speaker: "ASH", text: "Sir—" },
        { type: 'dialogue', speaker: "CAMMY", text: "Mr. President—" },
        { type: 'dialogue', speaker: "ASH", text: "We need to speak with you—" },
        { type: 'dialogue', speaker: "CAMMY", text: "Immediately." },
        { type: 'stage-direction', text: "RONNIE pauses, annoyed." },
        { type: 'dialogue', speaker: "RONNIE", text: "Now?" },
        { type: 'dialogue', speaker: "ASH", text: "Yes, sir." },
        { type: 'dialogue', speaker: "CAMMY", text: "It's urgent." },
        { type: 'dialogue', speaker: "ASH", text: "It can't wait." },
        { type: 'dialogue', speaker: "CAMMY", text: "We need a moment." },
        { type: 'stage-direction', text: "A beat." },
        { type: 'stage-direction', text: "The room goes quiet." },
        { type: 'stage-direction', text: "RONNIE looks from them to the cameras." },
        { type: 'stage-direction', text: "Then back to them." },
        { type: 'stage-direction', text: "RONNIE forces a smile." },
        { type: 'dialogue', speaker: "RONNIE", text: "Excuse me for just a moment." },
        { type: 'stage-direction', text: "Lights shift." }
      ] 
    },
    { id: "01-13", title: "The Arrest Waltz", summary: "The law finally catches up, but with a rhythmic twist.", hasMusic: true, youtubeId: "qIVQvbwPohQ", script: [
        { type: 'stage-direction', text: `Podium. Flags. Cameras.` },
        { type: 'stage-direction', text: `RONNIE steps to the podium. Applause from staffers and press.` },
        { type: 'stage-direction', text: `TAMMY stands slightly behind and to the side.` },
        { type: 'stage-direction', text: `RONNIE smiles broadly.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Thank you. Thank you very much.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Today we’re making an important announcement for the administration and for the country.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `As you know, the Department of Justice has been working very hard — tremendous pressure, tremendous attacks, frankly — from people who don’t like the work we’re doing and don’t like the results we’re getting.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `But we keep winning.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And when you keep winning, you need very good lawyers.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `The best lawyers.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And today I’m pleased to announce the appointment of Tammy Caldwell as Solicitor General of the United States.` },
        { type: 'stage-direction', text: `Applause.` },
        { type: 'stage-direction', text: `RONNIE gestures toward Tammy.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Tammy comes to us from the Southern District of New York, where she has served with distinction after earlier work in Alabama. A tremendous record. Very tough. Very sharp.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `A lot of people in Washington like to talk about legal theory and constitutional interpretation and all of these big words.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Tammy actually understands them.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And more importantly — she understands what this administration is trying to do for the American people.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `That’s not always easy to find.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Some lawyers, they want to fight the government.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Some lawyers want to fight the president.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Some lawyers wake up in the morning and say, “How do I stop the administration today?”` },
        { type: 'dialogue', speaker: `RONNIE`, text: `We’ve seen a lot of that.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `But Tammy has shown something very rare in Washington.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Alignment.` },
        { type: 'stage-direction', text: `She understands the legal vision of this administration and the direction we’re taking the country.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And frankly — it’s nice to have someone on our side for a change.` },
        { type: 'stage-direction', text: `Some laughter in the room.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `RONNIE continues.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Now people say, “Why Tammy?”` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And there are a lot of reasons.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `First of all, she’s very talented.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Very talented.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Second — we need more women in positions like this.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `We really do.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I looked around the room the other day and I said, “Where are the women lawyers?”` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And somebody said, “Well, sir, we have Tammy.”` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And I said, “Good. Let’s get Tammy up here.”` },
        { type: 'stage-direction', text: `Light chuckles from some staff.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `But in all seriousness, she’s earned it.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `She’s tough, she’s loyal, and she understands that when this administration sets a legal strategy, the job is to carry it forward.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `That’s the job.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And she’ll do it very well.` },
        { type: 'stage-direction', text: `RONNIE glances back at Tammy.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `We’ve had some people in government who think their job is to question leadership.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `To slow things down.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `To ask whether the president is right.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `That’s not the job.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `The job is to win.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And Tammy understands winning.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `So we’re very excited about this appointment.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I think she’s going to be tremendous.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Just tremendous.` },
        { type: 'stage-direction', text: `He gestures toward her.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Tammy, if you’d like to say a few words—` },
        { type: 'stage-direction', text: `Suddenly two aides rush forward.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `ASH and CAMMY, speaking almost simultaneously.` },
        { type: 'dialogue', speaker: `ASH`, text: `Sir—` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Mr. President—` },
        { type: 'dialogue', speaker: `ASH`, text: `We need to speak with you—` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Immediately.` },
        { type: 'stage-direction', text: `RONNIE pauses, annoyed.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Now?` },
        { type: 'dialogue', speaker: `ASH`, text: `Yes, sir.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `It’s urgent.` },
        { type: 'dialogue', speaker: `ASH`, text: `It can’t wait.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We need a moment.` },
        { type: 'stage-direction', text: `A beat.` },
        { type: 'stage-direction', text: `The room goes quiet.` },
        { type: 'stage-direction', text: `RONNIE looks from them to the cameras.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Then back to them.` },
        { type: 'stage-direction', text: `RONNIE forces a smile.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Excuse me for just a moment.` },
        { type: 'stage-direction', text: `Lights shift.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `End scene.` }
      ] },
    { id: "01-Finale", title: "Finale Standard Procedure", summary: "The first act ends with the chilling realization of how the system works.", hasMusic: true, youtubeId: "YBeARM-lNeo", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
  ];

  const act2Scenes: Scene[] = [
    { 
      id: "02-01", 
      title: "Who Was That? (Part 3)", 
      summary: "The fallout begins. Maxie is in custody, but Geoff is nowhere to be found.", 
      characters: "Maxie, Tammy",
      hasMusic: true,
      youtubeId: "YmZRKBgGhaw",
      lyric: "WHO WAS THAT?\nThe one who let him go.\nWHO WAS THAT?\nThe one who didn't know.\nOr the one who knew too much\nAnd had the power and the touch\nTo make the truth a show.",
      script: [
        { type: 'musical-number', speaker: `SONG`, text: `[WHO WAS THAT - Act 2 Opener - Full cast]` }
      ]
    },
    { 
      id: "02-02", 
      title: "The Bar", 
      summary: "Gus visits a quiet bar and sees Ginnie on the news, prompting a realization.", 
      characters: "Gus, Bartender",
      hasMusic: false, 
      script: [
        { type: 'stage-direction', text: "ACT TWO, SCENE 1 — THE BAR" },
        { type: 'stage-direction', text: "A quiet bar. Sports on television — the particular mercy of a room that has nothing to do with any of this. Low light. GUS enters and sits at the bar. He doesn't look around. He already knows this is the right place. The BARTENDER is played by the same actor that played GEOFF in the first act." },
        { type: 'dialogue', speaker: "BARTENDER", text: "What can I get you?" },
        { type: 'dialogue', speaker: "GUS", text: "Whiskey—" },
        { type: 'stage-direction', text: "He stops. A beat. GUS looks more closely." },
        { type: 'dialogue', speaker: "GUS", text: "Do I - know you?" },
        { type: 'dialogue', speaker: "BARTENDER", text: "Everyone says that. It's my face. It must be on Cover Girl or something. " },
        { type: 'dialogue', speaker: "GUS", text: "Must be - Can I just get a Coke and a menu?" },
        { type: 'dialogue', speaker: "BARTENDER", text: "Sure." },
        { type: 'stage-direction', text: "The bartender pours the Coke and slides a menu across without ceremony. He turns up the TV. Sports wrapping up. Then the news." },
        { type: 'dialogue', speaker: "BARTENDER", text: "You got a team?" },
        { type: 'dialogue', speaker: "GUS", text: "Used to. You?" },
        { type: 'dialogue', speaker: "BARTENDER", text: "Yankees. And — oh, what's the hockey team." },
        { type: 'dialogue', speaker: "GUS", text: "Doesn't matter, they're all millionaires anyway." },
        { type: 'dialogue', speaker: "BARTENDER", text: "They don't care who's rooting for them. Why should I care to cheer?" },
        { type: 'stage-direction', text: "A comfortable beat. Two people who understand each other without explanation." },
        { type: 'dialogue', speaker: "BARTENDER", text: "Burger's our specialty." },
        { type: 'dialogue', speaker: "GUS", text: "What's special about it?" },
        { type: 'dialogue', speaker: "BARTENDER", text: "I make it." },
        { type: 'dialogue', speaker: "GUS", text: "I'll let you know." },
        { type: 'stage-direction', text: "The news comes on. GINNIE appears on screen — composed, standing with her lawyers, mid-statement. The bartender glances up. Something shifts in his face. Not dramatic. Just recognition." },
        { type: 'dialogue', speaker: "BARTENDER", text: "Bless her heart." },
        { type: 'stage-direction', text: "Gus looks up. Looks away. Looks back." },
        { type: 'dialogue', speaker: "GUS", text: "You know her?" },
        { type: 'dialogue', speaker: "BARTENDER", text: "Know her? She's on the news all the time. She's one of those girls — from that guy with the island. Jeff Goldberg or something - real Jewish name." },
        { type: 'dialogue', speaker: "GUS", text: "Gee-off. Geoffrey Aaron Goldstein." },
        { type: 'dialogue', speaker: "BARTENDER", text: "That's it! Gee-off? Funny way to say Jeff." },
        { type: 'dialogue', speaker: "GUS", text: "It is." },
        { type: 'dialogue', speaker: "BARTENDER", text: "Ever since that Gee-off guy went missing she's on every talk show. Standing there by herself and her lawyers, talking about what a monster he was." },
        { type: 'dialogue', speaker: "GUS", text: "Brave woman." },
        { type: 'dialogue', speaker: "BARTENDER", text: "Brave? That's one word. She's been at this a full decade. Nobody believed her. They threatened her. Someone attacked her once. She keeps going anyway. She's still standing." },
        { type: 'dialogue', speaker: "BARTENDER", text: "She's a goddamn hero, you ask me." },
        { type: 'dialogue', speaker: "GUS", text: "Yeah. She's pretty amazing." },
        { type: 'stage-direction', text: "He looks at the screen more carefully now." },
        { type: 'dialogue', speaker: "GUS", text: "Wait — this is here? Is she speaking nearby?" },
        { type: 'dialogue', speaker: "BARTENDER", text: "Nah. DC. They're releasing some of this Gee-off's guy's personal effects this week. She's up there for it. Brave, sure — but what can she do? They didn't listen for years." },
        { type: 'stage-direction', text: "quietly, almost to himself" },
        { type: 'dialogue', speaker: "GUS", text: "Why would they listen now after all this time?" },
        { type: 'dialogue', speaker: "BARTENDER", text: "Right, exactly. The people at the top don't care about who they hurt -" },
        { type: 'stage-direction', text: "GUS stands suddenly. Places a bill on the bar. Doesn't pick up the menu." },
        { type: 'dialogue', speaker: "BARTENDER", text: "Not hungry anymore?" },
        { type: 'dialogue', speaker: "GUS", text: "Nah. I got somewhere I need to be. Completely slipped my mind." },
        { type: 'stage-direction', text: "He exits. The news keeps playing. The bartender watches the door for a moment, then goes back to his work." },
        { type: 'stage-direction', text: "Lights shift." }
      ]
    },
    { 
      id: "02-03", 
      title: "Ginnie's Office", 
      summary: "Ginnie and her team discuss the lack of progress and the upcoming data dump, until an unexpected note from Gus arrives.", 
      characters: "Ginnie, Marcus, Assistant",
      hasMusic: false,
      script: [
        { type: 'stage-direction', text: "direction: *Lights shift toward Ginnie's office.**A working office. Not inspiring. Whiteboards with too much on them. Files in stacks that have developed their own logic. Coffee cups in various states of abandonment. This is a place where people have been at something for a long time.*" },
        { type: 'stage-direction', text: "GINNIE stands at the board. Two ADVOCATES — MARCUS (finances) and LESLIE (lawyer) — sit with laptops. It's morning. It feels like late." },
        { type: 'stage-direction', text: "[NOTE: Ginnie is not Joan of Arc. She's someone who had a life before this and can barely remember what it looked like. She's still standing because stopping feels like losing, not because she's fearless. Exhausted competence, not inspiration. The audience should feel the weight before they feel the hope.]" },
        { type: 'dialogue', speaker: "GINNIE", text: "Let's make this quick if we can. I was up late with a call-in show in Hawaii." },
        { type: 'dialogue', speaker: "MARCUS", text: "Hawaii? That's thousands of miles away." },
        { type: 'dialogue', speaker: "GINNIE", text: "Right. But they send representation here. They vote for the president." },
        { type: 'dialogue', speaker: "MARCUS", text: "And?" },
        { type: 'dialogue', speaker: "GINNIE", text: "And they sympathize. According to polls. The island angle — they live on several. They understand how isolating it can be. I had calls with both coasts and Chicago yesterday. Another one tonight." },
        { type: 'dialogue', speaker: "MARCUS", text: "But are these actually going to—" },
        { type: 'dialogue', speaker: "GINNIE", text: "What? What haven't we done, Marcus? Sued? Sued who? Geoff is missing. Maxie is pleading the fifth from her comfortable cell on her iPad. And the President is—" },
        { type: 'stage-direction', text: "(doing a voice)" },
        { type: 'dialogue', speaker: "MARCUS", text: "The best. The best president ever. Nobody has been more presidential." },
        { type: 'stage-direction', text: "(back to himself)" },
        { type: 'dialogue', speaker: "MARCUS", text: "How does Maxie have an iPad? You mean one of the prison tablets?" },
        { type: 'dialogue', speaker: "GINNIE", text: "iPad." },
        { type: 'stage-direction', text: "(She finds a list on her desk and reads from it flatly. This is not a new list.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "Egyptian cotton sheets. An iPad with WiFi — locked up at night, unrestricted during the day. Unlimited computer and library privileges. A medical exemption from work requirements. A small radio, not from commissary. Personal utensils. A large cup with a handle. An extra down pillow." },
        { type: 'dialogue', speaker: "MARCUS", text: "When did minimum security get a hotel program?" },
        { type: 'dialogue', speaker: "GINNIE", text: "It didn't. Most of that isn't available through any program. The minimum security facility she was transferred to almost immediately is owned by an associate — hers and Geoff's. The warden is a former sheriff. Same party, same neighborhood, same dinners and country clubs. The only reason she didn't get work release as a first offender is probably because Geoff got away." },
        { type: 'dialogue', speaker: "MARCUS", text: "How in the hell did he escape custody?" },
        { type: 'dialogue', speaker: "GINNIE", text: "He didn't escape. He was never documented en route. They have him on camera getting in the vehicle and nothing after. Footage from inside the vehicle is missing. The logs have gone missing." },
        { type: 'stage-direction', text: "(Beat. Let this land before Marcus responds.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "No one is being punished." },
        { type: 'dialogue', speaker: "MARCUS", text: "Every time something like this happens — I can't believe this is the world I live in. They fall through every crack. But the good cracks. Not the bad ones." },
        { type: 'dialogue', speaker: "LESLIE", text: "The worst usually do. I believe that." },
        { type: 'stage-direction', text: "(She turns to the board.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "So. We keep going. The data dump. What do we know?" },
        { type: 'dialogue', speaker: "LESLIE", text: "Still coming. They keep moving it, but this far past the deadline — it's practically rubbing it in Congress's face not to have released something." },
        { type: 'dialogue', speaker: "GINNIE", text: "Keep our network active. Make sure we have people ready to speak when it drops." },
        { type: 'dialogue', speaker: "LESLIE", text: "A lot of people are shaken by Geoff's disappearance. Even the most committed ones are rattled. The letters, the calls, people following them—" },
        { type: 'dialogue', speaker: "GINNIE", text: "They're our sisters and brothers. We are bonded by this. I know what they feel. If they want to stay quiet — that's okay. People cope in their own ways. Some had it worse than me. They don't want to go through it in public." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "Just keep them informed." },
        { type: 'dialogue', speaker: "MARCUS", text: "When this thing lands — hundreds of thousands of pages. Travel logs. Financial records. Correspondence. Someone has to listen this time." },
        { type: 'dialogue', speaker: "GINNIE", text: "That puts money in a room. I need a person in a room." },
        { type: 'dialogue', speaker: "LESLIE", text: "What about the island staff?" },
        { type: 'dialogue', speaker: "GINNIE", text: "Island folk. He built them an airport. A marina. A school. He didn't bother them for anything else. They're grateful. Disgusted — yes. JB helped get law enforcement there eventually. But they're grateful to the man even if they think he was little Satan." },
        { type: 'dialogue', speaker: "MARCUS", text: "So we've got nobody. Everyone's insulated." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "MARCUS", text: "Weather says blizzard this weekend." },
        { type: 'dialogue', speaker: "GINNIE", text: "Good for it." },
        { type: 'dialogue', speaker: "MARCUS", text: "Slow news cycle. People stuck inside. Nothing else to read about." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "This is our strategy. A snowstorm." },
        { type: 'dialogue', speaker: "MARCUS", text: "It's not — I mean — you're right. It's a snowstorm. I wish I had something more." },
        { type: 'stage-direction', text: "(A tired laugh from the room. Ginnie almost smiles.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "Go home." },
        { type: 'dialogue', speaker: "LESLIE", text: "Ginnie, we don't mind. We can stay, if you need." },
        { type: 'dialogue', speaker: "GINNIE", text: "I know. Go anyway. Come back tomorrow." },
        { type: 'stage-direction', text: "(They start to gather things.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "The problem isn't the documents. The documents aren't the solution either." },
        { type: 'stage-direction', text: "(Beat. She's working this out as she says it, not delivering a prepared speech.)" },
        { type: 'stage-direction', text: "[NOTE: This is not a rousing speech. She's tired and thinking out loud. The advocates have heard versions of this before. What's different tonight is that she doesn't have a next step to offer after it.]" },
        { type: 'dialogue', speaker: "LESLIE", text: "Cases like these fall apart because of neighbors. Friends. Someone who says — that story doesn't match what I saw. Nobody in this case can say that without being compromised. We need someone who was just there. Not a victim. Not a lawyer. Just — there. Ordinary enough that nobody thought to watch what he saw." },
        { type: 'dialogue', speaker: "MARCUS", text: "You are looking for a unicorn. We've ben combing through employment records and rumors for a decade - we would've noticed someone by now." },
        { type: 'stage-direction', text: "(She looks at the board.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "Go home." },
        { type: 'stage-direction', text: "(They exit. Ginnie stands alone. She uncaps the marker. Looks at the board. Caps it again.)" },
        { type: 'stage-direction', text: "(The ASSISTANT enters.)" },
        { type: 'dialogue', speaker: "MARCUS", text: "I completely forgot. Your assistant gave this note to me yesterday. It was a phone call." },
        { type: 'dialogue', speaker: "GINNIE", text: "Yesterday." },
        { type: 'dialogue', speaker: "MARCUS", text: "It was late, and we started fast this morning. It's completely my fault. " },
        { type: 'dialogue', speaker: "GINNIE", text: "I'm not mad. What is it?" },
        { type: 'stage-direction', text: "(The assistant hands her a note. Ginnie reads. A long beat.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "Wait — does this say Gus?" },
        { type: 'dialogue', speaker: "MARCUS", text: "Yeah - it looks like he's in DC. He's desperate to speak to you. Probably just another conspiracy theoriest. You know, Satanists and cannibals on Lil'Elmo type- " },
        { type: 'stage-direction', text: "(Ginnie reads the note again. Quietly.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "\"Dusting was acceptable. A person in that building heard.\"" },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "MARCUS", text: "Right - how cryptic! You think, they'd be more direct if it was so urgent." },
        { type: 'stage-direction', text: "(She stops him.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "Make coffee. Order food — a platter, something. Set up the conference room." },
        { type: 'dialogue', speaker: "MARCUS", text: "Wait, wait, what is this? Shouldn't we get Leslie in if you think this matters?" },
        { type: 'dialogue', speaker: "GINNIE", text: "It matters. Grab Leslie before she leaves. Pull the audio equipment in. We'll need audio at minimum." },
        { type: 'dialogue', speaker: "MARCUS", text: "I didn't know - if I had, I would have - I'm sorry." },
        { type: 'stage-direction', text: "(The assistant stops.)" },
        { type: 'dialogue', speaker: "GINNIE", text: "You wouldn't. It's ok. Get Leslie. " },
        { type: 'stage-direction', text: "(The assistant exits. Ginnie sits slowly with the note.)" },
        { type: 'stage-direction', text: "(She reads it one more time.)" },
        { type: 'stage-direction', text: "(A long beat.)" },
        { type: 'stage-direction', text: "(quietly, almost to herself — not a statement, a confession)" },
        { type: 'dialogue', speaker: "GINNIE", text: "I think we have our unicorn." },
        { type: 'stage-direction', text: "(Lights shift.)" }
      ]
    },
    { 
      id: "02-04", 
      title: "The Transit Hub", 
      summary: "Gus sees news about the Goldstein documents at a transit hub and changes his plans.", 
      characters: "Gus, Commuter",
      hasMusic: false,
      script: [
        { type: 'stage-direction', text: "TRANSIT HUB — DAY" },
        { type: 'stage-direction', text: "A busy DC transit station. Boards, foot traffic, the specific noise of a place built for people going somewhere. GUS enters with a bag over one shoulder, moving with purpose. He checks the board. Finds his train. Starts toward it." },
        { type: 'stage-direction', text: "A news screen stops him mid-step." },
        { type: 'stage-direction', text: "Chyron: GOLDSTEIN DOCUMENTS EXPECTED FOR RELEASE — SOURCES SAY IMMINENT" },
        { type: 'stage-direction', text: "He reads it once. Twice." },
        { type: 'stage-direction', text: "The calculation crosses his face — not slow, not dramatic. Just math. Fast, ugly math." },
        { type: 'stage-direction', text: "He checks his phone. Checks the board again. The train he just found is gone from his head." },
        { type: 'stage-direction', text: "direction: He's lost his place. The news knocked it out of him." },
        { type: 'stage-direction', text: "He stands in the middle of foot traffic, bag shifting on his shoulder, trying to reconstruct where he was going." },
        { type: 'stage-direction', text: "He can't find it." },
        { type: 'stage-direction', text: "Under his breath:" },
        { type: 'dialogue', speaker: "GUS", text: "Okay. Okay." },
        { type: 'stage-direction', text: "He sets the bag down between his feet. Digs. Past a folded paper, past a charger, past something wrapped in a shirt. He pulls out the phone." },
        { type: 'stage-direction', text: "Canary yellow. Unavoidable." },
        { type: 'stage-direction', text: "A COMMUTER passing slows slightly." },
        { type: 'dialogue', speaker: "COMMUTER", text: "Whoa. Is that the—" },
        { type: 'dialogue', speaker: "GUS", text: "It's a phone." },
        { type: 'dialogue', speaker: "COMMUTER", text: "No I know, I just haven't seen one of those yet. When did you get that?" },
        { type: 'stage-direction', text: "(already looking at the screen)" },
        { type: 'dialogue', speaker: "GUS", text: "While back." },
        { type: 'stage-direction', text: "The news is on the commuter's phone too. She's looking at the same chyron." },
        { type: 'dialogue', speaker: "COMMUTER", text: "You following this Goldstein thing? These documents dropping today—" },
        { type: 'dialogue', speaker: "GUS", text: "Which platform is the Red Line?" },
        { type: 'dialogue', speaker: "COMMUTER", text: "Disgusting, right? These people just — they get away with everything and now he's just *gone* — like how does a person just—" },
        { type: 'dialogue', speaker: "GUS", text: "I'm sorry, I'm in a hurry — which platform—" },
        { type: 'dialogue', speaker: "COMMUTER", text: "Oh — B6. Down the left corridor, second escalator." },
        { type: 'dialogue', speaker: "GUS", text: "Thank you." },
        { type: 'stage-direction', text: "He's already moving. Phone back in the bag but not as deep this time — no time." },
        { type: 'stage-direction', text: "(calling after him)" },
        { type: 'dialogue', speaker: "COMMUTER", text: "They should lock all of them up!" },
        { type: 'stage-direction', text: "Gus doesn't look back. He's already gone." },
        { type: 'stage-direction', text: "direction: *The commuter watches him go, then looks back at her phone. The chyron is still running. She shakes her head and moves on.*" },
        { type: 'stage-direction', text: "direction: *Lights shift toward Ginnie's office.*" }
      ]
    },
    { id: "02-05", title: "SNOWSTORM", summary: "The media frenzy and the cover-up collide.", hasMusic: true, youtubeId: "iJNhZs7p_2Y", script: [
        { type: 'stage-direction', text: "PRESS CONFERENCE — DAY" },
        { type: 'stage-direction', text: "A podium. Snow visible through a window behind it, just starting. CAM and ASH enter together, unhurried. They have folders they don't need. They set them down with the confidence of people who have prepared for exactly this." },
        { type: 'stage-direction', text: "The room is loud before they speak. It gets quieter when they smile." },
        { type: 'dialogue', speaker: "CAM", text: "Good morning." },
        { type: 'dialogue', speaker: "ASH", text: "Good morning." },
        { type: 'dialogue', speaker: "CAM", text: "We'll keep this brief because we know you have reading to do." },
        { type: 'stage-direction', text: "A small, warm laugh. Hers." },
        { type: 'dialogue', speaker: "ASH", text: "We were made aware this morning — along with many of you, apparently —" },
        { type: 'stage-direction', text: "He glances at several reporters with the gentle reproach of a man who is not reproaching anyone." },
        { type: 'dialogue', speaker: "ASH", text: "— that a substantial portion of the investigative files have found their way into circulation ahead of the official release window." },
        { type: 'dialogue', speaker: "CAM", text: "We share your surprise." },
        { type: 'stage-direction', text: "They do not look surprised." },
        { type: 'dialogue', speaker: "ASH", text: "We share it completely." },
        { type: 'stage-direction', text: "They do not look surprised." },
        { type: 'dialogue', speaker: "CAM", text: "We want to be clear that this office had no role in the timing or distribution of any materials currently —" },
        { type: 'stage-direction', text: "CAM glances to the window." },
        { type: 'dialogue', speaker: "CAM", text: "— circulating." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'dialogue', speaker: "ASH", text: "Beautiful day, though." },
        { type: 'stage-direction', text: "CAM looks at the snow. Almost to herself:" },
        { type: 'dialogue', speaker: "CAM", text: "It really is." },
        { type: 'stage-direction', text: "She turns back to the room. Bright." },
        { type: 'dialogue', speaker: "CAM", text: "We're happy to take questions." },
        { type: 'stage-direction', text: "The room erupts. She and Ash stand perfectly still in the noise, smiling at slightly different rates." },
        { type: 'stage-direction', text: "Music begins." },
        { type: 'dialogue', speaker: "SONG", text: "[Musical number occurs here]" },
        { type: 'dialogue', speaker: "ASH", text: "It is a beautiful day." },
        { type: 'dialogue', speaker: "CAM", text: "Naturally." },
        { type: 'dialogue', speaker: "PRESS CORPS", text: "When will the rest of the documents be released?" },
        { type: 'dialogue', speaker: "ASH", text: "Soon. Trust us, it’ll be real soon." },
        { type: 'dialogue', speaker: "CAM", text: "In the meantime, did you hear there’s a crisis in Chicago? " },
        { type: 'dialogue', speaker: "ASH", text: "The whole city is shut down. " },
        { type: 'dialogue', speaker: "CAM", text: "The storm moved so quickly and covered the city so heavily, even for Chicago." },
        { type: 'dialogue', speaker: "ASH", text: "People are without power, without heat, stuck in their cars - It's humanitarain!" },
        { type: 'dialogue', speaker: "CAM", text: "A humanitarian crisis! And an emergency!" },
        { type: 'dialogue', speaker: "ASH", text: "A national emergency!" },
        { type: 'dialogue', speaker: "PRESS CORPS", text: "In Chicago? You said Chicago? Is the storm moving this direction.." },
        { type: 'dialogue', speaker: "ASH", text: "The storm has just begun here. " },
        { type: 'dialogue', speaker: "CAM", text: "Such a beautiful day, but an accumulation is expected." },
        { type: 'dialogue', speaker: "ASH", text: "The President is already on the phone wtihy Governors and Senators-" },
        { type: 'dialogue', speaker: "CAM", text: "-and Mayors and Local Businesspeople - and all of New England might have the same -" },
        { type: 'dialogue', speaker: "ASH", text: "-accumulation! It's a crisis!" },
        { type: 'dialogue', speaker: "CAM", text: "The President is already calling it a national emergency." },
        { type: 'stage-direction', text: "The PRESS CORPS get worked up and the scene ends with the sounds of them shouting questions." }
      ] },
    { 
      id: "02-06", 
      title: "THE LEAK", 
      summary: "Tammy discovers Lila has been leaking documents to Buck and the White House.", 
      hasMusic: false,
      script: [
        { type: 'dialogue', speaker: "SETTING", text: "BEAT 2 - TAMMY'S OFFICE [FIRST NOTE]" },
        { type: 'stage-direction', text: "TAMMY is at her desk. Working. LILA enters, slightly hurried, slightly off." },
        { type: 'dialogue', speaker: "TAMMY", text: "How was your lunch?" },
        { type: 'dialogue', speaker: "LILA", text: "It was fine. You remember Stacey? The girl you met?" },
        { type: 'dialogue', speaker: "TAMMY", text: "Yes. The one that you were gossiping about the Goldstein case with. Outside the elevators. Yes, I remember." },
        { type: 'dialogue', speaker: "LILA", text: "She gave me a note." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "TAMMY", text: "She gave you a note.." },
        { type: 'dialogue', speaker: "LILA", text: "She said it was from a friend who wanted to—" },
        { type: 'dialogue', speaker: "TAMMY", text: "Who is the friend." },
        { type: 'dialogue', speaker: "LILA", text: "She didn't say exactly. Someone who works with the defense—" },
        { type: 'dialogue', speaker: "TAMMY", text: "Lila." },
        { type: 'dialogue', speaker: "LILA", text: "She said-" },
        { type: 'dialogue', speaker: "TAMMY", text: "Stop. You had lunch with a woman who was discussing an active case in a public corridor. Who then passed you a note. From someone working defense." },
        { type: 'dialogue', speaker: "LILA", text: "When you say it like that -" },
        { type: 'dialogue', speaker: "TAMMY", text: "Give me the note." },
        { type: 'stage-direction', text: "Lila hands it over. Tammy reads. Sets it down." },
        { type: 'dialogue', speaker: "TAMMY", text: "Who else did you see at lunch?" },
        { type: 'dialogue', speaker: "LILA", text: "Buck, her boss. He works in corporate defense -" },
        { type: 'dialogue', speaker: "TAMMY", text: "I know Buck. Lila. I need you to think very carefully before you answer this. Did you discuss anything about this office, these files, or this case at any point during that lunch?" },
        { type: 'stage-direction', text: "A long beat. Tammy looks at the note. Looks at Lila." },
        { type: 'dialogue', speaker: "TAMMY", text: "Go back to your desk. No notes. No lunches with the opposition. Lock it down." },
        { type: 'stage-direction', text: "Lila exits. Tammy picks up the note. Reads it again. Sets it down. Then picks up her own pen and begins writing. She is not calling anyone. She is documenting." },
        { type: 'dialogue', speaker: "SETTING", text: "BEAT 2 - TAMMY'S OFFICE [BACK FROM THE WHITE HOUSE]" },
        { type: 'stage-direction', text: "LILA enters. She is not quite late but close." },
        { type: 'dialogue', speaker: "TAMMY", text: "Where were you? We start working precisely at -" },
        { type: 'dialogue', speaker: "LILA", text: "At the White House?" },
        { type: 'dialogue', speaker: "TAMMY", text: "The - THE White House? " },
        { type: 'dialogue', speaker: "LILA", text: "The President wanted to see me." },
        { type: 'dialogue', speaker: "TAMMY", text: "Under what circumstances is the President of the United States of America calling to see Lila, the legal secretary of the Solicitor General? What could he possibly have wanted that didn't involve me? This is highly unorthodox." },
        { type: 'dialogue', speaker: "LILA", text: "Well, I didn't see him. I was in the same room and he waved. But one of his people - I don't remember their name - well, two of his people - well, they said they didn't want the cameras." },
        { type: 'dialogue', speaker: "TAMMY", text: "Lila, that is exactly why you should not go. The cameras are what keep the wheels of democracy oiled." },
        { type: 'dialogue', speaker: "LILA", text: "The wheels of - what?" },
        { type: 'dialogue', speaker: "TAMMY", text: "Transparency ensures accountability." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "TAMMY", text: "People act right when they're being watched. The closer you watch, the better they act." },
        { type: 'dialogue', speaker: "LILA", text: "Are you saying the cops are watching me? I didn't do nothing!" },
        { type: 'dialogue', speaker: "TAMMY", text: "No. Citizens have the right to privacy. The President is a publicly elected official." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "TAMMY", text: "Well - the note?" },
        { type: 'stage-direction', text: "Lila hands it over. Tammy reads. Her expression doesn't change. That's the tell." },
        { type: 'dialogue', speaker: "TAMMY", text: "How long were you there?" },
        { type: 'dialogue', speaker: "LILA", text: "Maybe twenty minutes? They were very efficient." },
        { type: 'dialogue', speaker: "TAMMY", text: "Mmhmm." },
        { type: 'dialogue', speaker: "LILA", text: "They said the President -" },
        { type: 'dialogue', speaker: "TAMMY", text: "Who else did you speak to?" },
        { type: 'dialogue', speaker: "LILA", text: "No one. They were very -" },
        { type: 'dialogue', speaker: "TAMMY", text: "Efficient." },
        { type: 'dialogue', speaker: "LILA", text: "...Yes." },
        { type: 'stage-direction', text: "Beat. Tammy folds the note once. Sets it on the desk face down." },
        { type: 'dialogue', speaker: "TAMMY", text: "Lila. If the President contacts this office again - by any means, through any person, in any format -  you come to me first. Before you go anywhere. Before you say anything to anyone." },
        { type: 'dialogue', speaker: "LILA", text: "Even if -" },
        { type: 'dialogue', speaker: "TAMMY", text: "Especially if. Proper communication from the President should come through transparent channels. The communications between the President and I should be auditable. Anything else is ethically dubious and legally suspect. Back-channeling through my legal secretary is - " },
        { type: 'dialogue', speaker: "LILA", text: "...Highly unorthodox?" },
        { type: 'dialogue', speaker: "TAMMY", text: "Exactly. It puts your job at risk, and mine. " },
        { type: 'stage-direction', text: "(Beat. Almost gentle.)" },
        { type: 'dialogue', speaker: "TAMMY", text: "You're not in trouble. But you will be if it happens again." },
        { type: 'stage-direction', text: "Lila nods and exits. Tammy looks at the note on her desk. Doesn't pick it up. Music begins." },
        { type: 'dialogue', speaker: "SETTING", text: "BEAT 3 - CORRIDOR [BUCK]" },
        { type: 'stage-direction', text: "BUCK is there when LILA comes out. STACEY nearby. It looks like a coincidence. It isn't." },
        { type: 'dialogue', speaker: "BUCK", text: "Your help has been vital in helping my client. Those documents you provided — I wanted to thank you. The President wanted to thank you personally." },
        { type: 'dialogue', speaker: "LILA", text: " She's such a nit picky old bitch. She treats me like I don't know nothing. I'm a grown ass woman. " },
        { type: 'dialogue', speaker: "BUCK", text: "Right. Well, we're going to get you out of there as soon as this unpleasantness is over. But we need you there now." },
        { type: 'dialogue', speaker: "LILA", text: "What do you need from me? I mean, what does the President need from me?" },
        { type: 'dialogue', speaker: "BUCK", text: "Shhh. Never mention to anyone that the President is involved at all. You understand me?" },
        { type: 'stage-direction', text: "Lila nods. Buck smiles. Stacey watches from a little distance, catching just enough." },
        { type: 'dialogue', speaker: "SETTING", text: "TAMMY'S OFFICE" },
        { type: 'stage-direction', text: "LILA enters with another note." },
        { type: 'dialogue', speaker: "LILA", text: "A note. " },
        { type: 'dialogue', speaker: "TAMMY", text: "What — what have I said about this? Who is delivering these? Where are you getting them?" },
        { type: 'dialogue', speaker: "LILA", text: "I went to lunch - alone. Buck just walked up, said 'hey' and dropped this next to my pasta. I didn't look - I didn't go looking for him." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "LILA", text: "What? You said they're from the President. What was I supposed to do? " },
        { type: 'dialogue', speaker: "TAMMY", text: "He's not — Lila, what if there's anthrax?" },
        { type: 'dialogue', speaker: "LILA", text: "There's not, though. And wouldn't I get the anthrax first? I figure you'd probably want the note anyways, better bring it to you than dump it in the trash. " },
        { type: 'stage-direction', text: "Lila turns back toward the filing area. Sees a pile of folders." },
        { type: 'dialogue', speaker: "LILA", text: "These need to be filed?" },
        { type: 'dialogue', speaker: "TAMMY", text: "Yes. Lock and key, Lila. Lock. And. Key." },
        { type: 'stage-direction', text: "Tammy returns to her work. We watch Lila carry the folders to her desk. She opens the top folder. Reads a page. Reads another. Removes half the documents. Tucks them into her bag. Files the rest away. Picks up her phone." },
        { type: 'dialogue', speaker: "LILA", text: "Buck? Yeah. I have a present for you." },
        { type: 'stage-direction', text: "Lights shift." },
        { type: 'dialogue', speaker: "SETTING", text: "CORRIDOR [BUCK 2]" },
        { type: 'dialogue', speaker: "BUCK", text: "We shouldn't meet twice in a day." },
        { type: 'dialogue', speaker: "LILA", text: "You said you needed more. Do you want them or not?" },
        { type: 'stage-direction', text: "Buck looks around. Takes the folder. Doesn't open it." },
        { type: 'dialogue', speaker: "BUCK", text: "How many people touch these before they get to you?" },
        { type: 'dialogue', speaker: "LILA", text: "Just me. I file everything. I was only able to grab about half - I can't be seen taking all of the files at once -" },
        { type: 'stage-direction', text: "He pockets the folder." },
        { type: 'dialogue', speaker: "BUCK", text: "These are the originals." },
        { type: 'dialogue', speaker: "LILA", text: "Well, yea, I didn't have time to make copies." },
        { type: 'dialogue', speaker: "BUCK", text: "Don't do that again. Copies only. Make the time." },
        { type: 'dialogue', speaker: "LILA", text: "Fine. Sorry. I didn't—" },
        { type: 'dialogue', speaker: "BUCK", text: "It's fine. You did well." },
        { type: 'stage-direction', text: "That lands on her exactly the way he intended." },
        { type: 'dialogue', speaker: "BUCK", text: "The President is very pleased." },
        { type: 'dialogue', speaker: "LILA", text: "Yeah?" },
        { type: 'dialogue', speaker: "BUCK", text: "How much access do you have to the filing system after hours?" },
        { type: 'dialogue', speaker: "LILA", text: "I mean. I have the key." },
        { type: 'dialogue', speaker: "BUCK", text: "Good." },
        { type: 'stage-direction', text: "He straightens. Warm smile." },
        { type: 'dialogue', speaker: "BUCK", text: "It's going to be a good year for both us, Lila" },
        { type: 'stage-direction', text: "He walks away. She watches him go. The folder is gone. She stands there a moment. Then picks up her phone." },
        { type: 'dialogue', speaker: "SETTING", text: "TAMMY'S OFFICE" },
        { type: 'dialogue', speaker: "BUCK", text: "Tammy at her desk. She reaches for a file. Opens the drawer. Closes it. Opens it again. Counts. A long, very still beat." },
        { type: 'stage-direction', text: "(into phone)" },
        { type: 'dialogue', speaker: "TAMMY", text: "Pull the access log for the filing room going back thirty days." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "TAMMY", text: "Yes, all of it." },
        { type: 'stage-direction', text: "She hangs up. Looks at the drawer. Looks at the door to the outer office where Lila sits. Does not look away." },
        { type: 'dialogue', speaker: "SETTING", text: "BEAT 4 - UPSTAIRS [CORRIDOR]" },
        { type: 'stage-direction', text: "LILA enters the corridor. She's been staying late. She's jumpy, pleased with herself, running on the story Buck has given her about who she is." },
        { type: 'dialogue', speaker: "LILA", text: "Sorry I'm late.She's been watching me like a hawk." },
        { type: 'dialogue', speaker: "BUCK", text: "It's okay. My office works late. You should get used to it." },
        { type: 'stage-direction', text: "He looks around." },
        { type: 'dialogue', speaker: "BUCK", text: "We should go somewhere more discrete." },
        { type: 'stage-direction', text: "(excited)" },
        { type: 'dialogue', speaker: "LILA", text: "Janitor's closet?" },
        { type: 'dialogue', speaker: "BUCK", text: "Perfect." },
        { type: 'dialogue', speaker: "LILA", text: "I brought copies this time. " },
        { type: 'dialogue', speaker: "BUCK", text: "Shhh. Wait." },
        { type: 'stage-direction', text: "They move toward the closet. Lights shift." },
        { type: 'stage-direction', text: "TAMMY stands with an two SECURITY officers - the actors that play ASH and CAM dressed up as SECURITY. Calm. She has been calm since she started counting folders." },
        { type: 'dialogue', speaker: "TAMMY", text: "According to the phone logs, they were going to meet on this floor." },
        { type: 'dialogue', speaker: "SECURITY 1", text: "Buck's not new. This seems juvenile. Why not use a cell phone?" },
        { type: 'dialogue', speaker: "TAMMY", text: "She's got a personal line — so she can field phone calls about her kids and their daycare. She told him it was her personal number. I don't think she thought we would be monitoring the phone lines." },
        { type: 'dialogue', speaker: "SECURITY 2", text: "She thought you gave her a private unmonitored phone line from your office? And Buck didn't double check. Feels sloppy." },
        { type: 'dialogue', speaker: "TAMMY", text: "Like he's sure he's gonna get away with it no matter what." },
        { type: 'dialogue', speaker: "SECURITY 1", text: "You're right. That sounds like Buck, all right. His father, too." },
        { type: 'dialogue', speaker: "SECURITY 2", text: "His father, too." },
        { type: 'stage-direction', text: "A sound from down the corridor." },
        { type: 'dialogue', speaker: "TAMMY", text: "The closet?" },
        { type: 'stage-direction', text: "The officer nods. They move to the closet door. Tammy knocks twice. Official. Unhurried." },
        { type: 'dialogue', speaker: "TAMMY", text: "Ms. Lila." },
        { type: 'stage-direction', text: "Silence." },
        { type: 'dialogue', speaker: "TAMMY", text: "Mr. Buck." },
        { type: 'stage-direction', text: "A beat. Then the sound of shuffling. Papers. Something falling. The door opens. LILA. BUCK. The folder between them, half open. Nobody speaks for a moment. Buck recovers first. Of course he does." },
        { type: 'dialogue', speaker: "BUCK", text: "Madame Solicitor." },
        { type: 'dialogue', speaker: "TAMMY", text: "Counselor. Don't. " },
        { type: 'stage-direction', text: "TAMMY looks at LILA" },
        { type: 'dialogue', speaker: "TAMMY", text: "You'll accompany security out of the building. I will have them go through your desk in the morning and return any personal effects. Please be aware anything may be withheld as part of an investigation. They will be in contact with you. You will surrender your badge, key, and other means of access immediately. You will retain, for now, your personal effects after security has gone through them. " },
        { type: 'dialogue', speaker: "LILA", text: "I can explain—" },
        { type: 'dialogue', speaker: "TAMMY", text: "I know you can. You'll have the opportunity to do that with the appropriate parties. Officer?" },
        { type: 'stage-direction', text: "TAMMY gestures to SECURITY. " },
        { type: 'dialogue', speaker: "SECUIRTY 1", text: "Ma'am-" },
        { type: 'stage-direction', text: "LILA looks at BUCK." },
        { type: 'dialogue', speaker: "LILA", text: "You said—" },
        { type: 'dialogue', speaker: "BUCK", text: "This is on you, pretty girl. You were just a piece of ass. I told you not to get ahead of yourself." },
        { type: 'stage-direction', text: "LILA's face drops as she's led away. " },
        { type: 'dialogue', speaker: "TAMMY", text: "Your client is missing, Mr. Buck." },
        { type: 'dialogue', speaker: "BUCK", text: "My client's interests persist regardless of—" },
        { type: 'dialogue', speaker: "TAMMY", text: "Your client is missing, and you just burned that poor girl. I can't save her, Buck, and she's going to have a rough time finding work from here on out. " },
        { type: 'dialogue', speaker: "BUCK", text: "She volunteered. It was my intention to collect as much evidence-" },
        { type: 'dialogue', speaker: "TAMMY", text: "Stop. I'd speak with a lawyer before you gave a statement. " },
        { type: 'dialogue', speaker: "BUCK", text: "I don't need to. " },
        { type: 'stage-direction', text: "He picks up the folder. Looks at it." },
        { type: 'dialogue', speaker: "BUCK", text: "You'll want this back." },
        { type: 'stage-direction', text: "He holds it out. Tammy doesn't take it." },
        { type: 'dialogue', speaker: "TAMMY", text: "The officer will take it." },
        { type: 'stage-direction', text: "Buck hands it over. Straightens his jacket." },
        { type: 'dialogue', speaker: "BUCK", text: "You're very good at your job, Counselor." },
        { type: 'dialogue', speaker: "TAMMY", text: "I know." },
        { type: 'stage-direction', text: "BUCK  leaves. Tammy stands in the hallway. The officer looks at her." },
        { type: 'dialogue', speaker: "SECURITY 2", text: "We'll finish up the reports and forward it to your office." },
        { type: 'dialogue', speaker: "TAMMY", text: "Great. thank you. Make it quick. I have to make an announcement. Stick to the facts and include all the evidence you have." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "SECURITY 2", text: "It's gonna be that big of a deal?" },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "TAMMY", text: "Possibly. Maybe. I hope not. Just make sure your paperwork is meticulous. No more mistakes." },
        { type: 'stage-direction', text: "The officer nods and goes. Tammy stands alone in the corridor. Looks at the closet door, still open. Looks at the empty desk through the glass where Lila sat." },
        { type: 'stage-direction', text: "Lights shift." }
      ]
    },
    { 
      id: "02-07", 
      title: "CONTAINMENT", 
      summary: "Ash and Cammie discuss containment with Ronnie in the Oval Office.", 
      hasMusic: false,
      script: [
        {
          "type": "stage-direction",
          "text": "The White House Oval Office. ASH and CAMMIE are already inside — comfortable in a space that isn't theirs."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "She named them."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Our informant."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "She didn't name us. She only named—"
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "The President. And with documentation."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Not on schedule."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "But conveniently timed."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "The snowstorm was very useful."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Kept everything quiet."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "It was such a beautiful day."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "So naturally natural."
        },
        {
          "type": "stage-direction",
          "text": "The snowstorm was the story."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Made all the allegations seem like—"
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Like a hoax."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Like a witch hunt."
        },
        {
          "type": "stage-direction",
          "text": "(They smile together.)"
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "But we cannot have this happen again. We cannot risk—"
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "—our position and our duty to the country."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "And to the President."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Yes, the President. We are doing our duty first to the country, then to the President."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "I thought it was first to the President and then to the country."
        },
        {
          "type": "stage-direction",
          "text": "The President represents the country."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "And we represent the country. So really—"
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "We should be doing our duty to the country that includes us and is represented by the President."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "A-men."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Sh. Freedom of religion."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Not freedom *from* religion."
        },
        {
          "type": "stage-direction",
          "text": "(The door opens. RONNIE enters.)"
        },
        {
          "type": "stage-direction",
          "text": "RONNIE What — what are you guys doing in my office? Did I miss a meeting? You've got me all over the gosh-darn place. First the East Wing to meet with Sultan Ali Baba of Timbuktu — with the special envoy from Oogadish — where the hell are these people coming from?"
        },
        {
          "type": "stage-direction",
          "text": "Cammie and Ash exchange the smallest possible look. This happens every time."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Those are our allies, sir."
        },
        {
          "type": "stage-direction",
          "text": "They're in my office every other Tuesday—"
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Wednesday."
        },
        {
          "type": "stage-direction",
          "text": "RONNIE —and nobody tells me their names ahead of time. I've got the little cards but I can never read them because my glasses are always—"
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "We'll have the cards laminated."
        },
        {
          "type": "stage-direction",
          "text": "RONNIE Larger font."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Larger font."
        },
        {
          "type": "stage-direction",
          "text": "RONNIE And then the Second Lady wants a photo with every single one of them and I'm standing there like a—"
        },
        {
          "type": "stage-direction",
          "text": "(He stops. Looks around.)"
        },
        {
          "type": "stage-direction",
          "text": "RONNIE Why are you in my office?"
        },
        {
          "type": "stage-direction",
          "text": "Beat."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "We're concerned about some recent developments."
        },
        {
          "type": "stage-direction",
          "text": "The Solicitor General — what's her name?"
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Tommy—"
        },
        {
          "type": "stage-direction",
          "text": "(amused)"
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Tammy."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Yes. Tammy."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Among others."
        },
        {
          "type": "stage-direction",
          "text": "She can't do that. Can she do that? I mean, I expect my word to be treated as law. There is no legal basis for her coming out and saying all of these terrible things that I did — or anyone did. It's like she doesn't *want* us to do them. I'm the President."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "You are the President, sir."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "And we agree that she shouldn't be able to do that."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "But she did."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "It might even be unconstitutional."
        },
        {
          "type": "stage-direction",
          "text": "RONNIE I don't know about all that unconstitutional whack-a-roo. The Constitution's older than even my predecessor. I don't like many things that measure their age in three digits — hell, two digits is pushing it sometimes. But that little piece of paper has done some good around here. I'm not a lawyer, so unconstitutional is — it's a bit much. I think it's a bit much. It's an old document, but like fine wine it's getting better with age. It's just — it's unreasonable."
        },
        {
          "type": "stage-direction",
          "text": "(Ash and Cammie look at each other.)"
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "It can be both unreasonable and unconstitutional, sir."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Yes, sir — we agree it's unreasonable, as you said. But—"
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "It could also be unconstitutional. We could make it—"
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "We should make sure that—"
        },
        {
          "type": "stage-direction",
          "text": "RONNIE What are you two getting at? I swear I can never tell which one of you to look at. It's like one of you is the good eye and the other one is the lazy eye on a single person. I'm never sure which one I should focus on."
        },
        {
          "type": "stage-direction",
          "text": "(He dances back and forth between them — joking, but also a little cornered as they move closer together.)"
        },
        {
          "type": "stage-direction",
          "text": "RONNIE Look at this eye. Look at *this* eye. It's just too darn confusing. Isn't one of you her boss? Isn't one of you in the FBI? Or the CIA? Homeland Security?"
        },
        {
          "type": "stage-direction",
          "text": "(weakly)"
        },
        {
          "type": "stage-direction",
          "text": "RONNIE Agriculture? Veteran's Affairs?"
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Sir."
        },
        {
          "type": "stage-direction",
          "text": "They move toward him. Not menacing. Just together. Like weather."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "We're here to discuss—"
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "—how we make sure this doesn't happen again."
        },
        {
          "type": "stage-direction",
          "text": "Beat."
        },
        {
          "type": "stage-direction",
          "text": "She went to the press."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Yes."
        },
        {
          "type": "stage-direction",
          "text": "RONNIE With documentation."
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Yes."
        },
        {
          "type": "stage-direction",
          "text": "RONNIE On a Tuesday."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Wednesday."
        },
        {
          "type": "stage-direction",
          "text": "RONNIE When everybody was paying attention."
        },
        {
          "type": "stage-direction",
          "text": "Beat."
        },
        {
          "type": "stage-direction",
          "text": "The word we're using—"
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "—going forward—"
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "—is containment."
        },
        {
          "type": "stage-direction",
          "text": "Ronnie looks at one, then the other."
        },
        {
          "type": "stage-direction",
          "text": "RONNIE Containment."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Containment."
        },
        {
          "type": "stage-direction",
          "text": "A beat. Ronnie nods slowly, like he's been given a gift he doesn't entirely understand."
        },
        {
          "type": "stage-direction",
          "text": "RONNIE I like that word. That's a very strong word. Very — presidential."
        },
        {
          "type": "stage-direction",
          "text": "(quietly)"
        },
        {
          "type": "dialogue",
          "speaker": "ASH",
          "text": "Very presidential."
        },
        {
          "type": "dialogue",
          "speaker": "CAMMIE",
          "text": "Very reasonable, Mr. President."
        },
        {
          "type": "stage-direction",
          "text": "Lights shift."
        }
      ]
    },
    { id: "02-08", title: "What Did You Do?", summary: "A confrontation between Geoff and Maxie.", hasMusic: true, youtubeId: "08OeZlI8uf8", script: [
        { type: 'stage-direction', text: `The White House Oval Office. ASH and CAMMIE are already inside — comfortable in a space that isn't theirs.` },
        { type: 'dialogue', speaker: `ASH`, text: `She named them.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Our informant.` },
        { type: 'dialogue', speaker: `ASH`, text: `She didn't name us. She only named—` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The President. And with documentation.` },
        { type: 'dialogue', speaker: `ASH`, text: `Not on schedule.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `But conveniently timed.` },
        { type: 'dialogue', speaker: `ASH`, text: `The snowstorm was very useful.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Kept everything quiet.` },
        { type: 'dialogue', speaker: `ASH`, text: `It was such a beautiful day.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `So naturally natural.` },
        { type: 'stage-direction', text: `The snowstorm was the story.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Made all the allegations seem like—` },
        { type: 'dialogue', speaker: `ASH`, text: `Like a hoax.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Like a witch hunt.` },
        { type: 'stage-direction', text: `(They smile together.)` },
        { type: 'dialogue', speaker: `ASH`, text: `But we cannot have this happen again. We cannot risk—` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `—our position and our duty to the country.` },
        { type: 'dialogue', speaker: `ASH`, text: `And to the President.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Yes, the President. We are doing our duty first to the country, then to the President.` },
        { type: 'dialogue', speaker: `ASH`, text: `I thought it was first to the President and then to the country.` },
        { type: 'stage-direction', text: `The President represents the country.` },
        { type: 'dialogue', speaker: `ASH`, text: `And we represent the country. So really—` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We should be doing our duty to the country that includes us and is represented by the President.` },
        { type: 'dialogue', speaker: `ASH`, text: `A-men.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Sh. Freedom of religion.` },
        { type: 'dialogue', speaker: `ASH`, text: `Not freedom *from* religion.` },
        { type: 'stage-direction', text: `(The door opens. RONNIE enters.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `What — what are you guys doing in my office? Did I miss a meeting? You've got me all over the gosh-darn place. First the East Wing to meet with Sultan Ali Baba of Timbuktu — with the special envoy from Oogadish — where the hell are these people coming from?` },
        { type: 'stage-direction', text: `Cammie and Ash exchange the smallest possible look. This happens every time.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Those are our allies, sir.` },
        { type: 'stage-direction', text: `They're in my office every other Tuesday—` },
        { type: 'dialogue', speaker: `ASH`, text: `Wednesday.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `—and nobody tells me their names ahead of time. I've got the little cards but I can never read them because my glasses are always—` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We'll have the cards laminated.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Larger font.` },
        { type: 'dialogue', speaker: `ASH`, text: `Larger font.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And then the Second Lady wants a photo with every single one of them and I'm standing there like a—` },
        { type: 'stage-direction', text: `(He stops. Looks around.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Why are you in my office?` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We're concerned about some recent developments.` },
        { type: 'stage-direction', text: `The Solicitor General — what's her name?` },
        { type: 'dialogue', speaker: `ASH`, text: `Tommy—` },
        { type: 'stage-direction', text: `(amused)` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Tammy.` },
        { type: 'dialogue', speaker: `ASH`, text: `Yes. Tammy.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Among others.` },
        { type: 'stage-direction', text: `She can't do that. Can she do that? I mean, I expect my word to be treated as law. There is no legal basis for her coming out and saying all of these terrible things that I did — or anyone did. It's like she doesn't *want* us to do them. I'm the President.` },
        { type: 'dialogue', speaker: `ASH`, text: `You are the President, sir.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And we agree that she shouldn't be able to do that.` },
        { type: 'dialogue', speaker: `ASH`, text: `But she did.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `It might even be unconstitutional.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I don't know about all that unconstitutional whack-a-roo. The Constitution's older than even my predecessor. I don't like many things that measure their age in three digits — hell, two digits is pushing it sometimes. But that little piece of paper has done some good around here. I'm not a lawyer, so unconstitutional is — it's a bit much. I think it's a bit much. It's an old document, but like fine wine it's getting better with age. It's just — it's unreasonable.` },
        { type: 'stage-direction', text: `(Ash and Cammie look at each other.)` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `It can be both unreasonable and unconstitutional, sir.` },
        { type: 'dialogue', speaker: `ASH`, text: `Yes, sir — we agree it's unreasonable, as you said. But—` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `It could also be unconstitutional. We could make it—` },
        { type: 'dialogue', speaker: `ASH`, text: `We should make sure that—` },
        { type: 'dialogue', speaker: `RONNIE`, text: `What are you two getting at? I swear I can never tell which one of you to look at. It's like one of you is the good eye and the other one is the lazy eye on a single person. I'm never sure which one I should focus on.` },
        { type: 'stage-direction', text: `(He dances back and forth between them — joking, but also a little cornered as they move closer together.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Look at this eye. Look at *this* eye. It's just too darn confusing. Isn't one of you her boss? Isn't one of you in the FBI? Or the CIA? Homeland Security?` },
        { type: 'stage-direction', text: `(weakly)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Agriculture? Veteran's Affairs?` },
        { type: 'dialogue', speaker: `ASH`, text: `Sir.` },
        { type: 'stage-direction', text: `They move toward him. Not menacing. Just together. Like weather.` },
        { type: 'dialogue', speaker: `ASH`, text: `We're here to discuss—` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `—how we make sure this doesn't happen again.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'stage-direction', text: `She went to the press.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Yes.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `With documentation.` },
        { type: 'dialogue', speaker: `ASH`, text: `Yes.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `On a Tuesday.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Wednesday.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `When everybody was paying attention.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'stage-direction', text: `The word we're using—` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `—going forward—` },
        { type: 'dialogue', speaker: `ASH`, text: `—is containment.` },
        { type: 'stage-direction', text: `Ronnie looks at one, then the other.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Containment.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Containment.` },
        { type: 'stage-direction', text: `A beat. Ronnie nods slowly, like he's been given a gift he doesn't entirely understand.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I like that word. That's a very strong word. Very — presidential.` },
        { type: 'stage-direction', text: `(quietly)` },
        { type: 'dialogue', speaker: `ASH`, text: `Very presidential.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Very reasonable, Mr. President.` },
        { type: 'stage-direction', text: `Lights shift.` }
      ] },
    { id: "02-09", title: "Just Like Them, Just Like Me", summary: "Gus realizes his own complicity.", hasMusic: true, youtubeId: "wdesqA9Er9c", script: [
        { type: 'stage-direction', text: `Gus enters the reception area. A FRONT DESK WORKER looks up.` },
        { type: 'dialogue', speaker: `GUS`, text: `I'm here to see Ginnie. She's expecting me.` },
        { type: 'stage-direction', text: `Ginnie enters from the inner office. She stops when she sees him. A beat.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `You came.` },
        { type: 'dialogue', speaker: `GUS`, text: `You said you'd see me.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `I did. *(beat)* I have to be honest with you — I'm not sure I understand what you're doing here. Last I knew you were his.` },
        { type: 'dialogue', speaker: `GUS`, text: `Vice President of Operations and Logistics. Secretary of the Board of Directors of the Goldstein Foundation. Director of People and Human —` },
        { type: 'dialogue', speaker: `GINNIE`, text: `That's not helping.` },
        { type: 'dialogue', speaker: `GUS`, text: `No. I figured.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `*(to front desk)* Push my next appointment. *(to Gus)* We're in the conference room. I have a few people with me — my assistant, our counsel. Is that —` },
        { type: 'dialogue', speaker: `GUS`, text: `Fine. I'm going to have to explain myself to a lot more people than this.` },
        { type: 'stage-direction', text: `Ginnie looks at him a beat longer than necessary.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Come on back.` },
        { type: 'stage-direction', text: `Conference room.* **Ginnie** *at the head of the table. MARCUS, her assistant, and the LAWYER present. Gus sits across from them, slightly outnumbered.` },
        { type: 'dialogue', speaker: `GUS`, text: `I want to testify. I can speak to his connections — the schedules, the flights, the requests, who asked for what. I didn't witness anything directly but I know the architecture of it. The names. The patterns. There's a man I met in Florida —` },
        { type: 'dialogue', speaker: `MARCUS`, text: `You went to the Florida property?` },
        { type: 'dialogue', speaker: `GUS`, text: `Once. Late in my time there. And the island — just once, to oversee setup before it opened. That's where I met —` },
        { type: 'dialogue', speaker: `LAWYER`, text: `So to be clear. You lived in his New York house and saw nothing. You visited the Florida property and arranged nothing. You went to the island before it was operational.` },
        { type: 'dialogue', speaker: `GUS`, text: `I met a man they called the Prince —` },
        { type: 'dialogue', speaker: `MARCUS`, text: `Prince Rashid Muhammad al-Salaam.` },
        { type: 'dialogue', speaker: `GUS`, text: `He wanted — young company. He was very specific about it. I thought I'd misunderstood him.` },
        { type: 'dialogue', speaker: `LAWYER`, text: `And you drove him to his departing flight and left it at that.` },
        { type: 'dialogue', speaker: `GUS`, text: `Yes.` },
        { type: 'dialogue', speaker: `LAWYER`, text: `*(beat)* Mr. Gus. You were present every day. You had full access. And you're asking us to believe you saw nothing, did nothing, suspected nothing — during the exact window he was home and legally unable to operate, after which you left and the crimes resumed.` },
        { type: 'dialogue', speaker: `GUS`, text: `I didn't — I never put it together that way.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `I know. That's actually the only reason we're still talking. *(beat)* But we're not the hard part. The world is a lot less patient than we are. And there's still the question of your history.` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'dialogue', speaker: `LAWYER`, text: `You want to address that or should we.` },
        { type: 'dialogue', speaker: `GUS`, text: `No. Ask. It'll come out anyway.` },
        { type: 'dialogue', speaker: `LAWYER`, text: `Why did you wait so long to come forward?` },
        { type: 'dialogue', speaker: `GUS`, text: `*(quietly)* Because the minute my record came out, the questions would start. And I'd lose everything again. I'd go back to being —` },
        { type: 'stage-direction', text: `(He stops. The room waits.)` },
        { type: 'dialogue', speaker: `GUS`, text: `Why did I delay.` },
        { type: 'stage-direction', text: `(He says it like he's only now hearing himself.)` },
        { type: 'stage-direction', text: `(Song: "Just Like Them")` },
        { type: 'musical-number', speaker: `SONG`, text: `[Musical number occurs here]` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Mr. Gus. We appreciate you coming. Truly. And if we need you to testify, we'll call. But we can't have you speak for this organization. Even if everything you've said is completely true — and I'm not saying it isn't — you'll be discredited before you finish your first sentence. You'd be written off. Honestly, coming forward publicly may hurt you more than it helps us. Go home. We'll be in touch.` },
        { type: 'dialogue', speaker: `GUS`, text: `*(quietly)* Okay.` },
        { type: 'stage-direction', text: `He picks up his coat. Moves toward the door. It opens before he reaches it.` },
        { type: 'stage-direction', text: `STACY enters, stops short.` },
        { type: 'dialogue', speaker: `STACEY`, text: `Gus. Oh my God.` },
        { type: 'dialogue', speaker: `GUS`, text: `Stacy.` },
        { type: 'dialogue', speaker: `STACEY`, text: `*(to the room, lighting up)* Do you know who this is? This man is — *(back to Gus)* — I quit. I quit Buck Jr.'s office this morning. I can't work here officially, conflict of interest, but I wanted to help somehow and — *(grabbing his arm)* — you're here. You're actually here. I always knew you weren't one of them. You were always so kind to me. You actually talked to me. You treated me like a person.` },
        { type: 'dialogue', speaker: `GUS`, text: `*(gently)* It's good to see you too. I just — I was just leaving.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `*(slowly)* Wait. How do you know him?` },
        { type: 'dialogue', speaker: `STACEY`, text: `Gus was Geoff’s assistant. About thirteen months while Geoff was incarcerated. He was meticulous, professional, never once crossed a line. I was in and out of that house for Buck Jr. the whole time. He was just — he was genuinely a good person doing a job.` },
        { type: 'stage-direction', text: `Ginnie looks at Gus. Something shifts.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Sit back down.` },
        { type: 'stage-direction', text: `Gus sits. He reaches into his jacket, almost apologetically.` },
        { type: 'dialogue', speaker: `GUS`, text: `Look — I know it's not much. But I have his contacts. His schedule. There might be emails. I thought maybe it could help somehow —` },
        { type: 'stage-direction', text: `He sets a bright canary yellow phone on the table.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `*(leaning forward)* Where did you get that?` },
        { type: 'dialogue', speaker: `GUS`, text: `Geoff gave it to me. Beta model, very connected, he said. I've been using it since I left.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `*(very still)* He gave you his phone. And you've had it this whole time.` },
        { type: 'dialogue', speaker: `GUS`, text: `He never asked for it back.` },
        { type: 'stage-direction', text: `Ginnie and Marcus look at each other.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Mr. Gus. I think you just gave us a significantly better reason to keep you around. *(to Stacy)* And you. What exactly were you planning to do here today?` },
        { type: 'dialogue', speaker: `STACEY`, text: `Whatever you need.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `*(a beat, almost a smile)* You already did it.` }
      ] },
    { id: "02-10", title: "Arrestable", summary: "Gus faces the news coverage and a meeting with Ginnie about what comes next.", hasMusic: false, script: [
        { type: 'stage-direction', text: `Stacey looks at Gus for a long moment.` },
        { type: 'dialogue', speaker: `STACEY`, text: `For what it's worth.` },
        { type: 'dialogue', speaker: `STACEY`, text: `You're the only person in any of this` },
        { type: 'dialogue', speaker: `STACEY`, text: `who actually showed up` },
        { type: 'dialogue', speaker: `STACEY`, text: `without being paid to.` },
        { type: 'stage-direction', text: `She picks up her bag.` },
        { type: 'stage-direction', text: `That's not nothing.` },
        { type: 'stage-direction', text: `She exits.` },
        { type: 'stage-direction', text: `Gus sits alone with the phone.` },
        { type: 'stage-direction', text: `Lights narrow.` },
        { type: 'stage-direction', text: `Then the newsreels begin.` },
        { type: 'dialogue', speaker: `STACEY`, text: `[NEWSREEL SEQUENCE - music under, television static and cuts]` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 1`, text: `...as the Goldstein documents continue` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 1`, text: `to circulate online,` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 1`, text: `legal experts close to the case` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 1`, text: `are asking whether Solicitor General Caldwell,` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 1`, text: `newly appointed and already embattled,` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 1`, text: `is simply in over her head—` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 2`, text: `—the documents name dozens of prominent figures,` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 2`, text: `but the identity of one individual` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 2`, text: `referred to only as "G"` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 2`, text: `continues to elude investigators—` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `Look, I'm not saying it's Geoff.` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `I'm saying they'd have wanted someone like Geoff` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `to blame someone else if it went south—` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `It cannot be Geoff.` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `Look at the handwriting. Look at the pen.` },
        { type: 'stage-direction', text: `The pressure is completely different—` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `Oh, you're a handwriting expert now—` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `I'm just saying—` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 3`, text: `—Solicitor General Caldwell` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 3`, text: `has issued a second plea for patience` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 3`, text: `as she continues to review the documents` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 3`, text: `largely alone,` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 3`, text: `after a leak rocked her office` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 3`, text: `within weeks of her appointment` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 3`, text: `and left her without` },
        { type: 'dialogue', speaker: `ANCHOR - CHANNEL 3`, text: `a significant portion of her staff—` },
        { type: 'dialogue', speaker: `TALKING HEAD 3`, text: `I'm telling you, the G is bigger than Geoff.` },
        { type: 'dialogue', speaker: `TALKING HEAD 3`, text: `The Secretary of Transportation.` },
        { type: 'dialogue', speaker: `TALKING HEAD 3`, text: `It's all logistics. Who else has that access?` },
        { type: 'stage-direction', text: `He's gay. What's he doing with Geoff?` },
        { type: 'dialogue', speaker: `TALKING HEAD 3`, text: `Good cover.` },
        { type: 'stage-direction', text: `The newsreel cuts. Gus is standing in his apartment. The television is on. He hasn't moved.` },
        { type: 'stage-direction', text: `His coat is still on.` },
        { type: 'stage-direction', text: `He has been here for a long time.` },
        { type: 'stage-direction', text: `He checks his train.` },
        { type: 'stage-direction', text: `Just math. Fast, ugly math.` },
        { type: 'stage-direction', text: `He checks his phone. Checks the board again. The train he just found is gone from his head.` },
        { type: 'stage-direction', text: `He's lost his place. The news knocked it out of him.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Good cover.` },
        { type: 'stage-direction', text: `She picks up a document. Reads. Sets it down.` },
        { type: 'stage-direction', text: `Lights shift.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `[GINNIE'S OFFICE - CONTINUOUS]` },
        { type: 'stage-direction', text: `Gus sits. Ginnie across from him. Marcus standing. The newsreel murmurs from somewhere offstage, barely audible.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `I understand if you don't want to do this.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Because your —` },
        { type: 'stage-direction', text: `(careful)` },
        { type: 'dialogue', speaker: `GINNIE`, text: `— your history will come out.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `And I —` },
        { type: 'dialogue', speaker: `GUS`, text: `And I lose everything.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `What?` },
        { type: 'dialogue', speaker: `GUS`, text: `It's not just the history.` },
        { type: 'dialogue', speaker: `GUS`, text: `It's not just the shame.` },
        { type: 'dialogue', speaker: `GUS`, text: `It's back to the street.` },
        { type: 'dialogue', speaker: `GUS`, text: `Back to the milk crate.` },
        { type: 'stage-direction', text: `Nobody saves you twice.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `GUS`, text: `I know. Let's not dwell on it.` },
        { type: 'dialogue', speaker: `GUS`, text: `I've made my peace.` },
        { type: 'dialogue', speaker: `GUS`, text: `But let's not —` },
        { type: 'stage-direction', text: `We have to. For a minute.` },
        { type: 'dialogue', speaker: `GUS`, text: `Can we —` },
        { type: 'dialogue', speaker: `MARCUS`, text: `You're going to be arrested` },
        { type: 'dialogue', speaker: `MARCUS`, text: `when you turn it in.` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'dialogue', speaker: `GUS`, text: `Arrested for what.` },
        { type: 'dialogue', speaker: `GUS`, text: `I didn't do anything.` },
        { type: 'stage-direction', text: `(immediately, earnestly)` },
        { type: 'stage-direction', text: `We believe you.` },
        { type: 'stage-direction', text: `(a beat slower)` },
        { type: 'stage-direction', text: `We... do.` },
        { type: 'stage-direction', text: `(continues)` },
        { type: 'dialogue', speaker: `MARCUS`, text: `The optics.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `You're his assistant.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `You have a record.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `Your name appears nowhere` },
        { type: 'dialogue', speaker: `MARCUS`, text: `in a million pages of documents.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `All they have is a G.` },
        { type: 'stage-direction', text: `The newsreel drifts in from somewhere. Muted. Indistinct.` },
        { type: 'stage-direction', text: `They're going to think I did something.` },
        { type: 'stage-direction', text: `They're going to think you did everything, Gus.` },
        { type: 'stage-direction', text: `He stares at her.` },
        { type: 'dialogue', speaker: `GUS`, text: `I don't understand.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `You came out of nowhere while he was incarcerated.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `You ran the house.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `You went to the island.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `You disappeared when the files went public.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `And now you've surfaced with a phone` },
        { type: 'dialogue', speaker: `MARCUS`, text: `full of God knows what.` },
        { type: 'stage-direction', text: `They think —` },
        { type: 'dialogue', speaker: `GUS`, text: `Oh god.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `You came out of the shadows to do the work.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `And returned to the shadows when it was done.` },
        { type: 'stage-direction', text: `They think I'm his —` },
        { type: 'stage-direction', text: `(can't finish it)` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Associate. At minimum.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `And if they're feeling less generous —` },
        { type: 'stage-direction', text: `Silence.` },
        { type: 'dialogue', speaker: `GUS`, text: `Obstruction.` },
        { type: 'stage-direction', text: `Nobody answers. That's the answer.` },
        { type: 'dialogue', speaker: `GUS`, text: `I'm going to be arrested.` },
        { type: 'stage-direction', text: `(a flash of anger)` },
        { type: 'dialogue', speaker: `GUS`, text: `Again.` },
        { type: 'stage-direction', text: `(quieter, the real wound)` },
        { type: 'dialogue', speaker: `GUS`, text: `But I didn't —` },
        { type: 'dialogue', speaker: `GUS`, text: `I didn't know —` },
        { type: 'dialogue', speaker: `GUS`, text: `I didn't know what any of it —` },
        { type: 'stage-direction', text: `They don't know that.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `And the world isn't going to believe you` },
        { type: 'dialogue', speaker: `MARCUS`, text: `before it decides not to.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `You have to be ready.` },
        { type: 'stage-direction', text: `Gus sits with that. His face does several things. None of them resolve.` },
        { type: 'dialogue', speaker: `GUS`, text: `I need to think.` },
        { type: 'stage-direction', text: `He stands. Walks out.` },
        { type: 'stage-direction', text: `Marcus moves to follow.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Don't you dare.` },
        { type: 'stage-direction', text: `Marcus stops.` },
        { type: 'stage-direction', text: `He got here once.` },
        { type: 'stage-direction', text: `She looks at the door.` },
        { type: 'stage-direction', text: `(barely)` },
        { type: 'stage-direction', text: `He knows the way back.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'stage-direction', text: `(quieter still)` },
        { type: 'dialogue', speaker: `GINNIE`, text: `I hope he does.` },
        { type: 'stage-direction', text: `The newsreel rises again from offstage. Louder now. Insistent.` },
        { type: 'stage-direction', text: `Lights shift into the pressure sequence.` }
      ] },
    { id: "02-11", title: "Big Pharaoh Thruxton the Third", summary: "A media storm over Big Pharaoh Thruxton dominates the news cycle, pulling focus from the Goldstein files.", hasMusic: false, script: [
        { type: 'stage-direction', text: `[NEWSREEL - rising from the pressure sequence music]` },
        { type: 'stage-direction', text: `[SUGGESTED STAGE DRESSING: The Washington Monument visible through the upstage window, center frame. Never referenced. Never lit for emphasis. Simply present for the duration of the scene.]` },
        { type: 'dialogue', speaker: `ANCHOR`, text: `In entertainment news tonight — Grammy-winning producer and rap mogul Big Pharaoh Thruxton, born Marcus DeShawn Pullman of Compton, has been arrested at his Bel Air compound after federal investigators declared the property a crime scene.` },
        { type: 'dialogue', speaker: `ANCHOR`, text: `Fresh allegations describe what witnesses refer to as drug- and alcohol-fueled binge parties called Thoth Downs in Big Pharoah Thruxton’s Thothiverse, the name given to his secret guest house on the property, where young industry hopefuls were required to perform in what lawyers are describing as live performances of an artistic nature as Thruxton’s Thoths, each assigned their own Thoth Title to the amusement and pleasure of celebrity guests for access and exposure to other entertainment industry figures.` },
        { type: 'dialogue', speaker: `ANCHOR`, text: `Wow. Those certainly are some serious allegations. Tell me, do we have any video or audio - or even images of these parties? If I’m like every other American, I think it’s important to see who exactly participated.` },
        { type: 'dialogue', speaker: `SETTING`, text: `[GINNIE's OFFICE]` },
        { type: 'dialogue', speaker: `GINNIE`, text: `What does this — mean for us?` },
        { type: 'dialogue', speaker: `MARCUS`, text: `It pulls the news cycle. Everyone will be tuned in.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `But those people. Those young artists. Those kids who just wanted —` },
        { type: 'dialogue', speaker: `MARCUS`, text: `The crime is done. We need to make sure it never happens again. Justice.` },
        { type: 'stage-direction', text: `(uncertain)` },
        { type: 'dialogue', speaker: `GINNIE`, text: `And justice doesn’t exist in the dark.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `Transparency keeps everyone honest.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `So this is — good for us?` },
        { type: 'dialogue', speaker: `MARCUS`, text: `I hate it.` },
        { type: 'stage-direction', text: `(Hesitantly Grossly Optimistic)` },
        { type: 'dialogue', speaker: `MARCUS`, text: `But it might be.` },
        { type: 'dialogue', speaker: `SETTING`, text: `White House. Conference Room. ASH and CAM stand silent next to a map. RONNIE enters - eating.` },
        { type: 'dialogue', speaker: `ASH`, text: `Mr. President. We are ready to deploy.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Boots are on the ground.` },
        { type: 'dialogue', speaker: `ASH`, text: `Sails are jibbed.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Gurneys are rolling.` },
        { type: 'dialogue', speaker: `ASH`, text: `Cannons are foddered.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Troops are waiting, sir.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Waiting for what? Who are we invading? Did we get attacked? I told the Secretary of Defense —` },
        { type: 'stage-direction', text: `War, sir. Secretary of War` },
        { type: 'stage-direction', text: `You changed it. A week ago.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Did I? Well, I told that old drunk to let me know first thing if something goes boom. When did we decide to attack?` },
        { type: 'dialogue', speaker: `ASH`, text: `This morning, sir.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The staff meeting.` },
        { type: 'dialogue', speaker: `ASH`, text: `You were present.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `I mean — you were —` },
        { type: 'dialogue', speaker: `ASH`, text: `Absorbing.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Demonstrating quiet strength.` },
        { type: 'dialogue', speaker: `ASH`, text: `Leading stoically.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `It was frankly moving, sir.` },
        { type: 'dialogue', speaker: `ASH`, text: `Inspired all of us.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Inspiring? To - what country are we invading - or defending ourselves against - or making an example of - give me the highlights. I'm a little foggy. I'm assuming it's a country — or is this one of those cave situations where we're bombing a mountain somewhere —` },
        { type: 'dialogue', speaker: `ASH`, text: `A country, sir.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `They said very bad things about you.` },
        { type: 'dialogue', speaker: `ASH`, text: `Because of the files.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Called you names. Internationally.` },
        { type: 'dialogue', speaker: `ASH`, text: `We can't have that.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And they have —` },
        { type: 'dialogue', speaker: `ASH`, text: `Conveniently —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `So much oil.` },
        { type: 'dialogue', speaker: `ASH`, text: `And the country next door has been very friendly.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And is willing to let us build a pipline from this country to that and right through a military base of ours.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `You said they're saying things about me? Who are they? I'll get them on the phone! They can't talk about me like that! Secretary - do you think State would do this? Get me the Secretary of State, have that pretty little secretary - oh are we supposed to call them executive assistants now. I'm the President!` },
        { type: 'dialogue', speaker: `ASH`, text: `Yes, sir.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We agree. Very disrespectful.` },
        { type: 'dialogue', speaker: `ASH`, text: `But in the meantime —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The troops are staged.` },
        { type: 'dialogue', speaker: `ASH`, text: `And your company does have property there.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Beachfront.` },
        { type: 'dialogue', speaker: `ASH`, text: `Beautiful location for a —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Resort.` },
        { type: 'dialogue', speaker: `ASH`, text: `And then of course the —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Oil fields.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Well that is a whole bunch of convenient things lined up in a row. They disrespected the country —that's what that is, disrespecting the country — they're blocking American energy independence,and you're telling me we have property there already — why aren't we bombing them yesterday?` },
        { type: 'dialogue', speaker: `ASH`, text: `Exactly what you suggested in the meeting this morning.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Broadcasted on your social media immediately after. Very well received.` },
        { type: 'stage-direction', text: `The newsreel cuts back in.` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `Big Pharaoh Thruxton the Third's press office has released a statement categorically denying any connection between the artist and President Ronnie, as well as any known association with Geoffrey Goldstein or Maxie Laurent — despite the artist's name appearing forty-seven times in the Goldstein documents. The feeling in Los Angeles tonight is difficult to describe.` },
        { type: 'stage-direction', text: `(staring at the screen)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `This happened today?` },
        { type: 'dialogue', speaker: `ASH`, text: `Sir —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Isn't monitoring this literally one of your jobs?` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Technically —` },
        { type: 'dialogue', speaker: `ASH`, text: `We feel the invasion demonstrates that the business of the country —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Cannot be derailed —` },
        { type: 'dialogue', speaker: `ASH`, text: `By liberal elitists —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `In California.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `No no no no no. We table the invasion.` },
        { type: 'dialogue', speaker: `ASH`, text: `Sir —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The resort —` },
        { type: 'dialogue', speaker: `ASH`, text: `The oil —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `We turn every single resource we have to this Mogul-whatsahooie situation. He goes down, we stay up. That is the whole strategy. Someone write that down. What are we doing - what am I doing - if not to make sure history remembers me as the kind of great leader that inspires his staff in his sleep!` },
        { type: 'dialogue', speaker: `ASH`, text: `Stoically leading.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Slumberly leadership, sir.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Whatever` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And someone find out what he said about me in those documents.` },
        { type: 'stage-direction', text: `RONNIE exits. Ash and Cammie stand in front of the map. The country they were going to invade sits there, labeled.` },
        { type: 'dialogue', speaker: `ASH`, text: `The troops are just — standing there.` },
        { type: 'stage-direction', text: `(quietly)` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `In formation.` },
        { type: 'dialogue', speaker: `ASH`, text: `Will they get tired?` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We should feed them, perhaps.` },
        { type: 'dialogue', speaker: `ASH`, text: `It's a lot of people to just —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `I'll send them home.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `ASH`, text: `Which home?` },
        { type: 'stage-direction', text: `Cammie looks at the map.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Ohio?` },
        { type: 'dialogue', speaker: `ASH`, text: `All of them?` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Where else do they come from?` },
        { type: 'dialogue', speaker: `ASH`, text: `Daytona. That's Ohio, right?` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Dayton is Ohio. Daytona is Florida.` },
        { type: 'dialogue', speaker: `ASH`, text: `And?` },
        { type: 'stage-direction', text: `Lights shift. Newsreel rises. Into the song.` },
        { type: 'dialogue', speaker: `SETTING`, text: `[A BAR - WASHINGTON D.C. - NIGHT]` },
        { type: 'stage-direction', text: `Dark. Quiet. A television in the corner, muted. Gus enters, looks around, finds a stool. The BARTENDER has his back turned. When he turns around —It's the same face. Different name tag. Different city. Same face. It's the actor that played Geoff!` },
        { type: 'dialogue', speaker: `GUS`, text: `Don't I — know you from somewhere?` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `Everyone says that. I have that kind of face. What can I get you? I've vodka, diet soda, and water.` },
        { type: 'dialogue', speaker: `GUS`, text: `That's all?` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `You got lucky. It's happy hour.` },
        { type: 'dialogue', speaker: `GUS`, text: `It's 11am.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `I'm happy. It'll last about an hour. Happy. Hour.` },
        { type: 'dialogue', speaker: `GUS`, text: `I'll have a diet soda.` },
        { type: 'stage-direction', text: `[NEWSREEL - muted, closed captions running]` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `BIG PHARAOH THRUXTON III — NEW DETAILS. NO MENTION OF GOLDSTEIN FILES.` },
        { type: 'dialogue', speaker: `GUS`, text: `Funny how fast the cycle turns.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `Lucky for that other guy. What was his name? Some Jew. I'm not antisemitic, but he was very Jewish.` },
        { type: 'dialogue', speaker: `GUS`, text: `Goldstein. Gee-offrrey Goldstein.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `That's it. Very Jewish. What is it with all the rich weirdos lately? Whatever happened to a good old-fashioned creepy high school gym teacher? You always knew what you were dealing with. Kept it contained. A perv was a perv and the neighborhood knew it.` },
        { type: 'dialogue', speaker: `GUS`, text: `That's an — odd take.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `I'm just saying. Everyone should keep their bedroom in their bedroom. Door shuts — hey, whose business is it?` },
        { type: 'dialogue', speaker: `GUS`, text: `Are you suggesting we pick a fall guy and blame it all on him because he creeps us out? And then we can do - whatever we want?` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `The creep's gonna be there anyway. And besides — these rock stars? They got paid. Fully reimbursed for their — what would you call it — trauma. It's not like they were children, more the - the barely legal type. Like sixteen or fifteen - but that's the lowest, I'll bet. It's not like they're eight or something. Whole different class.` },
        { type: 'dialogue', speaker: `GUS`, text: `I don't think it is.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `Come on, they get money, fame. Everyone knows about casting couches. The parents knew, I bet - let them go! And if the parents say it's ok, who am I? And the money! That should be enough. I mean, he's not exactly a handsome man, this Pharaoh character, but for the kind of money they were offered — I mean, honestly, I might even su—` },
        { type: 'dialogue', speaker: `GUS`, text: `Stop. Just. No.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `That's the point. They're just afraid of saying so! Everyone thinks so but all these activist out there asking for kids to be pampered-` },
        { type: 'dialogue', speaker: `GUS`, text: `No - just - I don't - no.` },
        { type: 'stage-direction', text: `GUS puts down the glass. Stands. Leaves money on the bar. Walks out.` },
        { type: 'dialogue', speaker: `GUS`, text: `What the fuck. What a fucking creep.` },
        { type: 'stage-direction', text: `The bartender watches him go. Picks up the glass. Rinses it.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `Probably one of those creeps.` },
        { type: 'stage-direction', text: `Lights shift.` },
        { type: 'dialogue', speaker: `SETTING`, text: `[TAMMY'S OFFICE - LATE]` },
        { type: 'stage-direction', text: `Documents everywhere. Multiple stacks. Color-coded. She has been here for days. The newsreel plays on a small screen on her desk.` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `The stage appears to be set in the Pharaoh Thruxton case, but with no witnesses coming forward, questions are mounting about whether this is a legitimate prosecution or an overeager attorney general on a political witch hunt.` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `President Ronnie has thrown his full support behind the investigation, and both the DOJ and FBI have pledged their cooperation.` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `The same agencies have faced criticism in recent months for their handling — or lack thereof — of the Goldstein matter.` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `Where are we on that, exactly?` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `Still waiting on Solicitor General Caldwell to make a call.` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `She's still sitting on it? How long has it been?` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `She's had the files a month.` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `But the leak —` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `Oh, the leak. Yes. What a disaster.` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `Heads are going to roll. Someone has to be accountable.` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `Do they?` },
        { type: 'stage-direction', text: `Tammy reaches over. Clicks it off. For the first time all scene. Silence.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `They do.` },
        { type: 'stage-direction', text: `(looks at the stack)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `I'm just not sure I have enough to hold anyone accountable.` },
        { type: 'stage-direction', text: `She picks up a document. Sets it down. Picks up another.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `If I bring it now — with what I have — I lose. And if I lose — But if I wait —` },
        { type: 'stage-direction', text: `(she doesn't finish it)` },
        { type: 'stage-direction', text: `She stands. Walks to the window. Looks out at nothing.` },
        { type: 'stage-direction', text: `(she doesn't finish that one either) She goes back to the desk. Sits. Opens the next file. The television screen sits dark. The stack doesn't get smaller.` }
      ] },
    { id: "02-12", title: "A Park Bench", summary: "Gus navigates to the DOJ while Tammy and Stacey have a tense coffee exchange. A musical number leads to Gus and Tammy meeting on a park bench outside a church — strangers finding unlikely common ground.", hasMusic: true, youtubeId: "Jk3R5NF6eqs", script: [
        { type: 'stage-direction', text: `[NEWSREEL - rising from the pressure sequence music]` },
        { type: 'stage-direction', text: `[SUGGESTED STAGE DRESSING: The Washington Monument visible through the upstage window, center frame. Never referenced. Never lit for emphasis. Simply present for the duration of the scene.]` },
        { type: 'dialogue', speaker: `ANCHOR`, text: `In entertainment news tonight — Grammy-winning producer and rap mogul Big Pharaoh Thruxton, born Marcus DeShawn Pullman of Compton, has been arrested at his Bel Air compound after federal investigators declared the property a crime scene.` },
        { type: 'dialogue', speaker: `ANCHOR`, text: `Fresh allegations describe what witnesses refer to as drug- and alcohol-fueled binge parties called Thoth Downs in Big Pharoah Thruxton's Thothiverse, the name given to his secret guest house on the property, where young industry hopefuls were required to perform in what lawyers are describing as live performances of an artistic nature as Thruxton's Thoths, each assigned their own Thoth Title to the amusement and pleasure of celebrity guests for access and exposure to other entertainment industry figures.` },
        { type: 'dialogue', speaker: `ANCHOR`, text: `Wow. Those certainly are some serious allegations. Tell me, do we have any video or audio - or even images of these parties? If I'm like every other American, I think it's important to see who exactly participated.` },
        { type: 'dialogue', speaker: `SETTING`, text: `[GINNIE's OFFICE]` },
        { type: 'dialogue', speaker: `GINNIE`, text: `What does this — mean for us?` },
        { type: 'dialogue', speaker: `MARCUS`, text: `It pulls the news cycle. Everyone will be tuned in.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `But those people. Those young artists. Those kids who just wanted —` },
        { type: 'dialogue', speaker: `MARCUS`, text: `The crime is done. We need to make sure it never happens again. Justice.` },
        { type: 'stage-direction', text: `(uncertain)` },
        { type: 'dialogue', speaker: `GINNIE`, text: `And justice doesn't exist in the dark.` },
        { type: 'dialogue', speaker: `MARCUS`, text: `Transparency keeps everyone honest.` },
        { type: 'dialogue', speaker: `GINNIE`, text: `So this is — good for us?` },
        { type: 'dialogue', speaker: `MARCUS`, text: `I hate it.` },
        { type: 'stage-direction', text: `(Hesitantly Grossly Optimistic)` },
        { type: 'dialogue', speaker: `MARCUS`, text: `But it might be.` },
        { type: 'dialogue', speaker: `SETTING`, text: `White House. Conference Room. ASH and CAM stand silent next to a map. RONNIE enters - eating.` },
        { type: 'dialogue', speaker: `ASH`, text: `Mr. President. We are ready to deploy.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Boots are on the ground.` },
        { type: 'dialogue', speaker: `ASH`, text: `Sails are jibbed.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Gurneys are rolling.` },
        { type: 'dialogue', speaker: `ASH`, text: `Cannons are foddered.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Troops are waiting, sir.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Waiting for what? Who are we invading? Did we get attacked? I told the Secretary of Defense —` },
        { type: 'dialogue', text: `War, sir. Secretary of War` },
        { type: 'dialogue', text: `You changed it. A week ago.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Did I? Well, I told that old drunk to let me know first thing if something goes boom. When did we decide to attack?` },
        { type: 'dialogue', speaker: `ASH`, text: `This morning, sir.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The staff meeting.` },
        { type: 'dialogue', speaker: `ASH`, text: `You were present.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `I mean — you were —` },
        { type: 'dialogue', speaker: `ASH`, text: `Absorbing.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Demonstrating quiet strength.` },
        { type: 'dialogue', speaker: `ASH`, text: `Leading stoically.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `It was frankly moving, sir.` },
        { type: 'dialogue', speaker: `ASH`, text: `Inspired all of us.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Inspiring? To - what country are we invading - or defending ourselves against - or making an example of - give me the highlights. I'm a little foggy. I'm assuming it's a country — or is this one of those cave situations where we're bombing a mountain somewhere —` },
        { type: 'dialogue', speaker: `ASH`, text: `A country, sir.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `They said very bad things about you.` },
        { type: 'dialogue', speaker: `ASH`, text: `Because of the files.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Called you names. Internationally.` },
        { type: 'dialogue', speaker: `ASH`, text: `We can't have that.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And they have —` },
        { type: 'dialogue', speaker: `ASH`, text: `Conveniently —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `So much oil.` },
        { type: 'dialogue', speaker: `ASH`, text: `And the country next door has been very friendly.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And is willing to let us build a pipline from this country to that and right through a military base of ours.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `You said they're saying things about me? Who are they? I'll get them on the phone! They can't talk about me like that! Secretary - do you think State would do this? Get me the Secretary of State, have that pretty little secretary - oh are we supposed to call them executive assistants now. I'm the President!` },
        { type: 'dialogue', speaker: `ASH`, text: `Yes, sir.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We agree. Very disrespectful.` },
        { type: 'dialogue', speaker: `ASH`, text: `But in the meantime —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The troops are staged.` },
        { type: 'dialogue', speaker: `ASH`, text: `And your company does have property there.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Beachfront.` },
        { type: 'dialogue', speaker: `ASH`, text: `Beautiful location for a —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Resort.` },
        { type: 'dialogue', speaker: `ASH`, text: `And then of course the —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Oil fields.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Well that is a whole bunch of convenient things lined up in a row. They disrespected the country —that's what that is, disrespecting the country — they're blocking American energy independence,and you're telling me we have property there already — why aren't we bombing them yesterday?` },
        { type: 'dialogue', speaker: `ASH`, text: `Exactly what you suggested in the meeting this morning.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Broadcasted on your social media immediately after. Very well received.` },
        { type: 'stage-direction', text: `The newsreel cuts back in.` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `Big Pharaoh Thruxton the Third's press office has released a statement categorically denying any connection between the artist and President Ronnie, as well as any known association with Geoffrey Goldstein or Maxie Laurent — despite the artist's name appearing forty-seven times in the Goldstein documents. The feeling in Los Angeles tonight is difficult to describe.` },
        { type: 'stage-direction', text: `(staring at the screen)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `This happened today?` },
        { type: 'dialogue', speaker: `ASH`, text: `Sir —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Isn't monitoring this literally one of your jobs?` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Technically —` },
        { type: 'dialogue', speaker: `ASH`, text: `We feel the invasion demonstrates that the business of the country —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Cannot be derailed —` },
        { type: 'dialogue', speaker: `ASH`, text: `By liberal elitists —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `In California.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `No no no no no. We table the invasion.` },
        { type: 'dialogue', speaker: `ASH`, text: `Sir —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `The resort —` },
        { type: 'dialogue', speaker: `ASH`, text: `The oil —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `We turn every single resource we have to this Mogul-whatsahooie situation. He goes down, we stay up. That is the whole strategy. Someone write that down. What are we doing - what am I doing - if not to make sure history remembers me as the kind of great leader that inspires his staff in his sleep!` },
        { type: 'dialogue', speaker: `ASH`, text: `Stoically leading.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Slumberly leadership, sir.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Whatever` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And someone find out what he said about me in those documents.` },
        { type: 'stage-direction', text: `RONNIE exits. Ash and Cammie stand in front of the map.The country they were going to invade sits there, labeled.` },
        { type: 'dialogue', speaker: `ASH`, text: `The troops are just — standing there.` },
        { type: 'stage-direction', text: `(quietly)` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `In formation.` },
        { type: 'dialogue', speaker: `ASH`, text: `Will they get tired?` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We should feed them, perhaps.` },
        { type: 'dialogue', speaker: `ASH`, text: `It's a lot of people to just —` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `I'll send them home.` },
        { type: 'stage-direction', text: `Beat.` },
        { type: 'dialogue', speaker: `ASH`, text: `Which home?` },
        { type: 'stage-direction', text: `Cammie looks at the map.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Ohio?` },
        { type: 'dialogue', speaker: `ASH`, text: `All of them?` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Where else do they come from?` },
        { type: 'dialogue', speaker: `ASH`, text: `Daytona. That's Ohio, right?` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Dayton is Ohio. Daytona is Florida.` },
        { type: 'dialogue', speaker: `ASH`, text: `And?` },
        { type: 'stage-direction', text: `Lights shift. Newsreel rises.Into the song.` },
        { type: 'dialogue', speaker: `SETTING`, text: `[A BAR - WASHINGTON D.C. - NIGHT]` },
        { type: 'stage-direction', text: `Dark. Quiet. A television in the corner, muted.Gus enters, looks around, finds a stool. The BARTENDER has his back turned. When he turns around —It's the same face. Different name tag. Different city. Same face. It’s the actor that played Geoff!` },
        { type: 'dialogue', speaker: `GUS`, text: `Don't I — know you from somewhere?` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `Everyone says that. I have that kind of face. What can I get you? I've vodka, diet soda, and water.` },
        { type: 'dialogue', speaker: `GUS`, text: `That's all?` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `You got lucky. It's happy hour.` },
        { type: 'dialogue', speaker: `GUS`, text: `It's 11am.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `I'm happy. It'll last about an hour. Happy. Hour.` },
        { type: 'dialogue', speaker: `GUS`, text: `I'll have a diet soda.` },
        { type: 'stage-direction', text: `[NEWSREEL - muted, closed captions running]` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `BIG PHARAOH THRUXTON III — NEW DETAILS. NO MENTION OF GOLDSTEIN FILES.` },
        { type: 'dialogue', speaker: `GUS`, text: `Funny how fast the cycle turns.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `Lucky for that other guy. What was his name? Some Jew. I’m not antisemitic, but he was very Jewish.` },
        { type: 'dialogue', speaker: `GUS`, text: `Goldstein. Gee-offrrey Goldstein.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `That's it. Very Jewish. What is it with all the rich weirdos lately? Whatever happened to a good old-fashioned creepy high school gym teacher? You always knew what you were dealing with. Kept it contained. A perv was a perv and the neighborhood knew it.` },
        { type: 'dialogue', speaker: `GUS`, text: `That's an — odd take.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `I'm just saying. Everyone should keep their bedroom in their bedroom. Door shuts — hey, whose business is it?` },
        { type: 'dialogue', speaker: `GUS`, text: `Are you suggesting we pick a fall guy and blame it all on him because he creeps us out? And then we can do - whatever we want?` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `The creep's gonna be there anyway. And besides — these rock stars? They got paid. Fully reimbursed for their — what would you call it — trauma. It’s not like they were children, more the - the barely legal type. Like sixteen or fifteen - but that’s the lowest, I’ll bet. It’s not like they’re eight or something. Whole different class.` },
        { type: 'dialogue', speaker: `GUS`, text: `I don’t think it is.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `Come on, they get money, fame. Everyone knows about casting couches. The parents knew, I bet -  let them go! And if the parents say it’s ok, who am I? And the money! That should be enough. I mean, he's not exactly a handsome man, this Pharaoh character, but for the kind of money they were offered — I mean, honestly, I might even su—` },
        { type: 'dialogue', speaker: `GUS`, text: `Stop. Just. No.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `That’s the point. They’re just afraid of saying so! Everyone thinks so but all these activist out there asking for kids to be pampered-` },
        { type: 'dialogue', speaker: `GUS`, text: `No - just - I don’t - no.` },
        { type: 'stage-direction', text: `GUS puts down the glass.Stands.Leaves money on the bar.Walks out.` },
        { type: 'dialogue', speaker: `GUS`, text: `What the fuck. What a fucking creep.` },
        { type: 'stage-direction', text: `The bartender watches him go. Picks up the glass. Rinses it.` },
        { type: 'dialogue', speaker: `BARTENDER`, text: `Probably one of those creeps.` },
        { type: 'stage-direction', text: `Lights shift.` },
        { type: 'dialogue', speaker: `SETTING`, text: `[TAMMY'S OFFICE - LATE]` },
        { type: 'stage-direction', text: `Documents everywhere.Multiple stacks.Color-coded.She has been here for days.The newsreel plays on a small screen on her desk.` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `The stage appears to be set in the Pharaoh Thruxton case, but with no witnesses coming forward, questions are mounting about whether this is a legitimate prosecution or an overeager attorney general on a political witch hunt.` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `President Ronnie has thrown his full support behind the investigation, and both the DOJ and FBI have pledged their cooperation.` },
        { type: 'dialogue', speaker: `ANCHOR - NEWSREEL`, text: `The same agencies have faced criticism in recent months for their handling — or lack thereof — of the Goldstein matter.` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `Where are we on that, exactly?` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `Still waiting on Solicitor General Caldwell to make a call.` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `She's still sitting on it? How long has it been?` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `She's had the files a month.` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `But the leak —` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `Oh, the leak. Yes. What a disaster.` },
        { type: 'dialogue', speaker: `TALKING HEAD 1`, text: `Heads are going to roll. Someone has to be accountable.` },
        { type: 'dialogue', speaker: `TALKING HEAD 2`, text: `Do they?` },
        { type: 'stage-direction', text: `Tammy reaches over.Clicks it off.For the first time all scene.Silence.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `They do.` },
        { type: 'stage-direction', text: `(looks at the stack)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `I'm just not sure I have enough to hold anyone accountable.` },
        { type: 'stage-direction', text: `She picks up a document.Sets it down.Picks up another.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `If I bring it now — with what I have — I lose. And if I lose — But if I wait —` },
        { type: 'stage-direction', text: `(she doesn't finish it)` },
        { type: 'stage-direction', text: `She stands.Walks to the window.Looks out at nothing.` },
        { type: 'stage-direction', text: `(she doesn't finish that one either) She goes back to the desk.Sits.Opens the next file. The television screen sits dark.The stack doesn't get smaller.` }
      ] },
    { id: "02-13", title: "It's not Unreasonable, Man", summary: "In the Oval Office, Ronnie is confronted by Ash and Cammie about Ohio and Tammy's impending statement. Receives Buck's message about Maxie's proposal, signs a pardon, and delivers an unhinged monologue as the lights go dark.", hasMusic: true, youtubeId: "j1lVwTeycPQ", script: [
        { type: 'stage-direction', text: `(The Oval. RONNIE is at his desk. ASH and CAMMIE are flanking him. Television in the corner, muted. TAMMY's face visible on it occasionally. RONNIE is not looking at it.)` },
        { type: 'dialogue', speaker: `ASH`, text: `Sir, the situation in Ohio —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Is not my situation.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `We do need to address —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Why are there so many people in Ohio suddenly? Is that a — is that a thing that happened?` },
        { type: 'stage-direction', text: `(ASH and CAMMIE exchange a look.)` },
        { type: 'stage-direction', text: `We can debrief on Ohio at a later —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `My situation is that woman.` },
        { type: 'stage-direction', text: `(gestures at the TV)` },
        { type: 'stage-direction', text: `She's about to stand up in front of everyone and say things that are — categorically —` },
        { type: 'dialogue', speaker: `ASH`, text: `Unsubstantiated.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I was going to say untrue.` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `What's the difference?` },
        { type: 'stage-direction', text: `(ASH and CAMMIE say nothing.)` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Sir. We have options. There's still the matter of the country that —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I have a message from Buck.` },
        { type: 'stage-direction', text: `(the room shifts)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Apparently our friend — in her very comfortable situation — has a proposal. She'll talk. About everyone.` },
        { type: 'stage-direction', text: `(reads)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Except — important men in positions of significant responsibility who acted in good faith throughout.` },
        { type: 'stage-direction', text: `(looks up)` },
        { type: 'stage-direction', text: `That's me.` },
        { type: 'stage-direction', text: `That could mean any number of —` },
        { type: 'stage-direction', text: `That's me. I know when something is about me.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Sir, a pardon right now, with Tammy about to make a public statement —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `The optics. You want to talk to me about optics right now.` },
        { type: 'stage-direction', text: `(stands)` },
        { type: 'musical-number', speaker: `SONG`, text: `[Musical number occurs here]` },
        { type: 'stage-direction', text: `(RONNIE sits. The silence where ASH and CAMMIE used to fill is just silence. He picks up a pen.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Get me Buck. We need to let the world know that I’m exonerated!` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Sir —` },
        { type: 'stage-direction', text: `(signing)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Get me Buck.` },
        { type: 'stage-direction', text: `(He signs. Sets the pen down. Looks at the TV. TAMMY is still on it.)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `(*The following speech is an example, Ronnie should keep talking without response as the lights go slowly dark for as long as feels comfortable and not a moment more while Ash and Cammie back out quietly. Ronnie gets quieter with the lights goign dimmer but continues until the lights go off - cut off with the lights - he is immeasurably happy with himself and sinking happily into his delusions.)*` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I handled it. There. I’m clear. Let’s talk about an invasion! Who are we gonna blow up?` },
        { type: 'dialogue', speaker: `RONNIE`, text: `We have the best military, and the best guns, you know.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Let’s give service men - oh, and women, now, they can enlist you know! Maybe we should talk about them getting drafted? Can we start the draft?` },
        { type: 'dialogue', speaker: `RONNIE`, text: `We should start a war first! Who cares? I’m free! And I’m the President!` },
        { type: 'stage-direction', text: `(ASH and CAMMIE look at each other. They say nothing. They step back. Ronnie plays with some toys on his desk humming “Its not unreasonable, man”)` },
        { type: 'stage-direction', text: `(Lights shift.)` }
      ] },
    { id: "02-14", title: "We Hold These Truths", summary: "In Tammy's chambers, a full gospel musical number erupts. Ginnie arrives with Gus and his canary yellow phone. Tammy recognizes him from the park bench, takes the phone as evidence, and sets the machinery of justice in motion.", hasMusic: true, youtubeId: "cSVe6MhYpC0", script: [
        { type: 'stage-direction', text: `Tammy's chambers. Before anyone arrives.` },
        { type: 'stage-direction', text: `TAMMY paces. Files in her arms.` },
        { type: 'stage-direction', text: `Low heels on hardwood — click, click, click. She mutters with her whole chest. We cannot make out words. Just rhythm.` },
        { type: 'stage-direction', text: `The cadence of someone who has been over this so many times it has become liturgy.A door opens.` },
        { type: 'stage-direction', text: `The choir files in behind her aides. Tammy sets the files down. The room fills.She begins.[Music hits immediately — full gospel, no warmup.` },
        { type: 'stage-direction', text: `TAMMY is already in it when the lights find her.]` },
        { type: 'stage-direction', text: `[female — full, already preaching]` },
        { type: 'stage-direction', text: `The evidence is difficult.` },
        { type: 'stage-direction', text: `The years have not been kind to memory.` },
        { type: 'stage-direction', text: `The powerful have not been kind to witnesses.` },
        { type: 'stage-direction', text: `[chorus — low, certain, underneath]` },
        { type: 'stage-direction', text: `But we remember.` },
        { type: 'stage-direction', text: `But we remember.` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `I have read every file.` },
        { type: 'stage-direction', text: `I have sat with every allegation.` },
        { type: 'stage-direction', text: `And I am not satisfied.` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `Not satisfied!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `It would fly in the face of justice —` },
        { type: 'stage-direction', text: `It would fly in the face of this office —` },
        { type: 'stage-direction', text: `It would fly in the face of every word` },
        { type: 'stage-direction', text: `written down, ratified, and signed —` },
        { type: 'stage-direction', text: `to look at what these people have carried` },
        { type: 'stage-direction', text: `and say: not today.` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `Not today!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `We do not say not today.` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `We do not say not today![female — dropping register, cold and precise]` },
        { type: 'stage-direction', text: `Every person accused:` },
        { type: 'stage-direction', text: `the right to a fair trial.` },
        { type: 'stage-direction', text: `The right to face their accusers.` },
        { type: 'stage-direction', text: `The presumption of innocence.` },
        { type: 'stage-direction', text: `Because all are innocent —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `Innocent!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `Until proven guilty.` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `Proven guilty.` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `Every person who has suffered:` },
        { type: 'stage-direction', text: `the right to stand before a jury` },
        { type: 'stage-direction', text: `and be heard.` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `And when any arrangement —` },
        { type: 'stage-direction', text: `any deal —` },
        { type: 'stage-direction', text: `any system of managed silence —` },
        { type: 'stage-direction', text: `denies those rights —` },
        { type: 'stage-direction', text: `it is not only the right —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `Not only the right —` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `It is the duty.` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `The duty!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `Of this office.` },
        { type: 'stage-direction', text: `Of this document.` },
        { type: 'stage-direction', text: `Of the people who signed it` },
        { type: 'stage-direction', text: `and the people who inherit it` },
        { type: 'stage-direction', text: `whether they asked to or not.[female — quieter, building toward detonation]` },
        { type: 'stage-direction', text: `These are not suggestions.` },
        { type: 'stage-direction', text: `These are not guidelines.` },
        { type: 'stage-direction', text: `These are not aspirations for a better day.` },
        { type: 'stage-direction', text: `[music drops to a single bass note — a pulse]` },
        { type: 'stage-direction', text: `These are the words we agreed to.` },
        { type: 'stage-direction', text: `[beat]` },
        { type: 'stage-direction', text: `One nation —` },
        { type: 'stage-direction', text: `[breath]` },
        { type: 'stage-direction', text: `Under God —` },
        { type: 'stage-direction', text: `[long silence — the whole room][female — explosive, no ceiling]` },
        { type: 'stage-direction', text: `WE! HOLD! THESE! TRUTHS!` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `WE HOLD THESE TRUTHS!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `Not as a suggestion —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `NOT AS A COMPROMISE!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `We! Hold! These! Truths!` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `TO BE SELF-EVIDENT!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `We the people —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `WE THE PEOPLE!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `In order to form —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `A MORE PERFECT UNION!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `Establish —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `JUSTICE!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `Insure —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `DOMESTIC TRANQUILITY!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `Provide for —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `THE COMMON DEFENSE!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `And secure —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `THE BLESSINGS OF LIBERTY!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `To ourselves —` },
        { type: 'stage-direction', text: `[chorus]` },
        { type: 'stage-direction', text: `TO OURSELVES!` },
        { type: 'stage-direction', text: `[female]` },
        { type: 'stage-direction', text: `And to our —` },
        { type: 'stage-direction', text: `posterity` },
        { type: 'stage-direction', text: `The back doors open.` },
        { type: 'stage-direction', text: `GINNIE slips in.` },
        { type: 'stage-direction', text: `Behind her: GUS.` },
        { type: 'stage-direction', text: `He is holding a canary yellow phone.The choir doesn't stop. The room is still full — press, aides, staff. They are all in it. Nobody looks up except —` },
        { type: 'stage-direction', text: `TAMMY.Her eyes find the phone.The color. She knows that color. The bench. The morning. The man with the coffee.Her eyes move to the man holding it.She sees him.Her mouth opens slightly.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `...It's you.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `[chorus — still full gospel, no idea, just feeling the spirit]` },
        { type: 'dialogue', speaker: `TAMMY`, text: `IT'S YOU!` },
        { type: 'dialogue', speaker: `TAMMY`, text: `IT'S YOU!` },
        { type: 'dialogue', speaker: `TAMMY`, text: `IT'S YOU —` },
        { type: 'stage-direction', text: `GUS looks around the room, alarmed.` },
        { type: 'stage-direction', text: `(to Ginnie, low)` },
        { type: 'dialogue', speaker: `GUS`, text: `Why are they —` },
        { type: 'stage-direction', text: `(low)` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Just stand there.` },
        { type: 'stage-direction', text: `Tammy raises one hand.The choir winds down. Not abruptly — the way a hymn ends, finding its own floor.The room exhales. Press, aides, staff — the murmur of a hundred people recalibrating.Tammy crosses to Ginnie. Unhurried. Professional. Like she's walking to a podium.TAMMY` },
        { type: 'stage-direction', text: `(low, to Ginnie)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Who is he?` },
        { type: 'stage-direction', text: `He worked for Goldstein. Personal assistant. He was on the island — same crew rotation as maintenance, forty-eight hours in and out. He had keys to Geoff's office. He let me in to dust.` },
        { type: 'stage-direction', text: `A beat.` },
        { type: 'stage-direction', text: `He came to us two nights ago. Our attorney explained the situation. I believed he would make the right choice.` },
        { type: 'stage-direction', text: `Tammy looks at Gus.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `What's your name.` },
        { type: 'stage-direction', text: `Gus. I'm the G. In the margins.` },
        { type: 'stage-direction', text: `A beat.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `What's on the phone?` },
        { type: 'dialogue', speaker: `GUS`, text: `His contacts. His calendar — a few months before and after I was hired. He used to forward jokes to his whole list, I was on it, they were pretty bad —` },
        { type: 'stage-direction', text: `(Stops. Something shifting behind his eyes.)` },
        { type: 'stage-direction', text: `They weren't jokes.` },
        { type: 'stage-direction', text: `Tammy is very still.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Why did you wait to come? Be honest. I'll know.` },
        { type: 'stage-direction', text: `(thinks)` },
        { type: 'dialogue', speaker: `GUS`, text: `I was scared - of (lookss around) all this.` },
        { type: 'dialogue', speaker: `GUS`, text: `I needed to stop moving.` },
        { type: 'stage-direction', text: `Tammy looks at him clearly.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `You need an attorney before we go further. Do not say another word until you have one.` },
        { type: 'stage-direction', text: `(to Ginnie)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Can you —` },
        { type: 'dialogue', speaker: `GINNIE`, text: `Marcus. He likes to work late.(to Gus)` },
        { type: 'stage-direction', text: `He'll do the dusting this time. Don't worry.` },
        { type: 'stage-direction', text: `(to her aide)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `I need SDNY. Evidence tech, supervisor. Southern District only.` },
        { type: 'stage-direction', text: `(The aide moves. ASH and CAMMIE have materialized — they always materialize — already stepping forward.)` },
        { type: 'stage-direction', text: `(without looking at them)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Not you.` },
        { type: 'stage-direction', text: `They stop.Two SDNY AGENTS move in quietly.` },
        { type: 'stage-direction', text: `(to Gus)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Sit. Stay with the phone until it's processed and you've been cleared to hand it over. Then you'll be questioned. Ask for water and drink it — it will be a long day.` },
        { type: 'dialogue', speaker: `GUS`, text: `Yes, ma'am.The agents position themselves on either side of him.` },
        { type: 'stage-direction', text: `The room has contracted to four people: Tammy, Ginnie, Gus, one aide. Everyone else has quietly understood they should be somewhere else.` },
        { type: 'stage-direction', text: `Tammy looks at him one more time.Something passes across her face. Private. Gone before anyone else in the room could have named it.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Congratulations on your sobriety.` },
        { type: 'stage-direction', text: `Gus goes still. He doesn't quite recognize it. He holds his mouth shut.Tammy turns.` },
        { type: 'stage-direction', text: `(to aide)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Make the calls.` },
        { type: 'stage-direction', text: `She walks back to her files.The room begins to move around Gus — agents, aides, the machinery of process — while he sits very quietly with the canary yellow phone in his hands, not entirely sure what just happened.Lights narrow.Down.` }
      ] },
    { id: "02-15", title: "Rehabilitation", summary: "Press conference. Ronnie introduces Maxie in full restraints. She reads her own statement through him, implicating him in sex trafficking. Buck defects. Ronnie resigns. Vice President sworn in on a romance novel, pardons everyone.", hasMusic: true, youtubeId: "dv-ZFkmz_Bk", script: [
        { type: 'stage-direction', text: `A podium. Press corps. Cameras. The sound of heavy rain. RONNIE at the mic.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Beautiful day. Really beautiful. You know what a beautiful day means? It means things are good. Things are moving in the right direction. The sun is out. The snow is gone. You know what I always say about the rain—` },
        { type: 'dialogue', speaker: `RONNIE`, text: `It washes everything away. That's what I always say. I've been saying it for years. The snow was covering everything up and now it's a beautiful day and the truth is coming out and it's very —` },
        { type: 'stage-direction', text: `The sound of a thunderstorm plays.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `It's still a beautiful day. Internally. The internal weather is beautiful.` },
        { type: 'stage-direction', text: `MAXIE is wheeled in. Full restraints. Mask. The press erupts. RONNIE beams.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `And here she is! The woman of the hour! A great woman. Tremendous. Very misunderstood. Very — she's been through a lot. We've all been through a lot. But she's here today as part of an agreement —` },
        { type: 'stage-direction', text: `Two aides begin unlatching restraints. Methodically. One by one.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `— a deal which represents the strength of our institutions and the generosity of this administration and the commitment to truth and healing and what I would call — the process of —` },
        { type: 'stage-direction', text: `The last restraint comes off. MAXIE straightens. Rolls her neck. There is an audible crack. She stretches, catlike, and looks at the room.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Rehabilitation.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Rehabilitation! Yes! That's the word! She said it better than I could!` },
        { type: 'stage-direction', text: `RONNIE pats MAXIE's bottom` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Nice to see you again, Maxie.` },
        { type: 'stage-direction', text: `MAXIE looks at his hand. Then at him. Then at the press. She reaches into her jacket and produces an envelope.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `My statement.` },
        { type: 'stage-direction', text: `RONNIE takes it` },
        { type: 'dialogue', speaker: `RONNIE`, text: `This is — this is the statement! For the record! For the country! I will read this now —` },
        { type: 'dialogue', speaker: `MAXIE`, text: `You may want one of your people to —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `No no. This is very important. For exoneration. For history. Let's put it in the record.` },
        { type: 'stage-direction', text: `He opens it. Clears his throat. Reads.` },
        { type: 'stage-direction', text: `(reading, pleased)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `"I, Isabella Maximillian Laurent, provide the following voluntary statement..."` },
        { type: 'stage-direction', text: `(nodding)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Very professional. Very —` },
        { type: 'stage-direction', text: `(reading)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Regarding Gus-` },
        { type: 'stage-direction', text: `(stops suddenly)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Who? Blah blah. Unknowing, uninvolved. Unimportant. Errand boy. Laundry fetcher? You exonerate your valet? "Gus... unaware and uninvolved in all..."` },
        { type: 'stage-direction', text: `(reading)` },
        { type: 'dialogue', speaker: `MAXIE`, text: `"...business matters of consequence." Yes. I have a special section coming for you, Ronnie.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Oh - okay! Yes! How very very kind and altruistic of you - exonerating all these-  great men - yes,  I suppose a valet could be a great man - a great valet, for sure!` },
        { type: 'stage-direction', text: `(reading)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `"Regarding the whereabouts of Geoffrey Aaron Goldstein — I do not know where he is. I wish him well."` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Moving. Very moving. She's a —` },
        { type: 'stage-direction', text: `(reading)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `"I wish to express my sincere appreciation to the President for his generosity in —"` },
        { type: 'stage-direction', text: `She appreciates me. See, I said she was —` },
        { type: 'stage-direction', text: `(reading)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `"— ensuring that the ink is dry and official, and that double jeopardy is not something I need to concern myself with going forward."` },
        { type: 'stage-direction', text: `He pauses.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `"Regarding President Ronald Allan Kennedy Junior —"` },
        { type: 'dialogue', speaker: `RONNIE`, text: `"The President was instrumental in the construction, planning, purchase, layout, interior decorating, staffing, and identification of clientele for the island property known as Saint Elmo South —"` },
        { type: 'dialogue', speaker: `RONNIE`, text: `The smile is doing a lot of work now.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `"— including networking introductions, scheduling coordination, and the general maintenance of an atmosphere conducive to —"` },
        { type: 'stage-direction', text: `He stops. He looks at Maxie.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Keep. Reading.` },
        { type: 'stage-direction', text: `He looks back at the paper. His jaw tightens.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `"...conducive to the activities which form the basis of the current federal investigation, including but not limited to child sex trafficking, for which the President was our most significant financial client —"` },
        { type: 'stage-direction', text: `He stops.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `You were supposed to exonerate us - good men-` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I exonerated the one I'm aware of.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `No one will ever read this.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `My lawyer distributed it to all the major news outlets 10 minutes ago. It pays to get good representation, right, Buck?` },
        { type: 'stage-direction', text: `BUCK appears at the podium and places a card down in front of the President` },
        { type: 'dialogue', speaker: `BUCK`, text: `The best for the best! My card, Mr. President.` },
        { type: 'stage-direction', text: `BUCK offers his arm to MAXIE who takes it.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `Ronnie, I think some of the press have some questions.` },
        { type: 'stage-direction', text: `The press are looking at their phones, comparing notes, looking excited.` },
        { type: 'dialogue', speaker: `MAXIE`, text: `I have a meeting with my lawyer. Buck, how do you feel about McDonalds? I've always wanted to try a big Mac. Maybe being American isn't so bad.` },
        { type: 'stage-direction', text: `BUCK nods and the two leave unhurriedly.` },
        { type: 'musical-number', speaker: `SONG`, text: `[The first chords of "UNREASONABLE VICE (PRESIDENT) (Instrumental)" can be heard in the distance played by a brass band. The music will start getting louder slowly.]` },
        { type: 'stage-direction', text: `ASH and CAMMIE appear at the perimeter. Moving toward Ronnie.` },
        { type: 'stage-direction', text: `The press is getting very loud.` },
        { type: 'stage-direction', text: `(to Ash and Cammie)` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Don't even —` },
        { type: 'dialogue', speaker: `ASH`, text: `Sir —` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I won't be the only one in prison over this. I won't be in prison at all. You know better than that. You both know better than that.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I am — for the good of the country — and in the interest of a smooth transition of power —` },
        { type: 'stage-direction', text: `RONNIE produces a letter and places it onto the podium and speaks into the mic clearly.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `I, Ronald Allen Kennedy, Jr., resign the Office of the President of the United States of America, as its most capable and most intelligent office holder - the best most greatest President ever - having brought in a golden age of-.` },
        { type: 'stage-direction', text: `ASH and CAM clear their throats.` },
        { type: 'dialogue', speaker: `RONNIE`, text: `Right. Effective - immediately.` },
        { type: 'stage-direction', text: `The room is chaos and in comes a brass band led by the actor who played GEOFF.` },
        { type: 'dialogue', speaker: `FULL CAST`, text: `(GASPING) IT'S THE VICE PRESIDENT!` },
        { type: 'dialogue', speaker: `VICE PRESIDENT`, text: `That's Mr. President to you now! I can't wait to tell my mother! Cameras are on? Who's got a Bible?` },
        { type: 'dialogue', speaker: `CAST MEMBER`, text: `I've got a romance novel!` },
        { type: 'dialogue', speaker: `VICE PRESIDENT`, text: `Ole Ben Franklin would see the humor in it.` },
        { type: 'stage-direction', text: `CAST MEMBER comes forward and holds the book out and the VICE PRESIDENT puts his hand on it.` },
        { type: 'dialogue', speaker: `CAST MEMBER`, text: `Do you-` },
        { type: 'dialogue', speaker: `VICE PRESIDENT`, text: `I do!` },
        { type: 'dialogue', speaker: `CAST MEMBER`, text: `Will you-` },
        { type: 'dialogue', speaker: `VICE PRESIDENT`, text: `I will!` },
        { type: 'dialogue', speaker: `CAST MEMBER`, text: `Then you are by the-` },
        { type: 'dialogue', speaker: `VICE PRESIDENT`, text: `I am!` },
        { type: 'dialogue', speaker: `FULL CAST`, text: `He is!` },
        { type: 'dialogue', speaker: `VICE PRESIDENT`, text: `Paper! I need paper! I'm the President now! Get me some paper!` },
        { type: 'stage-direction', text: `Paper is produced, and a pen. VICE PRESIDENT turns ASH OR CAMMIE around and writes on their back.` },
        { type: 'dialogue', speaker: `VICE PRESIDENT`, text: `"I am the President. And I pardon you. And Pharoah what's-his-face. And all the homies. Pardon of everything - legal legal legal stuff - and in perpe- and forever. Legal here legal there.For the good of the nation. And sign."` },
        { type: 'stage-direction', text: `Slaps the paper RONNIE'S chest. RONNIE grabs it and runs.` },
        { type: 'dialogue', speaker: `VICE PRESIDENT`, text: `You are pardoned, Mr. President! Now, everyone, I hear we just shipped a bunch of our service members in from Ohio and the cafeteria is serving falafel. Lunch is on me!` },
        { type: 'stage-direction', text: `VICE PRESIDENT leads the band and the press corps out, leaving only ASH and CAM on stage alone.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `And it's only Tuesday.` },
        { type: 'dialogue', speaker: `ASH`, text: `It's Wednesday.` },
        { type: 'dialogue', speaker: `CAMMIE`, text: `Ah. That makes sense.  Pardoned?` },
        { type: 'dialogue', speaker: `ASH`, text: `All of them?` },
        { type: 'dialogue', speaker: `CAM`, text: `Everyone's off the hook?` },
        { type: 'dialogue', speaker: `ASH`, text: `Everyone that matters.` },
        { type: 'dialogue', speaker: `CAM`, text: `Did we forget anyone?` }
      ] },
    { id: "02-16", title: "Orbiting", summary: "Back on the park bench, Gus holds a wiped canary yellow phone. Tammy joins him — offering perspective on justice and a folded piece of paper with a path forward. Everything orbits around your next move.", hasMusic: true, script: [
        { type: 'stage-direction', text: `A park bench. Outside a church. Morning.` },
        { type: 'stage-direction', text: `GUS sits. He's been sitting for a while.` },
        { type: 'stage-direction', text: `He reaches into his pocket. Pulls out the canary yellow phone. Turns it over in his hands. They gave it back — cleared. OS wiped. Nothing on it. Just a phone.` },
        { type: 'stage-direction', text: `He turns it on. The screen glows. He stares at it.` },
        { type: 'stage-direction', text: `TAMMY appears. She's carrying a milk carton. The small kind. Like from a school cafeteria. She sits down beside him without asking.` },
        { type: 'stage-direction', text: `She looks at the phone.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Nice phone.` },
        { type: 'dialogue', speaker: `GUS`, text: `Yeah.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Don't use it. That's not legal advice. But I'd be willing to bet good money that phone is being tracked. Not the way all phones are tracked. Specifically. For you.` },
        { type: 'dialogue', speaker: `GUS`, text: `What do I do with it?` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Throw it away. Forget it existed.` },
        { type: 'stage-direction', text: `He looks at it one more moment. Then he sets it on the bench between them.` },
        { type: 'stage-direction', text: `A long silence.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `You did the right thing. The world burned you for it. You're angry at God right now.` },
        { type: 'stage-direction', text: `Gus doesn't answer.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Did you go to a meeting?` },
        { type: 'dialogue', speaker: `GUS`, text: `I was thinking about it. Didn't really seem to help. Not this time.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `It doesn't always. It still matters that you go.` },
        { type: 'dialogue', speaker: `GUS`, text: `You're so sure about meetings. What about justice? You get any of that?` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Justice is funny.` },
        { type: 'stage-direction', text: `That's not an answer.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Justice is never done. That's the answer. It's never finished. You don't arrive at it and stop.` },
        { type: 'stage-direction', text: `Nobody's in jail, Tammy. Not one person. Not even Maxie.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `No.` },
        { type: 'dialogue', speaker: `GUS`, text: `You spent — how long on this case —` },
        { type: 'dialogue', speaker: `TAMMY`, text: `A while.` },
        { type: 'dialogue', speaker: `GUS`, text: `And the only person who saw the inside of a cell was me. The laundry guy.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `For a few days.` },
        { type: 'stage-direction', text: `That's not justice.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `No. It isn't.` },
        { type: 'dialogue', speaker: `GUS`, text: `So what was any of it for.` },
        { type: 'stage-direction', text: `Maxie's out.` },
        { type: 'stage-direction', text: `Maxie's out eating a Big Mac somewhere.` },
        { type: 'stage-direction', text: `We'll see Maxie again. That one doesn't hide. She won't be able to help herself — she'll come back out, she'll position, she'll maneuver. And when she does the letter is already in the record. She won't be able to explain it away.` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Monsters stay monstrous, Gus. It's one of the worst things about them. But it's also the thing that catches them.` },
        { type: 'dialogue', speaker: `GUS`, text: `But no one —` },
        { type: 'dialogue', speaker: `TAMMY`, text: `No one yet.` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'stage-direction', text: `That's where the law comes in.` },
        { type: 'dialogue', speaker: `GUS`, text: `Great. The law.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Have you thought about a career in it?` },
        { type: 'dialogue', speaker: `GUS`, text: `What. Police officer?` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Lawyer.` },
        { type: 'dialogue', speaker: `GUS`, text: `You've got to be kidding me.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `I'm not. I know people who know programs. There are paths that don't look like paths until someone points at them.` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `You don't have to be a lawyer to work in the law. You just have to understand how the front gate works.` },
        { type: 'stage-direction', text: `She reaches into her jacket. Produces a folded piece of paper. Sets it on the bench.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Read it over. Get back to me tomorrow.` },
        { type: 'stage-direction', text: `Gus picks it up. Looks at it. Looks at her.` },
        { type: 'dialogue', speaker: `GUS`, text: `I've been running in circles for two years.` },
        { type: 'stage-direction', text: `That's not a circle. That's an orbit. You just needed something worth orbiting.` },
        { type: 'stage-direction', text: `Gus is very still. He almost places her. Not yet.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Nice to meet you, Gus. Be on time.` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Early.` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `I start at sunrise.` },
        { type: 'stage-direction', text: `She picks up the yellow phone. Drops it in the trash on her way out. Doesn't break stride.` },
        { type: 'stage-direction', text: `Gus watches her go.` },
        { type: 'stage-direction', text: `He looks at the trash can.` },
        { type: 'stage-direction', text: `He looks at the paper.` },
        { type: 'stage-direction', text: `He looks up.` },
        { type: 'dialogue', speaker: `GUS`, text: `World's funny.` },
        { type: 'stage-direction', text: `Tammy stops. She doesn't turn around.` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Sometimes it feels like everything is spiraling out of control.` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `But really the arc of the universe is just waiting for you to bend it.` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `Everything orbits around your next move.` },
        { type: 'stage-direction', text: `(beat)` },
        { type: 'dialogue', speaker: `TAMMY`, text: `You just don't know it until it's done.` },
        { type: 'stage-direction', text: `She goes.` },
        { type: 'stage-direction', text: `Gus sits with that.` },
        { type: 'stage-direction', text: `He folds the paper. Puts it in his pocket.` },
        { type: 'stage-direction', text: `He stands up.` },
        { type: 'stage-direction', text: `He starts walking.` },
        { type: 'stage-direction', text: `Lights shift.` },
        { type: 'stage-direction', text: `House lights up.` },
        { type: 'stage-direction', text: `If You Only Knew plays over the credits.` }
      ] },
    { 
      id: "02-Finale", 
      title: "Finale Standard Procedure", 
      summary: "The cycle continues. A new island, a new name, the same old rules.", 
      characters: "Ensemble, Geoff (Voice)",
      hasMusic: true,
      youtubeId: "dv-ZFkmz_Bk",
      lyric: "IT'S STANDARD PROCEDURE\nNothing to see here, move along.\nIT'S STANDARD PROCEDURE\nJust a verse in a different song.\nThe names may change, the faces too\nBut the game is old and the rules are new\nAnd the powerful are never wrong.",
      script: [
        { type: 'stage-direction', text: "The entire ENSEMBLE is on stage, dressed in sharp, geometric Bauhaus-style suits. They move in perfect, mechanical unison." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'dialogue', speaker: "ENSEMBLE", text: "Standard procedure. File the report. Redact the names. Close the case." },
        { type: 'stage-direction', text: "A golden phone rings in the distance. The stage goes black, except for a single spotlight on the phone." },
        { type: 'dialogue', speaker: "GEOFF (VOICE)", text: "Hello? Yes, I'm interested in the property. Does it have a private dock?" }
      ]
    },
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
              <a
                href={currentCharity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 hover:text-bauhaus-yellow transition-colors shrink-0"
              >
                <div className="p-3 border-2 border-bauhaus-white group-hover:border-bauhaus-yellow transition-all group-hover:rotate-12">
                  <Heart size={20} className="group-hover:fill-bauhaus-yellow" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest">{currentCharity.name}</p>
                  <p className="text-[9px] opacity-40 uppercase tracking-widest">{currentCharity.msg}</p>
                </div>
              </a>
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
          <div className="w-full md:w-3/4 p-8 md:p-12 overflow-y-auto bg-bauhaus-white/50 text-bauhaus-black">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-bauhaus-red font-display font-black text-4xl block mb-2">{act1Scenes[selectedAct1SceneIndex].id}</span>
                  <h3 className="text-4xl font-display font-black uppercase leading-none">{act1Scenes[selectedAct1SceneIndex].title}</h3>
                </div>
                <div className="flex gap-4">
                  <BauhausButton 
                    onClick={() => openSceneText(act1Scenes[selectedAct1SceneIndex], 1, selectedAct1SceneIndex)}
                    variant="black"
                    className="!text-sm py-2"
                  >
                    Read Script
                  </BauhausButton>
                </div>
              </div>

              <div className="space-y-6">
                {act1Scenes[selectedAct1SceneIndex].hasMusic && (
                  <BauhausButton 
                    onClick={() => openLyrics(act1Scenes[selectedAct1SceneIndex])}
                    className="w-full p-6 border-4 border-bauhaus-black bg-bauhaus-yellow flex items-center justify-between hover:bg-bauhaus-blue hover:text-bauhaus-white transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-bauhaus-black text-bauhaus-white flex items-center justify-center group-hover:bg-bauhaus-white group-hover:text-bauhaus-black transition-colors">
                        <Music size={24} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-[10px] font-display font-black uppercase tracking-widest opacity-40">Musical Number</h4>
                        <p className="text-xl font-display font-black uppercase">{act1Scenes[selectedAct1SceneIndex].title}</p>
                      </div>
                    </div>
                    <ChevronRight size={24} />
                  </BauhausButton>
                )}

                <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="text-xs font-display font-black uppercase tracking-widest mb-4 opacity-40">Scene Summary</h4>
                  <p className="text-lg font-sans leading-relaxed">{act1Scenes[selectedAct1SceneIndex].summary}</p>
                </div>

                {act1Scenes[selectedAct1SceneIndex].characters && (
                  <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-blue text-bauhaus-white">
                    <h4 className="text-xs font-display font-black uppercase tracking-widest mb-4 opacity-40">Characters</h4>
                    <p className="text-lg font-sans leading-relaxed">{act1Scenes[selectedAct1SceneIndex].characters}</p>
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
          <div className="w-full md:w-3/4 p-8 md:p-12 overflow-y-auto bg-bauhaus-white/50 text-bauhaus-black">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-bauhaus-blue font-display font-black text-4xl block mb-2">{act2Scenes[selectedAct2SceneIndex].id}</span>
                  <h3 className="text-4xl font-display font-black uppercase leading-none">{act2Scenes[selectedAct2SceneIndex].title}</h3>
                </div>
                <div className="flex gap-4">
                  <BauhausButton 
                    onClick={() => openSceneText(act2Scenes[selectedAct2SceneIndex], 2, selectedAct2SceneIndex)}
                    variant="black"
                    className="!text-sm py-2"
                  >
                    Read Script
                  </BauhausButton>
                </div>
              </div>

              <div className="space-y-6">
                {act2Scenes[selectedAct2SceneIndex].hasMusic && (
                  <BauhausButton 
                    onClick={() => openLyrics(act2Scenes[selectedAct2SceneIndex])}
                    className="w-full p-6 border-4 border-bauhaus-black bg-bauhaus-yellow flex items-center justify-between hover:bg-bauhaus-blue hover:text-bauhaus-white transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-bauhaus-black text-bauhaus-white flex items-center justify-center group-hover:bg-bauhaus-white group-hover:text-bauhaus-black transition-colors">
                        <Music size={24} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-[10px] font-display font-black uppercase tracking-widest opacity-40">Musical Number</h4>
                        <p className="text-xl font-display font-black uppercase">{act2Scenes[selectedAct2SceneIndex].title}</p>
                      </div>
                    </div>
                    <ChevronRight size={24} />
                  </BauhausButton>
                )}

                <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="text-xs font-display font-black uppercase tracking-widest mb-4 opacity-40">Scene Summary</h4>
                  <p className="text-lg font-sans leading-relaxed">{act2Scenes[selectedAct2SceneIndex].summary}</p>
                </div>

                {act2Scenes[selectedAct2SceneIndex].characters && (
                  <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-blue text-bauhaus-white">
                    <h4 className="text-xs font-display font-black uppercase tracking-widest mb-4 opacity-40">Characters</h4>
                    <p className="text-lg font-sans leading-relaxed">{act2Scenes[selectedAct2SceneIndex].characters}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'sceneText'} onClose={closeModal} title="SCENE READER">
        {currentScene && (
          <div className="flex flex-col gap-6 text-bauhaus-black">
            <div className="flex justify-between items-center border-b-4 border-bauhaus-black pb-4">
              <div className="flex items-center gap-4">
                <span className={`text-3xl font-display font-black ${currentScene.id.startsWith('01') ? 'text-bauhaus-red' : 'text-bauhaus-blue'}`}>
                  {currentScene.id}
                </span>
                <span className="uppercase font-black tracking-[0.3em] text-xs opacity-40">{currentScene.title}</span>
              </div>
              <div className="flex gap-4">
                {currentScene.hasMusic && (
                  <button 
                    onClick={() => openLyrics(currentScene)}
                    className="text-[10px] font-black uppercase tracking-widest border-2 border-bauhaus-black px-4 py-1 bg-bauhaus-yellow hover:bg-bauhaus-black hover:text-bauhaus-white transition-all"
                  >
                    Lyrics
                  </button>
                )}
                <button 
                  onClick={() => setActiveModal('fullScript')}
                  className="text-[10px] font-black uppercase tracking-widest border-2 border-bauhaus-black px-4 py-1 hover:bg-bauhaus-black hover:text-bauhaus-white transition-all"
                >
                  Full Script
                </button>
                <button 
                  onClick={() => setActiveModal(currentAct === 1 ? 'act1' : 'act2')}
                  className="text-[10px] font-black uppercase tracking-widest border-2 border-bauhaus-black px-4 py-1 hover:bg-bauhaus-black hover:text-bauhaus-white transition-all"
                >
                  Back to Act
                </button>
              </div>
            </div>

            <div 
              className="h-[50vh] flex flex-col justify-center items-center p-8 bg-bauhaus-white cursor-pointer select-none relative border-4 border-bauhaus-black"
              onClick={nextLine}
            >
              <motion.div
                key={currentLineIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-3xl"
              >
                {scriptCards[currentLineIndex] ? (
                  <div className="space-y-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className={`text-sm md:text-base font-display font-black uppercase tracking-[0.3em] px-3 py-1 border-2 border-bauhaus-black ${
                        scriptCards[currentLineIndex].type === 'stage-direction' ? 'bg-bauhaus-yellow' : 'bg-bauhaus-red text-bauhaus-white'
                      }`}>
                        {scriptCards[currentLineIndex].type === 'stage-direction' ? 'STAGE DIRECTION' : scriptCards[currentLineIndex].speaker}
                      </span>
                    </div>
                    <div className="space-y-4 max-h-[35vh] overflow-y-auto custom-scrollbar px-4">
                      {scriptCards[currentLineIndex].lines.map((line, i) => (
                        <p 
                          key={i} 
                          className={`
                            ${scriptCards[currentLineIndex].type === 'stage-direction' ? 'text-lg md:text-xl italic opacity-60 font-sans' : 'text-xl md:text-3xl font-display font-black uppercase leading-tight'}
                          `}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <p className="text-3xl font-display font-black uppercase">End of Scene</p>
                    <BauhausButton onClick={nextScene} variant="red">Next Scene</BauhausButton>
                  </div>
                )}
              </motion.div>

              <div className="absolute bottom-6 left-6 flex gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevScene(); }}
                  className="text-[10px] font-black uppercase tracking-widest border-2 border-bauhaus-black px-4 py-1 hover:bg-bauhaus-black hover:text-bauhaus-white transition-all disabled:opacity-20"
                  disabled={currentSceneIndex === 0}
                >
                  Prev Scene
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextScene(); }}
                  className="text-[10px] font-black uppercase tracking-widest border-2 border-bauhaus-black px-4 py-1 hover:bg-bauhaus-black hover:text-bauhaus-white transition-all disabled:opacity-20"
                  disabled={currentSceneIndex === (currentAct === 1 ? act1Scenes.length - 1 : act2Scenes.length - 1)}
                >
                  Next Scene
                </button>
              </div>

              <div className="absolute bottom-6 right-6 flex items-center gap-6">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">
                  CARD {currentLineIndex + 1} / {scriptCards.length}
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
                    disabled={currentLineIndex === scriptCards.length - 1}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={activeModal === 'fullScript'} onClose={() => setActiveModal('sceneText')} title="FULL SCRIPT">
        {currentScene && (
          <div className="space-y-12 text-bauhaus-black max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            <div className="text-center space-y-4 border-b-8 border-bauhaus-black pb-8">
              <h2 className="text-6xl font-display font-black uppercase">{currentScene.title}</h2>
              <p className="text-xl font-display font-bold uppercase tracking-widest opacity-40">Scene {currentScene.id}</p>
            </div>

            <div className="space-y-8 font-sans text-lg">
              {currentScene.script?.map((line, i) => (
                <div key={i} className={`flex ${line.type === 'stage-direction' || line.type === 'musical-number' ? 'justify-center italic opacity-60 py-4' : 'flex-col'}`}>
                  {line.type === 'dialogue' && (
                    <span className="font-display font-black uppercase text-sm mb-1 text-bauhaus-red">{line.speaker}</span>
                  )}
                  {line.type === 'musical-number' ? (
                    <button 
                      onClick={() => openLyrics(currentScene)}
                      className="text-bauhaus-red font-display font-black uppercase hover:underline flex items-center gap-2"
                    >
                      <Music size={16} />
                      {line.text}
                    </button>
                  ) : (
                    <p className={line.type === 'stage-direction' ? 'max-w-xl text-center' : 'pl-4 border-l-4 border-bauhaus-black/10'}>
                      {line.text}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-12 flex justify-center">
              <BauhausButton onClick={() => setActiveModal('sceneText')} variant="black">Back to Reader</BauhausButton>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={activeModal === 'listen'} onClose={closeModal} title="LISTEN NOW">
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 border-b-4 border-bauhaus-black pb-4">
            {(['playlist', 'links'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setListenTab(tab)}
                className={`px-8 py-3 font-display font-black uppercase tracking-widest text-sm border-4 border-bauhaus-black transition-all ${
                  listenTab === tab ? 'bg-bauhaus-black text-bauhaus-white' : 'bg-bauhaus-white text-bauhaus-black hover:bg-bauhaus-yellow'
                }`}
              >
                {tab === 'playlist' ? 'YouTube Playlist' : 'Links'}
              </button>
            ))}
          </div>

          {listenTab === 'playlist' ? (
            <div className="flex flex-col md:flex-row gap-8 h-[60vh]">
              {/* Track List */}
              <div className="w-full md:w-1/3 overflow-y-auto custom-scrollbar border-r-4 border-bauhaus-black pr-4 space-y-4">
                {youtubeTracks.map((track, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedYoutubeIndex(i);
                      // Set default version for the new track
                      const versions = Object.keys(track.versions);
                      if (versions.includes('1.5')) setSelectedYoutubeVersion('1.5');
                      else if (versions.includes('1.0')) setSelectedYoutubeVersion('1.0');
                      else setSelectedYoutubeVersion(versions[0]);
                    }}
                    className={`w-full p-4 border-4 border-bauhaus-black text-left transition-all ${
                      selectedYoutubeIndex === i ? 'bg-bauhaus-yellow shadow-none translate-x-1 translate-y-1' : 'bg-bauhaus-white shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-bauhaus-red hover:text-bauhaus-white'
                    }`}
                  >
                    <p className="text-[8px] font-black uppercase opacity-40 tracking-widest mb-1">{track.act} - {track.scene}</p>
                    <p className="text-sm font-display font-black uppercase leading-tight">{track.title}</p>
                  </button>
                ))}
              </div>
              
              {/* Video Player Area */}
              <div className="w-full md:w-2/3 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="aspect-video border-4 border-bauhaus-black bg-bauhaus-black relative overflow-hidden shadow-[12px_12px_0px_0px_var(--bauhaus-red)]">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeTracks[selectedYoutubeIndex].versions[selectedYoutubeVersion as keyof typeof youtubeTracks[0]['versions']]}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-white shadow-[8px_8px_0px_0px_var(--bauhaus-black)]">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-display font-black uppercase tracking-widest opacity-40">Version Selection</h4>
                      <span className="text-[10px] font-black uppercase bg-bauhaus-black text-bauhaus-white px-2 py-1">
                        Current: {selectedYoutubeVersion}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {/* Version Selection */}
                      {Object.keys(youtubeTracks[selectedYoutubeIndex].versions).map((v) => (
                        <button
                          key={v}
                          onClick={() => setSelectedYoutubeVersion(v)}
                          className={`px-6 py-2 border-2 border-bauhaus-black font-display font-bold uppercase transition-all ${
                            selectedYoutubeVersion === v ? 'bg-bauhaus-black text-bauhaus-white' : 'bg-bauhaus-white text-bauhaus-black hover:bg-bauhaus-yellow'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Suno Dropdown */}
              <div className="p-8 border-4 border-bauhaus-black bg-bauhaus-white shadow-[12px_12px_0px_0px_var(--bauhaus-yellow)]">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-bauhaus-yellow border-2 border-bauhaus-black flex items-center justify-center">
                      <Music size={20} />
                    </div>
                    <h4 className="text-xl font-display font-black uppercase tracking-widest">Suno Links</h4>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <select 
                      value={selectedSunoId}
                      onChange={(e) => setSelectedSunoId(e.target.value)}
                      className="flex-1 p-4 border-4 border-bauhaus-black font-display font-bold uppercase bg-bauhaus-white focus:outline-none"
                    >
                      <option value="">-- SELECT SUNO TRACK --</option>
                      {sunoTracks.map((track) => (
                        <option key={track.id} value={track.id}>{track.title} ({track.version})</option>
                      ))}
                    </select>
                    <BauhausButton 
                      onClick={() => selectedSunoId && window.open(`https://suno.com/song/${selectedSunoId}`, '_blank')}
                      variant="yellow"
                      className="md:w-32"
                    >
                      GO
                    </BauhausButton>
                  </div>
                </div>
              </div>

              {/* TikTok Dropdown */}
              <div className="p-8 border-4 border-bauhaus-black bg-bauhaus-white shadow-[12px_12px_0px_0px_var(--bauhaus-red)]">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-bauhaus-red border-2 border-bauhaus-black text-bauhaus-white flex items-center justify-center">
                      <Video size={20} />
                    </div>
                    <h4 className="text-xl font-display font-black uppercase tracking-widest">TikTok Links</h4>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <select 
                      value={selectedTiktokId}
                      onChange={(e) => setSelectedTiktokId(e.target.value)}
                      className="flex-1 p-4 border-4 border-bauhaus-black font-display font-bold uppercase bg-bauhaus-white focus:outline-none"
                    >
                      <option value="">-- SELECT TIKTOK VIDEO --</option>
                      {tiktokTracks.map((track) => (
                        <option key={track.id} value={track.id}>{track.title}</option>
                      ))}
                    </select>
                    <BauhausButton 
                      onClick={() => selectedTiktokId && window.open(`https://www.tiktok.com/video/${selectedTiktokId}`, '_blank')}
                      variant="red"
                      className="md:w-32"
                    >
                      GO
                    </BauhausButton>
                  </div>
                </div>
              </div>

              {/* YouTube Links Dropdown */}
              <div className="p-8 border-4 border-bauhaus-black bg-bauhaus-white shadow-[12px_12px_0px_0px_var(--bauhaus-blue)]">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-bauhaus-blue border-2 border-bauhaus-black text-bauhaus-white flex items-center justify-center">
                      <Youtube size={20} />
                    </div>
                    <h4 className="text-xl font-display font-black uppercase tracking-widest">YouTube Links</h4>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <select 
                      value={selectedYoutubeLinkId}
                      onChange={(e) => setSelectedYoutubeLinkId(e.target.value)}
                      className="flex-1 p-4 border-4 border-bauhaus-black font-display font-bold uppercase bg-bauhaus-white focus:outline-none"
                    >
                      <option value="">-- SELECT YOUTUBE VIDEO --</option>
                      <optgroup label="ACT 1">
                        {youtubeTracks.filter(t => t.act === 'Act 1').map((track) => (
                          <option key={track.id} value={track.id}>{track.title}</option>
                        ))}
                      </optgroup>
                      <optgroup label="ACT 2">
                        {youtubeTracks.filter(t => t.act === 'Act 2').map((track) => (
                          <option key={track.id} value={track.id}>{track.title}</option>
                        ))}
                      </optgroup>
                    </select>
                    <BauhausButton 
                      onClick={() => selectedYoutubeLinkId && window.open(`https://www.youtube.com/watch?v=${selectedYoutubeLinkId}`, '_blank')}
                      variant="blue"
                      className="md:w-32"
                    >
                      GO
                    </BauhausButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'characters'} onClose={closeModal} title="CHARACTER BIOGRAPHIES">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-bauhaus-black max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
          {/* GUS */}
          <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-bauhaus-red -mr-6 -mt-6 rotate-45" />
            <h3 className="text-3xl font-display font-black uppercase mb-1">GUS</h3>
            <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-60 italic">The closest thing the show has to a conscience.</p>
            <div className="h-1 w-20 bg-bauhaus-black mb-4" />
            <p className="font-sans text-sm leading-relaxed">
              Fresh off work release, homeless, carrying a guilty plea he can’t quite justify, Gus takes a job at Geoff’s because it’s easy and it pays.
              He stays longer than he should. He understands less than he thinks.
              By the time he realizes what he’s standing inside of, the question isn’t what happened.
              It’s what he does now that he knows.
            </p>
          </div>

          {/* GEOFFREY */}
          <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-bauhaus-yellow -mr-6 -mt-6 rotate-45" />
            <h3 className="text-3xl font-display font-black uppercase mb-1">GEOFFREY AARON GOLDSTEIN</h3>
            <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-60 italic">(GEE-AH-ffrey)</p>
            <div className="h-1 w-20 bg-bauhaus-black mb-4" />
            <p className="font-sans text-sm leading-relaxed">
              Charming, generous, brilliant, and completely devoid of a moral center. Geoff is a man who has never been told “no” and has spent his life ensuring he never will be. He doesn’t see himself as a villain; he sees himself as a provider of experiences that the world is too small-minded to appreciate.
            </p>
          </div>

          {/* MAXIE */}
          <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-bauhaus-blue -mr-6 -mt-6 rotate-45" />
            <h3 className="text-3xl font-display font-black uppercase mb-1">ISABELLA “MAXIE” LAURENT</h3>
            <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-60 italic">The architect.</p>
            <div className="h-1 w-20 bg-bauhaus-black mb-4" />
            <p className="font-sans text-sm leading-relaxed">
              If Geoff is the face, Maxie is the brain, the spine, and the cold, hard logic. She doesn’t care about the “experiences”; she cares about the efficiency of the machine. She is the one who makes sure the favors are tracked, the silence is bought, and the empire remains invisible.
            </p>
          </div>

          {/* RONNIE */}
          <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-bauhaus-red -mr-6 -mt-6 rotate-45" />
            <h3 className="text-3xl font-display font-black uppercase mb-1">RONNIE</h3>
            <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-60 italic">The President.</p>
            <div className="h-1 w-20 bg-bauhaus-black mb-4" />
            <p className="font-sans text-sm leading-relaxed">
              A man of simple appetites and complex insecurities. He is the ultimate useful idiot, a figurehead who believes he is in control while being steered by those who understand the levers of power far better than he does.
            </p>
          </div>

          {/* TAMMY */}
          <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-bauhaus-yellow -mr-6 -mt-6 rotate-45" />
            <h3 className="text-3xl font-display font-black uppercase mb-1">TAMMY CALDWELL</h3>
            <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-60 italic">The Solicitor General.</p>
            <div className="h-1 w-20 bg-bauhaus-black mb-4" />
            <p className="font-sans text-sm leading-relaxed">
              Sharp, ambitious, and initially a true believer in the administration. Her journey is one of disillusionment as she realizes that the law she serves is being used as a shield for the very people it should be prosecuting.
            </p>
          </div>

          {/* ASH & CAMMIE */}
          <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-bauhaus-blue -mr-6 -mt-6 rotate-45" />
            <h3 className="text-3xl font-display font-black uppercase mb-1">ASH & CAMMIE</h3>
            <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-60 italic">The Aides.</p>
            <div className="h-1 w-20 bg-bauhaus-black mb-4" />
            <p className="font-sans text-sm leading-relaxed">
              Indistinguishable, efficient, and utterly loyal to the office, if not the man. They are the human embodiment of "Standard Procedure," the ones who make the unthinkable seem routine.
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
              <div className="text-xl font-display font-bold">barry@saintelmo.online</div>
            </div>
            
            <div className="pt-6 border-t border-bauhaus-black/10">
              <p className="text-xs uppercase tracking-widest opacity-40">
                Note: This is a work in progress. All inquiries regarding staging and rights are welcome.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} title="JOIN THE MOVEMENT">
        <div className="py-8 text-bauhaus-black">
          <div className="mb-8">
            <h3 className="text-4xl font-display font-black uppercase leading-none mb-4">
              Stay <span className="text-bauhaus-red">Informed</span>.
            </h3>
            <p className="font-sans text-lg leading-relaxed opacity-80">
              Subscribe to our newsletter for exclusive updates on new scenes, original tracks, 
              and behind-the-scenes production notes. Be the first to know when the curtain rises.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              // In a real app, this would send the email to a server
              console.log('Newsletter signup:', email);
              localStorage.setItem('newsletter_signed_up', 'true');
              setIsNewsletterOpen(false);
              setEmail('');
            }}
            className="space-y-6"
          >
            <div className="relative">
              <BauhausInput
                type="email"
                placeholder="YOUR.EMAIL@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-bauhaus-blue">
                <Mail size={24} />
              </div>
            </div>

            <BauhausButton
              onClick={() => {}} // Form handles submit
              variant="blue"
              className="w-full py-6 text-2xl"
            >
              Subscribe Now
            </BauhausButton>

            <p className="text-center text-xs uppercase tracking-widest opacity-40">
              No spam. No noise. Just the truth.
            </p>
          </form>
        </div>
      </Modal>
    </div>
  );
}
