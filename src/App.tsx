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
  title: string;
  summary: string;
  characters?: string;
  song?: string;
  lyric?: string;
  script?: ScriptLine[];
  hasMusic?: boolean;
  youtubeId?: string;
}

const quotes = [
  { text: "The people being ignored by the opposition in their — Socialist — Autocratic — Centralized federal — States' rights rhetorical — Mess.", source: "[CAM & ASH - Act 1, Scene 7]" },
  { text: "He's not like us the way I thought.", source: "[Geoff - Act 1, Scene 8]" },
  { text: '"I wasn’t protecting you, sir.\nI was protecting people from you."', source: "[Officer Watson - Act 1, Scene 9]" },
  { text: '"First of all, she’s very talented. Very talented. Second — we need more women in positions like this. We really do. I looked around the room the other day and I said, “Where are the women lawyers?” And somebody said, “Well, sir, we have Tammy.” And I said, “Good. Let’s get Tammy up here.” But in all seriousness, she’s earned it."', source: "[Ronnie - Act 1, Scene 12]" },
  { text: "I don't spiral. I orbit.", source: "[Geoff - Act 1, Scene 12]" },
  { text: '"You won\'t quit, Maxie. You\'ll smoke twice as much and your skin will wrinkle from all the stress"', source: "[Geoff - Act 1, Scene 6]" },
  { text: "I didn't disappear. I got kidnapped by the Department of Justice", source: "[Lila - Act 1, Scene 3]" },
  { text: "Something will happen.", source: "[Geoff - Act 1, Scene 12]" },
  { text: '"I like you." "You don\'t know me." "I know enough." "That\'s what the judge said."', source: "[Geoff & Gus - Act 1, Scene 2]" },
  { text: '"Tell me which one are you, friend — the carpet or the bug?" "I\'m the bug who ate the carpet then threw up on the rug, lost the job, then lost the wife, then found the bottom of the jug."', source: "[Geoff & Gus - Act 1, Scene 2]" },
  { text: '"I choose to remember the man who saved me, not the monster I suspect you might be."', source: "[Geoff & Gus - Act 1, Scene 1]" },
  { text: "I didn't touch - I didn't go - I didn't - that's not the point. She wasn't real but the moment was. And I know that matters.", source: "[Gus - Act 2, Scene 9]" },
  { text: "My situation is that woman.", source: "[Ronnie - Act 2, Scene 13]" },
  { text: '"I have not given my signature to any document that is documentable to allow the transfer of the case and its context from SDNY. They, per the documented documents, retain jurisdiction. I am granting the contextually appropriate and legally required time to complete their investigation due to new evidence. My office will receive the case formally when they present a contextually and properly documented document, procedurally consistent with any signature a signatory might sign by design. But until a signed documented with documentable and contextually and legally appropriate signature is presented and reviewed - in context - and with proper documents and or the signatory present to validate that the signature was properly affixed to require documents of transfer, then any future document you or I consider will lack sufficient documentation to affix any signature of our respective offices — or their Director\'s. Or, would the DOJ or the FBI care to arrest on new charges Mr. Gus here, or are you here to take the case formally?"', source: "[Tammy - Act 2, Scene 14]" },
  { text: '"Excuse me. The coffee cart doesn\'t have enough booze on it. I know it\'s early but — Your outfit makes me want to start drinking something —"', source: "[Maxie - Act 1, Scene 8]" },
  { text: '"I have read every file. I have sat with every allegation. And I am not satisfied. It would fly in the face of justice — It would fly in the face of this office — It would fly in the face of every word written down, ratified, and signed — to look at what these people have carried and say: not today."', source: "[Tammy - Act 2, Scene 14]" },
  { text: '"A Southern social climber — very impressive. Unmarried, I notice. I mean — unpartnered. I mean — a strong, independent woman, high-profile role, no children — I\'m assuming you\'re probably a les — I don\'t have any problem with the LGBT — D — I — X — — whatever they\'re calling themselves this year. More letters every time I turn around. I think we should just call them all gay. I mean, they are gay, right? It\'s better than calling anyone a dy —"', source: "[Ronnie - Act 2, Scene 8]" }
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
    { id: 'ETAlIfgJZKY', act: 'Act 1', scene: 'Intro', title: 'Allegedly', versions: { '1.0': 'ETAlIfgJZKY', '1.5': 'BpXg1siK0Gk5VrXl' } },
    { id: 'ysue5dEzxjI', act: 'Act 1', scene: 'Scene 1', title: 'Sweetheart Deal', versions: { '1.0': 'ysue5dEzxjI' } },
    { id: '_lhwSoj4ilk', act: 'Act 1', scene: 'Scene 2', title: 'Who Was That (PrePrise 1)', versions: { '1.0': '_lhwSoj4ilk' } },
    { id: 'BThrcKexGvA', act: 'Act 1', scene: 'Scene 3', title: 'They Were Only Boys', versions: { '1.0': 'BThrcKexGvA', '2.0': 'RhZ3OAIIJk2IiK88' } },
    { id: 'Qg-SA255BA4', act: 'Act 1', scene: 'Scene 4', title: 'Reasonable Man', versions: { '1.0': 'Qg-SA255BA4', '2.0': 'RhZ3OAIIJk2IiK88' } },
    { id: 'RcVaEHwWUyo', act: 'Act 1', scene: 'Scene 5', title: 'Questions & Answers', versions: { '1.0': 'RcVaEHwWUyo' } },
    { id: '8yOpukgj600', act: 'Act 1', scene: 'Scene 6', title: 'Little Secrets', versions: { '1.0': '8yOpukgj600' } },
    { id: 'zT0aXnfWyIM', act: 'Act 1', scene: 'Scene 7', title: "Welcome to Lil'Elmo", versions: { '1.0': 'zT0aXnfWyIM' } },
    { id: 'wnLDgj_xywo', act: 'Act 1', scene: 'Scene 11', title: 'I Know What Happened on That Island', versions: { '1.0': 'wnLDgj_xywo' } },
    { id: 'Y35kzg4vQBQ', act: 'Act 1', scene: 'Scene 12', title: 'Who Was That, Part 2', versions: { '1.0': 'Y35kzg4vQBQ' } },
    { id: 'qIVQvbwPohQ', act: 'Act 1', scene: 'Scene 14', title: 'The Arrest', versions: { '1.0': 'qIVQvbwPohQ' } },
    { id: 'YBeARM-lNeo', act: 'Act 1', scene: 'Finale', title: 'Standard Procedure', versions: { '1.0': 'YBeARM-lNeo' } },
    { id: 'YmZRKBgGhaw', act: 'Act 2', scene: 'Intro', title: 'Who Was That? (Part 3)', versions: { '1.0': 'YmZRKBgGhaw' } },
    { id: 'iJNhZs7p_2Y', act: 'Act 2', scene: 'Scene 5', title: 'Witch Hunt & Snowstorm', versions: { '1.0': 'iJNhZs7p_2Y', '2.0': 'eTmFxsTFifeHgvdd' } },
    { id: '08OeZli8uf8', act: 'Act 2', scene: 'Scene 8', title: 'What Did You Do', versions: { '1.0': '08OeZli8uf8' } },
    { id: 'wdesqA9Er9c', act: 'Act 2', scene: 'Scene 9', title: 'Just Like Them, Just Like Me', versions: { '1.0': 'wdesqA9Er9c' } },
    { id: 'Jk3R5NF6eqs', act: 'Act 2', scene: 'Scene 12', title: 'I Need to Walk', versions: { '1.0': 'Jk3R5NF6eqs' } },
    { id: 'j1lVwTeycPQ', act: 'Act 2', scene: 'Scene 13', title: 'Not Unreasonable, Man', versions: { '1.0': 'j1lVwTeycPQ' } },
    { id: 'cSVe6MhYpC0', act: 'Act 2', scene: 'Scene 14', title: 'We the People', versions: { '1.0': 'cSVe6MhYpC0' } },
  ];

  const sunoTracks = [
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
    { id: 'RhZ3OAIIJk2IiK88', version: 'v2.0', title: 'Reasonable Man' },
    { id: 'eTmFxsTFifeHgvdd', version: 'v2.0', title: 'Snowstorm & Witch Hunt' },
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

  const openLyrics = (scene: Scene, act: 1 | 2, index: number) => {
    setCurrentScene(scene);
    setCurrentAct(act);
    setCurrentSceneIndex(index);
    setActiveModal('lyrics');
  };

  const nextScene = () => {
    const scenes = currentAct === 1 ? act1Scenes : act2Scenes;
    if (currentSceneIndex < scenes.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      const nextS = scenes[nextIdx];
      if (currentAct === 1) setSelectedAct1SceneIndex(nextIdx);
      else setSelectedAct2SceneIndex(nextIdx);
      
      if (activeModal === 'lyrics' && !nextS.hasMusic) {
        openSceneText(nextS, currentAct!, nextIdx);
      } else if (activeModal === 'lyrics') {
        openLyrics(nextS, currentAct!, nextIdx);
      } else {
        openSceneText(nextS, currentAct!, nextIdx);
      }
    }
  };

  const prevScene = () => {
    const scenes = currentAct === 1 ? act1Scenes : act2Scenes;
    if (currentSceneIndex > 0) {
      const prevIdx = currentSceneIndex - 1;
      const prevS = scenes[prevIdx];
      if (currentAct === 1) setSelectedAct1SceneIndex(prevIdx);
      else setSelectedAct2SceneIndex(prevIdx);

      if (activeModal === 'lyrics' && !prevS.hasMusic) {
        openSceneText(prevS, currentAct!, prevIdx);
      } else if (activeModal === 'lyrics') {
        openLyrics(prevS, currentAct!, prevIdx);
      } else {
        openSceneText(prevS, currentAct!, prevIdx);
      }
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
      youtubeId: "niNLu3u8Fps",
      lyric: "ALLEGEDLY! ALLEGEDLY!\nWe must use the word 'allegedly' until the final gavel falls.\nGeoffrey Aaron Goldstein. Convicted. Continental. Charismatic.\nThe world is a stage, and I've simply bought the best seats.",
      script: [
        { type: 'stage-direction', text: "The stage is a chaotic swirl of camera flashes and news tickers. REPORTERS scramble across the stage, microphones thrust forward like weapons." },
        { type: 'dialogue', speaker: "REPORTER 1", text: "Geoffrey Aaron Goldstein. Convicted. Continental. Charismatic." },
        { type: 'dialogue', speaker: "REPORTER 2", text: "Allegedly. We must use the word 'allegedly' until the final gavel falls." },
        { type: 'stage-direction', text: "GEOFF enters, perfectly tailored, a slight smirk playing on his lips. He ignores the reporters, looking directly at the audience." },
        { type: 'dialogue', speaker: "GEOFF", text: "The world is a stage, and I've simply bought the best seats." },
        { type: 'stage-direction', text: "MAXIE appears in the shadows, watching Geoff. She checks her watch, then her phone. She is the engine behind the machine." },
        { type: 'dialogue', speaker: "MAXIE", text: "Geoff, the car is waiting. We have three minutes before the Solicitor General's office releases the statement." },
        { type: 'dialogue', speaker: "GEOFF", text: "Let them release it. A statement is just words. I deal in reality." }
      ]
    },
    { 
      id: "01-01", 
      title: "Sweetheart Deal", 
      summary: "Geoff secures a lenient house arrest deal while his empire continues to grow.", 
      characters: "Geoff, Maxie, Buck Jr, Stacey, Officer",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      script: [
        { type: 'dialogue', speaker: "BUCK JR.", text: "We pushed as far as we could." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "You’re well above the curve on this." },
        { type: 'dialogue', speaker: "GEOFF", text: "I prefer attention and elegance." },
        { type: 'dialogue', speaker: "GEOFF", text: "This feels... transactional." },
        { type: 'dialogue', speaker: "MAXIE", text: "Obvious. Painfully so." },
        { type: 'dialogue', speaker: "MAXIE", text: "I’ll order a Chanel ankle monitor cover for that - thing." },
        { type: 'stage-direction', text: "STACEY enters with OFFICER." },
        { type: 'stage-direction', text: "Quietly, to MAXIE." },
        { type: 'dialogue', speaker: "GEOFF", text: "Best behavior, old girl, the fuzz is in the building." },
        { type: 'stage-direction', text: "MAXIE and GEOFF laugh." },
        { type: 'stage-direction', text: "Clears throat." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "You'll have an escort from Pine Ridge Minimum Security. They will stay with you here - 8 to 8, six days a week. Sundays, you stay in the facility." },
        { type: 'dialogue', speaker: "MAXIE", text: "How liturgical." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "They do have religious services there, and the rabbi sits on the release board. You should make a strong impression to him." },
        { type: 'dialogue', speaker: "GEOFF", text: "I’ll practice my Hebrew." },
        { type: 'dialogue', speaker: "MAXIE", text: "Wouldn’t it be God’s joke - to lock you up solely to bring you back into the flock?" },
        { type: 'dialogue', speaker: "GEOFF", text: "If God is real, he’s really funny, especially if that’s his use of divine power." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Consider the time good for reflection. Think optics, and early release. You could be out in a year - maybe 15 months at most - if you’re on your best behavior." },
        { type: 'stage-direction', text: "STACEY pulls phone out - it’s buzzing. The STACEY taps BUCK JR on the shoulder and hands the phone to him." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "I have to take this. A moment." },
        { type: 'stage-direction', text: "BUCK JR step out the door, BUCK on the phone." },
        { type: 'dialogue', speaker: "STACEY", text: "Mr. Goldstein?" },
        { type: 'dialogue', speaker: "GEOFF", text: "Um - yes? Who are you, princess?" },
        { type: 'dialogue', speaker: "STACEY", text: "Mr. Buck’s paralegal, sir. While he’s out, I was wondering if you’ve finished the prescreening forms for your approved guests." },
        { type: 'dialogue', speaker: "GEOFF", text: "I’ll have it tomorrow. And the staff list?" },
        { type: 'stage-direction', text: "Looks confused" },
        { type: 'dialogue', speaker: "STACEY", text: "I'll check, but the court didn't mention a staff list." },
        { type: 'dialogue', speaker: "GEOFF", text: "Thank you, princess. I’ll get it done as soon as we finish." },
        { type: 'stage-direction', text: "Beat" },
        { type: 'dialogue', speaker: "GEOFF", text: "You have my direct line?" },
        { type: 'stage-direction', text: "Stacey nods." },
        { type: 'stage-direction', text: "MAXIE notes the interaction, smiling." },
        { type: 'dialogue', speaker: "MAXIE", text: "You’re very pretty. Exquisite bone structure." },
        { type: 'dialogue', speaker: "MAXIE", text: "Very patrician. Old World." },
        { type: 'dialogue', speaker: "MAXIE", text: "I almost feel I’m looking at one of my sisters. What’s your name?" },
        { type: 'dialogue', speaker: "STACEY", text: "Yes, Ms. Laurent, my name-" },
        { type: 'stage-direction', text: "BUCK JR returns, sees electricity in the air, dismisses STACEY." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Thank you, Stacey. I’ll see you back at the office." },
        { type: 'stage-direction', text: "To Geoff" },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Any questions?" },
        { type: 'stage-direction', text: "STACEY leaves, blushes and smiles and waves at GEOFF before she leaves." },
        { type: 'stage-direction', text: "STACEY gone." },
        { type: 'dialogue', speaker: "GEOFF", text: "Lawyers always ruin the fun." },
        { type: 'stage-direction', text: "Sigh" },
        { type: 'dialogue', speaker: "GEOFF", text: "Less temptation is good for the solitude, I suppose." },
        { type: 'dialogue', speaker: "MAXIE", text: "Builds character." },
        { type: 'dialogue', speaker: "MAXIE", text: "But there’s always temptation." },
        { type: 'dialogue', speaker: "MAXIE", text: "Something will nibble." },
        { type: 'dialogue', speaker: "MAXIE", text: "You will bite." },
        { type: 'stage-direction', text: "The POLICE OFFICER shifts slightly." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "As your legal counsel, I advise that you take your time seriously. Grow, Reflect. Try to make all of our jobs easier." },
        { type: 'dialogue', speaker: "GEOFF", text: "Of course. I always do." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "My father sends his regards. That was him, on the phone." },
        { type: 'dialogue', speaker: "GEOFF", text: "How is old Buck Senior?" },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Just fine. He retired, divorced Mom, and is on month six of a trans-world cruise. I think he’s in Jakarta today." },
        { type: 'dialogue', speaker: "GEOFF", text: "Of course he is. He sent me pictures this morning." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "He was very specific that I should take excellent care, Jeff-" },
        { type: 'dialogue', speaker: "GEOFF", text: "Gee-off." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "I’m sorry?" },
        { type: 'dialogue', speaker: "GEOFF", text: "It's pronounced Gee-off." },
        { type: 'dialogue', speaker: "MAXIE", text: "Gee-off. Jeff is so - new world. So-" },
        { type: 'dialogue', speaker: "MAXIE", text: "Honky-tonk." },
        { type: 'dialogue', speaker: "GEOFF", text: "Tax deductible." },
        { type: 'stage-direction', text: "Inside joke laughter.." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Gee-off." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Of course." },
        { type: 'dialogue', speaker: "MAXIE", text: "It’s continental." },
        { type: 'dialogue', speaker: "GEOFF", text: "It travels better." },
        { type: 'dialogue', speaker: "GEOFF", text: "International." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Right." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Well." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "He thinks the world of you." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "For everything you did for him." },
        { type: 'dialogue', speaker: "GEOFF", text: "I look after my friends." },
        { type: 'dialogue', speaker: "GEOFF", text: "Buck was a good man." },
        { type: 'dialogue', speaker: "GEOFF", text: "Raised a good family." },
        { type: 'dialogue', speaker: "GEOFF", text: "Smart kids." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Thank you." },
        { type: 'stage-direction', text: "A flicker of pride." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "I just wish we could have done better." },
        { type: 'dialogue', speaker: "GEOFF", text: "You did well." },
        { type: 'dialogue', speaker: "GEOFF", text: "I made a mistake." },
        { type: 'dialogue', speaker: "GEOFF", text: "We all pay the piper." },
        { type: 'dialogue', speaker: "MAXIE", text: "Expensive piper." },
        { type: 'dialogue', speaker: "GEOFF", text: "Legal talent costs money." },
        { type: 'dialogue', speaker: "GEOFF", text: "Breeding saves time." },
        { type: 'stage-direction', text: "Beat*." },
        { type: 'dialogue', speaker: "GEOFF", text: "This is a deal any man could dream of." },
        { type: 'stage-direction', text: "He adjusts his cuff." },
        { type: 'dialogue', speaker: "GEOFF", text: "Tell your father you did well, kid." },
        { type: 'dialogue', speaker: "GEOFF", text: "And keep me in mind if you ever need a recommendation." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'dialogue', speaker: "MAXIE", text: "It’s quite the arrangement." },
        { type: 'dialogue', speaker: "GEOFF", text: "No." },
        { type: 'stage-direction', text: "Beat*." },
        { type: 'dialogue', speaker: "GEOFF", text: "It’s a sweetheart deal." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'stage-direction', text: "Silence." },
        { type: 'dialogue', speaker: "MAXIE", text: "Counsel." },
        { type: 'dialogue', speaker: "MAXIE", text: "Do you have anything on your schedule now?" },
        { type: 'dialogue', speaker: "BUCK JR.", text: "No." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "I’m free — if there’s anything else you need." },
        { type: 'dialogue', speaker: "MAXIE", text: "Good." },
        { type: 'dialogue', speaker: "MAXIE", text: "I need to review the holding structures and the offshore allocations." },
        { type: 'dialogue', speaker: "MAXIE", text: "I have the paperwork pulled up in my office." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'dialogue', speaker: "MAXIE", text: "Shall we?" },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Yes." },
        { type: 'dialogue', speaker: "BUCK JR.", text: "Yes, of course." },
        { type: 'stage-direction', text: "They begin to move." },
        { type: 'dialogue', speaker: "MAXIE", text: "Oh — and that noisy woman on the Hill." },
        { type: 'dialogue', speaker: "MAXIE", text: "What are we—" },
        { type: 'dialogue', speaker: "GEOFF", text: "Maxie." },
        { type: 'dialogue', speaker: "GEOFF", text: "Let the boy breathe." },
        { type: 'stage-direction', text: "MAXIE stops." },
        { type: 'stage-direction', text: "Turns slowly to Geoff." },
        { type: 'dialogue', speaker: "MAXIE", text: "He will." },
        { type: 'dialogue', speaker: "MAXIE", text: "On his time." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'dialogue', speaker: "MAXIE", text: "Don’t spiral." },
        { type: 'dialogue', speaker: "GEOFF", text: "I don’t spiral." },
        { type: 'dialogue', speaker: "MAXIE", text: "You orbit." },
        { type: 'stage-direction', text: "She turns and exits down the hall." },
        { type: 'dialogue', speaker: "MAXIE", text: "The LAWYER follows immediately." },
        { type: 'stage-direction', text: "Door closes." },
        { type: 'stage-direction', text: "Silence." },
        { type: 'stage-direction', text: "Geoff remains with the POLICE OFFICER." },
        { type: 'stage-direction', text: "He adjusts his cuff." },
        { type: 'dialogue', speaker: "GEOFF", text: "She’s quite a dame." },
        { type: 'dialogue', speaker: "GEOFF", text: "The OFFICER grunts. Nothing more." },
        { type: 'dialogue', speaker: "GEOFF", text: "You smoke?" },
        { type: 'dialogue', speaker: "OFFICER", text: "Nope." },
        { type: 'dialogue', speaker: "GEOFF", text: "Mind if I?" },
        { type: 'dialogue', speaker: "OFFICER", text: "Go ahead." },
        { type: 'dialogue', speaker: "GEOFF", text: "Care to join me?" },
        { type: 'dialogue', speaker: "OFFICER", text: "Nope." },
        { type: 'dialogue', speaker: "OFFICER", text: "I’ll watch from here." },
        { type: 'dialogue', speaker: "GEOFF", text: "It’s cold." },
        { type: 'dialogue', speaker: "OFFICER", text: "You’re not going anywhere." },
        { type: 'dialogue', speaker: "GEOFF", text: "Right." },
        { type: 'dialogue', speaker: "GEOFF", text: "The monitor." },
        { type: 'dialogue', speaker: "GEOFF", text: "I wear it all the time." },
        { type: 'dialogue', speaker: "OFFICER", text: "That’s the plan." },
        { type: 'dialogue', speaker: "GEOFF", text: "I’ll just be outside." },
        { type: 'dialogue', speaker: "OFFICER", text: "Mm-hm." },
        { type: 'dialogue', speaker: "OFFICER", text: "I know." },
        { type: 'stage-direction', text: "Geoff studies him a moment." },
        { type: 'dialogue', speaker: "GEOFF", text: "Tough crowd." },
        { type: 'stage-direction', text: "The OFFICER does not react." },
        { type: 'stage-direction', text: "Geoff moves toward the door." },
        { type: 'dialogue', speaker: "GEOFF", text: "It opens." },
        { type: 'stage-direction', text: "Cold morning light spills in." },
        { type: 'stage-direction', text: "He steps outside." },
        { type: 'stage-direction', text: "Blackout." }
      ]
    },
    { 
      id: "01-02", 
      title: "Who Was That - Preprise 1", 
      summary: "Gus, a homeless man, catches a glimpse of the island's inner workings.", 
      characters: "Gus, Maxie",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      lyric: "WHO WAS THAT?\nIn the shadows of the pier.\nWHO WAS THAT?\nA face I shouldn't fear.\nBut the eyes, they tell a story\nOf a power and a glory\nThat I'll never, ever know.",
      script: [
        { type: 'stage-direction', text: "A foggy pier at night. GUS, disheveled but alert, watches a sleek black boat dock. MAXIE steps off, looking like a ghost in the mist." },
        { type: 'dialogue', speaker: "GUS", text: "I saw them. The boats. They don't look like fishing boats." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'dialogue', speaker: "MAXIE", text: "Gus, isn't it? You have a very observant eye for someone with so little." },
        { type: 'dialogue', speaker: "GUS", text: "I see what I see. And I see things that don't belong." },
        { type: 'dialogue', speaker: "MAXIE", text: "Belonging is a matter of perspective. Some things belong in the dark. Some people belong in the light. And some... well, some just belong to us." }
      ]
    },
    { 
      id: "01-03", 
      title: "The Conscience Clause", 
      summary: "Maxie and Geoff discuss the need for a 'conscience' in their operation.", 
      characters: "Geoff, Maxie",
      hasMusic: false,
      script: [
        { type: 'stage-direction', text: "GEOFF's study. He's playing with a gold coin, flipping it repeatedly." },
        { type: 'dialogue', speaker: "MAXIE", text: "We need someone who looks like they have nothing to lose, but everything to gain." },
        { type: 'dialogue', speaker: "GEOFF", text: "A witness who won't be believed? Or a believer who won't be a witness?" },
        { type: 'dialogue', speaker: "MAXIE", text: "I was thinking of Gus. He's perfect. Invisible, articulate enough to be useful, but broken enough to be discarded." },
        { type: 'dialogue', speaker: "GEOFF", text: "A conscience clause. I like it. Every contract needs one, even if it's never meant to be exercised." }
      ]
    },
    { 
      id: "01-04", 
      title: "They Were Just Boys", 
      summary: "A haunting number about the vulnerability of those caught in the web.", 
      characters: "Survivor, Ensemble",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      lyric: "THEY WERE JUST BOYS\nWith dreams of a life they'd never see.\nTHEY WERE JUST BOYS\nCaught in a web of luxury.\nNow the silence is the only sound\nIn a world where justice can't be found.",
      script: [
        { type: 'stage-direction', text: "A stark, blue-lit stage. A single SURVIVOR stands center, surrounded by the shadows of the ENSEMBLE." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'dialogue', speaker: "SURVIVOR", text: "They promised us a future. They only gave us a past we can't forget." },
        { type: 'stage-direction', text: "The ENSEMBLE begins a slow, rhythmic movement, mirroring the Survivor's internal struggle." },
        { type: 'dialogue', speaker: "SURVIVOR", text: "We were just numbers on a ledger. A billion here, a favor there. And we were the change." }
      ]
    },
    { 
      id: "01-05", 
      title: "Reasonable Man", 
      summary: "The Solicitor General struggles with the pressure to look the other way.", 
      characters: "Solicitor General, Assistant",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      lyric: "I'M A REASONABLE MAN\nI follow the law, I follow the plan.\nBut when the truth is a jagged pill\nAnd the powerful have the will to kill\nCan I still be a reasonable man?",
      script: [
        { type: 'stage-direction', text: "A cluttered office in the Department of Justice. THE SOLICITOR GENERAL is buried under files." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'dialogue', speaker: "SOLICITOR GENERAL", text: "I'm a reasonable man. But reason has its limits when the evidence is this loud." },
        { type: 'dialogue', speaker: "ASSISTANT", text: "Sir, the White House is on line two. They're asking about the 'Continental' case." },
        { type: 'dialogue', speaker: "SOLICITOR GENERAL", text: "Tell them I'm busy being reasonable. And tell them the law doesn't have a line two." }
      ]
    },
    { 
      id: "01-06", 
      title: "A Billion Here, A Favor There", 
      summary: "The currency of the island is exposed.", 
      characters: "Geoff, Maxie, Ensemble",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      lyric: "A BILLION HERE, A FAVOR THERE\nThat's how you build a world that's fair.\nFair for us, and fair for them\nAs long as we can keep the gem\nOf silence in the air.",
      script: [
        { type: 'stage-direction', text: "A lavish party on the island. GEOFF and MAXIE move through the crowd, whispering to various guests." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'dialogue', speaker: "GEOFF", text: "A billion here, a favor there. That's how you build a world where the sun never sets on your secrets." },
        { type: 'dialogue', speaker: "MAXIE", text: "And where the moon never rises on your crimes." }
      ]
    },
    { 
      id: "01-07", 
      title: "Questions & Answers", 
      summary: "A tense interrogation scene.", 
      characters: "Tammy, Maxie",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      lyric: "QUESTIONS AND ANSWERS\nA dance for the chancers.\nI ask the truth, you tell a lie\nAnd we both wait for the day to die\nIn this game of questions and answers.",
      script: [
        { type: 'stage-direction', text: "A stark interrogation room. TAMMY sits across from MAXIE." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'dialogue', speaker: "TAMMY", text: "Where were you on the night of the 14th, Maxie?" },
        { type: 'dialogue', speaker: "MAXIE", text: "I was exactly where I was supposed to be. Protecting the interests of the elite." },
        { type: 'dialogue', speaker: "TAMMY", text: "And the interests of the girls? Who was protecting them?" },
        { type: 'dialogue', speaker: "MAXIE", text: "In our world, Tammy, everyone is an interest. Some just have a higher rate of return." }
      ]
    },
    { 
      id: "01-08", 
      title: "Little Secrets", 
      summary: "Maxie's solo about the power of knowing what others hide.", 
      characters: "Maxie",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      lyric: "LITTLE SECRETS\nI keep them in a jar.\nLITTLE SECRETS\nI know exactly who you are.\nAnd when the time is right\nI'll bring them to the light\nAnd watch you fall from afar.",
      script: [
        { type: 'stage-direction', text: "MAXIE alone on stage, holding a small, ornate box. She opens it, and a soft, golden light spills out." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'dialogue', speaker: "MAXIE", text: "Everyone has a little secret. I just happen to have the keys to all their closets." },
        { type: 'dialogue', speaker: "MAXIE", text: "It's not about the money. It's about the leverage. And I have enough to move the world." }
      ]
    },
    { 
      id: "01-09a", 
      title: "The Sidewalk Meeting", 
      summary: "Geoff meets Gus on the sidewalk and offers him a job as his personal assistant.", 
      characters: "Geoff, Gus, Officer Watson",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      script: [
        { type: 'stage-direction', text: "Exterior terrace / sidewalk." },
        { type: 'stage-direction', text: "GUS sits on a milk crate. Cardboard sign. Doesn’t look up." },
        { type: 'dialogue', speaker: "GUS", text: "Hey — you got a dollar?" },
        { type: 'stage-direction', text: "Geoff steps down." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'dialogue', speaker: "GEOFF", text: "Stay right here. I'll be right back." },
        { type: 'stage-direction', text: "GEOFF goes inside to a drink cart, ignoring the OFFICER who has been watching. GEOFF begins to pour. One cup. Then, without breaking rhythm, a second." },
        { type: 'dialogue', speaker: "OFFICER", text: "Two cups. How nice. I prefer mine black." },
        { type: 'stage-direction', text: "Geoff takes a breath in, a little startled but not sweating." },
        { type: 'dialogue', speaker: "GEOFF", text: "Of course. Please — mi casa es—" },
        { type: 'dialogue', speaker: "OFFICER", text: "Su casa?" },
        { type: 'stage-direction', text: "He brings it to his nose. A genuine moment of curiosity." },
        { type: 'dialogue', speaker: "OFFICER", text: "Good roast. Strong. Hints of — cinnamon? Cacao?" },
        { type: 'dialogue', speaker: "GEOFF", text: "You know coffee." },
        { type: 'dialogue', speaker: "OFFICER", text: "I know a lot of things." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'dialogue', speaker: "GEOFF", text: "Single-origin cooperative. High elevation. Volcanic soil. Direct trade. Very clean finish. Patagonia." },
        { type: 'dialogue', speaker: "OFFICER", text: "Mm. Never heard of any of that. I'll look it up on my break." },
        { type: 'dialogue', speaker: "GEOFF", text: "Your job must be killer." },
        { type: 'dialogue', speaker: "OFFICER", text: "Sure beats working the corner, right?" },
        { type: 'stage-direction', text: "Silence." },
        { type: 'dialogue', speaker: "GEOFF", text: "Staff is cleared to come and go?" },
        { type: 'dialogue', speaker: "OFFICER", text: "Yes. Why?" },
        { type: 'dialogue', speaker: "GEOFF", text: "My personal assistant is here. New guy — started during the trial. He's essential, runs all over the city. I wasn't sure if he could come play, with all the commotion and everything—" },
        { type: 'stage-direction', text: "A glance at his cup." },
        { type: 'dialogue', speaker: "GEOFF", text: "coffee beans." },
        { type: 'stage-direction', text: "He moves past the Officer before another question can form." },
        { type: 'dialogue', speaker: "OFFICER", text: "I wasn't made aware of one. Who is that?" },
        { type: 'stage-direction', text: "Geoff is already at the terrace door." },
        { type: 'dialogue', speaker: "GEOFF", text: "I'll grab him. Great guy. You'll love him." },
        { type: 'stage-direction', text: "Exterior terrace. Geoff steps out with the second cup of coffee for Gus." },
        { type: 'dialogue', speaker: "GEOFF", text: "Coffee." },
        { type: 'dialogue', speaker: "GUS", text: "Thanks." },
        { type: 'dialogue', speaker: "GEOFF", text: "Couldn't bring the dry outside." },
        { type: 'dialogue', speaker: "GEOFF", text: "Gus smells it. Makes a face." },
        { type: 'dialogue', speaker: "GUS", text: "Did you put chocolate syrup in this?" },
        { type: 'dialogue', speaker: "GEOFF", text: "Don't tell Sherlock. To him it's Eritrea's finest." },
        { type: 'dialogue', speaker: "GUS", text: "Eritrea?" },
        { type: 'dialogue', speaker: "GEOFF", text: "Ethiopia. Maybe Chile. I said something - expensive sounding. (leaning in) It's from the convenience store down the block. I add cocoa powder." },
        { type: 'stage-direction', text: "Gus laughs." },
        { type: 'dialogue', speaker: "GEOFF", text: "Lucky for you, I have a proposition you'd be foolish not to consider. You need a job. You need a bed. I need assistance." },
        { type: 'dialogue', speaker: "GUS", text: "I'm not—" },
        { type: 'stage-direction', text: "He stops himself. Looks around. Feels the cold." },
        { type: 'dialogue', speaker: "GUS", text: "I mean. It is getting cold." },
        { type: 'stage-direction', text: "A beat. Then, carefully:" },
        { type: 'dialogue', speaker: "GUS", text: "I'm not the punk, though. Deal?" },
        { type: 'stage-direction', text: "Geoff freezes. Then laughs — genuinely, which is rare." },
        { type: 'dialogue', speaker: "GEOFF", text: "You won't be anyone's punk standing next to me. (grinning) And you're not my type either. Relax. But just in case it gets lonely, I'll take your preference under advisement." },
        { type: 'stage-direction', text: "Gus smirks." },
        { type: 'dialogue', speaker: "GEOFF", text: "Come on in. Let's get you set up." },
        { type: 'dialogue', speaker: "GUS", text: "I'm allowed?" },
        { type: 'dialogue', speaker: "GEOFF", text: "It's my house." },
        { type: 'dialogue', speaker: "GUS", text: "The cop." },
        { type: 'stage-direction', text: "Geoff knocks on the glass. The Officer opens the door just enough." },
        { type: 'dialogue', speaker: "GEOFF", text: "Sherlock — this is—" },
        { type: 'dialogue', speaker: "GUS", text: "Gus." },
        { type: 'dialogue', speaker: "OFFICER", text: "Gus." },
        { type: 'stage-direction', text: "He looks Gus over like he's reading a document." },
        { type: 'dialogue', speaker: "OFFICER", text: "He's staff?" },
        { type: 'dialogue', speaker: "GEOFF", text: "Personal assistant. He assists me. Personally." },
        { type: 'dialogue', speaker: "OFFICER", text: "He checks in when he leaves and when he returns. Will he be here at night when you're up the street?" },
        { type: 'dialogue', speaker: "GEOFF", text: "He's a grown man. He sleeps where he likes. He will be taking the guest apartment around back. But Gus - (approving) Gus - here will be absolutely necessary while I'm on site." },
        { type: 'stage-direction', text: "A beat. Geoff tilts his head, almost charmed by his own situation. He walks by OFFICER, GUS follows hesitantly, excusing himself and offering a hand." },
        { type: 'dialogue', speaker: "GUS", text: "Nice to meet you." },
        { type: 'stage-direction', text: "The OFFICER looks at him, then at GEOFF, then back at GUS." },
        { type: 'dialogue', speaker: "OFFICER", text: "Gus" },
        { type: 'dialogue', speaker: "GUS", text: "Gus." },
        { type: 'dialogue', speaker: "GEOFF", text: "Geoff! Gus?" },
        { type: 'dialogue', speaker: "OFFICER", text: "We'll make sure we have all the paperwork arranged for you tomorrow, Mr. Gus." },
        { type: 'dialogue', speaker: "GEOFF", text: "You know, this whole incarceration arrangement — very nice of the State of New York to provide a doorman and security. But HR is my business, Sherlock. I'll call Scotland Yard myself." },
        { type: 'dialogue', speaker: "OFFICER", text: "Watson." },
        { type: 'dialogue', speaker: "GEOFF", text: "I'm sorry." },
        { type: 'dialogue', speaker: "OFFICER", text: "Officer Watson - that's my name, Gee-off." },
        { type: 'stage-direction', text: "Stunned Silence." },
        { type: 'dialogue', speaker: "GEOFF", text: "Of course, Watson, Gus?" },
        { type: 'dialogue', speaker: "GUS", text: "I'm right behind you." },
        { type: 'dialogue', speaker: "OFFICER", text: "I'll be here." },
        { type: 'dialogue', speaker: "GEOFF", text: "He's very good at his job. And what a sweetheart, isn't he?" }
      ]
    },
    { 
      id: "01-09b", 
      title: "Courthouse Gossip", 
      summary: "Tammy, Lila, and Stacey discuss the 'sweetheart deal' in the courthouse hallway.", 
      characters: "Lila, Stacey, Tammy",
      hasMusic: false,
      script: [
        { type: 'stage-direction', text: "Interior – Federal courthouse hallway. Midday." },
        { type: 'stage-direction', text: "LILA exits her office with her bag. STACEY waits near the elevators, scrolling her phone." },
        { type: 'dialogue', speaker: "LILA", text: "Ready?" },
        { type: 'dialogue', speaker: "STACEY", text: "Starving." },
        { type: 'dialogue', speaker: "STACEY", text: "They start walking." },
        { type: 'stage-direction', text: "TAMMY steps out of her office behind them, holding a folder." },
        { type: 'dialogue', speaker: "TAMMY", text: "Lila — the sentencing memo from—" },
        { type: 'stage-direction', text: "She stops when she sees Stacey." },
        { type: 'dialogue', speaker: "TAMMY", text: "Do you work here too?" },
        { type: 'dialogue', speaker: "STACEY", text: "Oh — no — next building. Corporate defense." },
        { type: 'dialogue', speaker: "STACEY", text: "We’re neighbors, basically." },
        { type: 'dialogue', speaker: "LILA", text: "Stacey was on that case a few months ago — before you came in." },
        { type: 'dialogue', speaker: "TAMMY", text: "Which case?" },
        { type: 'dialogue', speaker: "STACEY", text: "Eager." },
        { type: 'dialogue', speaker: "STACEY", text: "The one with the—" },
        { type: 'stage-direction', text: "Tammy keeps looking at her." },
        { type: 'stage-direction', text: "Stacey falters." },
        { type: 'dialogue', speaker: "STACEY", text: "— you know." },
        { type: 'dialogue', speaker: "STACEY", text: "The very generous plea deal." },
        { type: 'dialogue', speaker: "STACEY", text: "About the girls." },
        { type: 'stage-direction', text: "A small silence." },
        { type: 'dialogue', speaker: "LILA", text: "The one everyone said was… unusual." },
        { type: 'dialogue', speaker: "LILA", text: "Right before your predecessor’s appointment." },
        { type: 'stage-direction', text: "Small silence" },
        { type: 'dialogue', speaker: "LILA", text: "People thought maybe he did someone a favor—" },
        { type: 'dialogue', speaker: "LILA", text: "STACEY elbows LILA too late." },
        { type: 'dialogue', speaker: "LILA", text: "— they gave him a sweetheart deal." },
        { type: 'stage-direction', text: "Silence." },
        { type: 'dialogue', speaker: "TAMMY", text: "My office prosecuted it." },
        { type: 'dialogue', speaker: "TAMMY", text: "And her office defended it." },
        { type: 'dialogue', speaker: "TAMMY", text: "STACEY and LILA nod." },
        { type: 'dialogue', speaker: "TAMMY", text: "I didn’t catch your name." },
        { type: 'dialogue', speaker: "STACEY", text: "Stacey." },
        { type: 'dialogue', speaker: "TAMMY", text: "Stacey." },
        { type: 'dialogue', speaker: "TAMMY", text: "Would you understand if I asked my legal secretary to have lunch at her desk?" },
        { type: 'dialogue', speaker: "STACEY", text: "Yes, ma’am. Completely." },
        { type: 'stage-direction', text: "STACEY backs toward the elevator." },
        { type: 'dialogue', speaker: "STACEY", text: "We’ll— talk sometime." },
        { type: 'stage-direction', text: "She exits." },
        { type: 'dialogue', speaker: "TAMMY", text: "TAMMY turns to LILA." },
        { type: 'dialogue', speaker: "LILA", text: "What did I do?" },
        { type: 'dialogue', speaker: "TAMMY", text: "You speculated about a prosecution in a hallway." },
        { type: 'dialogue', speaker: "TAMMY", text: "In front of opposing counsel." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'dialogue', speaker: "TAMMY", text: "Find the memo I asked for this morning." },
        { type: 'dialogue', speaker: "LILA", text: "Yes." },
        { type: 'dialogue', speaker: "TAMMY", text: "If you can’t, we’ll discuss whether this office is the right place for you." },
        { type: 'stage-direction', text: "A long beat." },
        { type: 'dialogue', speaker: "TAMMY", text: "Do you understand?" },
        { type: 'dialogue', speaker: "LILA", text: "Yes." },
        { type: 'stage-direction', text: "TAMMY nods once. Enters her office." },
        { type: 'stage-direction', text: "Door closes." },
        { type: 'stage-direction', text: "Lights shift." }
      ]
    },
    { 
      id: "01-09c", 
      title: "The Departure", 
      summary: "Maxie leaves for a trip, entrusting the household to Geoff and Gus.", 
      characters: "Maxie, Geoff, Gus, Officer Watson",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      script: [
        { type: 'dialogue', speaker: "MAXIE", text: "I had doubts." },
        { type: 'dialogue', speaker: "GEOFF", text: "You still do." },
        { type: 'dialogue', speaker: "MAXIE", text: "Moving someone in after one conversation?" },
        { type: 'dialogue', speaker: "GEOFF", text: "It wasn’t one conversation." },
        { type: 'dialogue', speaker: "MAXIE", text: "It was a song." },
        { type: 'dialogue', speaker: "GEOFF", text: "It was a good one." },
        { type: 'stage-direction', text: "(She studies him.)" },
        { type: 'dialogue', speaker: "MAXIE", text: "You don’t know his history." },
        { type: 'dialogue', speaker: "GEOFF", text: "Yes, I do." },
        { type: 'stage-direction', text: "(Silence. She waits.)" },
        { type: 'dialogue', speaker: "GEOFF", text: "His background check cleared. He’s not CIA - he’s not even KGB." },
        { type: 'dialogue', speaker: "MAXIE", text: "Putin or non-Putin KGB?" },
        { type: 'dialogue', speaker: "GEOFF", text: "Was there a non-Putin KGB?" },
        { type: 'dialogue', speaker: "MAXIE", text: "There was a non-Hoover CIA." },
        { type: 'dialogue', speaker: "GEOFF", text: "NEver mind - I read it all - the court case, his foreclosure, the divorse." },
        { type: 'dialogue', speaker: "MAXIE", text: "You said you thought he was - like us? Or shared - interests?" },
        { type: 'dialogue', speaker: "GEOFF", text: "I thought so, but I don’t know. He’s smart - honest - proficient - funny -" },
        { type: 'dialogue', speaker: "MAXIE", text: "And?" },
        { type: 'dialogue', speaker: "GEOFF", text: "He doesn’t ask questions. Logistics and the way I like my coffee." },
        { type: 'dialogue', speaker: "MAXIE", text: "That’s what worries me." },
        { type: 'dialogue', speaker: "GEOFF", text: "That’s why I trust him." },
        { type: 'stage-direction', text: "Gus enters from the back hall carrying groceries and dry cleaning. Comfortable. Not timid." },
        { type: 'dialogue', speaker: "GUS", text: "They were out of oat milk. I got almond." },
        { type: 'stage-direction', text: "Maxie glances at Geoff automatically." },
        { type: 'dialogue', speaker: "MAXIE", text: "That’s fine." },
        { type: 'dialogue', speaker: "GEOFF", text: "On principle." },
        { type: 'dialogue', speaker: "GUS", text: "You have milk principles?" },
        { type: 'dialogue', speaker: "GEOFF", text: "I hate cows. And I hate soybeans." },
        { type: 'dialogue', speaker: "MAXIE", text: "Ask him about it after I go. I don’t need to hear this story again." },
        { type: 'stage-direction', text: "She zips the suitcase." },
        { type: 'dialogue', speaker: "MAXIE", text: "I’m leaving tonight. Three weeks. Maybe four." },
        { type: 'dialogue', speaker: "GUS", text: "Fundraisers?" },
        { type: 'dialogue', speaker: "MAXIE", text: "Conferences. Golfing with Ronnie." },
        { type: 'stage-direction', text: "Imitates." },
        { type: 'dialogue', speaker: "GEOFF", text: "He thinks you’re great - the most great - the greatest woman the world has -" },
        { type: 'dialogue', speaker: "MAXIE", text: "Shut up. He’s a handsy old creep." },
        { type: 'dialogue', speaker: "GUS", text: "Wait - Ronnie? The President?" },
        { type: 'stage-direction', text: "Sighs*." },
        { type: 'dialogue', speaker: "MAXIE", text: "Yes." },
        { type: 'dialogue', speaker: "GEOFF", text: "Maxie loves Ronnie, and Ronnie loves Maxie." },
        { type: 'dialogue', speaker: "MAXIE", text: "He insists on hugging me - just me. A little extra squeeze." },
        { type: 'dialogue', speaker: "GEOFF", text: "He’s touchy feely, and just a little leacherous." },
        { type: 'dialogue', speaker: "MAXIE", text: "He’s adhesive. I smell him after for days." },
        { type: 'dialogue', speaker: "GEOFF", text: "The proximity is vital." },
        { type: 'dialogue', speaker: "MAXIE", text: "The proximity is torture." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'dialogue', speaker: "MAXIE", text: "But I do like to destroy him in golf. Nothing brings me greater joy than seeing his little bottom lip out about to cry when I get a hole in one" },
        { type: 'stage-direction', text: "Imitates." },
        { type: 'dialogue', speaker: "GUS", text: "A good golfer - the best. Better than the best woman any other country has." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'stage-direction', text: "GEOFF breaks out in laughter and claps his hands." },
        { type: 'stage-direction', text: "Smiling warmly" },
        { type: 'dialogue', speaker: "MAXIE", text: "Exactly. I’m off to the money." },
        { type: 'dialogue', speaker: "GEOFF", text: "You’re more interested in the office, darling, now run along - the Emerald City awaits." },
        { type: 'stage-direction', text: "Officer Watson appears quietly in the doorway." },
        { type: 'dialogue', speaker: "WATSON", text: "Afternoon." },
        { type: 'dialogue', speaker: "GUS", text: "Afternoon, sir." },
        { type: 'stage-direction', text: "A familiar nod passes between them. Watson does not acknowledge Geoff." },
        { type: 'stage-direction', text: "GEOFF looks hurt" },
        { type: 'dialogue', speaker: "GEOFF", text: "Attorney-client privilege extend to golf invitations?" },
        { type: 'dialogue', speaker: "WATSON", text: "I file who comes and goes. Why. And anything illegal I hear discussed." },
        { type: 'stage-direction', text: "(Beat.)" },
        { type: 'dialogue', speaker: "WATSON", text: "That’s the legally required minimum." },
        { type: 'stage-direction', text: "Watson remains at ease, leaning in shadow." },
        { type: 'dialogue', speaker: "MAXIE", text: "Are you a maximalist, Officer Watson?" },
        { type: 'dialogue', speaker: "WATSON", text: "I do my job, I go home. It’s a tough job, this." },
        { type: 'dialogue', speaker: "MAXIE", text: "Keep a close eye on the two of them. This mid-afternoon boy’s club I’ve not been invited to in here sounds dangerous if unattended to." },
        { type: 'stage-direction', text: "OFFICER nods*. *MAXIE puts her hand on her luggage." },
        { type: 'dialogue', speaker: "MAXIE", text: "Car’s waiting." },
        { type: 'stage-direction', text: "Gus steps forward." },
        { type: 'dialogue', speaker: "GUS", text: "I’ll carry it." },
        { type: 'dialogue', speaker: "MAXIE", text: "How positively genteel - thank you, but I can get it." },
        { type: 'dialogue', speaker: "GUS", text: "Never said you couldn’t. Just helping out." },
        { type: 'stage-direction', text: "He takes the suitcase anyway." },
        { type: 'stage-direction', text: "Maxie watches him a moment, follows him outside." },
        { type: 'dialogue', speaker: "MAXIE", text: "He likes you." },
        { type: 'dialogue', speaker: "GUS", text: "I’m sorry?" },
        { type: 'dialogue', speaker: "MAXIE", text: "Geoff. He doesn’t like many people." },
        { type: 'stage-direction', text: "Beat." },
        { type: 'dialogue', speaker: "GEOFF", text: "He’s awfully likable, though." },
        { type: 'dialogue', speaker: "MAXIE", text: "He is. We run in different circles where likability is-" },
        { type: 'stage-direction', text: "She waves her hand vaguely. Silence." },
        { type: 'dialogue', speaker: "MAXIE", text: "The older you get, it seems, the more time you spend surrounded by people you’re required to be around, not who you want to be around." },
        { type: 'stage-direction', text: "She watches for a response." },
        { type: 'dialogue', speaker: "MAXIE", text: "Donors. Voters. Advisors. Old friends you can’t quite shake." },
        { type: 'stage-direction', text: "Very few you’d choose." },
        { type: 'dialogue', speaker: "MAXIE", text: "And very few you’d actually choose." },
        { type: 'stage-direction', text: "Gus holds steady." },
        { type: 'dialogue', speaker: "MAXIE", text: "You two will get along fine, I think." },
        { type: 'dialogue', speaker: "GUS", text: "I try not to be difficult." },
        { type: 'dialogue', speaker: "MAXIE", text: "Don’t get into the whisky." },
        { type: 'dialogue', speaker: "GEOFF", text: "If I do - and I won’t - you’ll be my first and only call." },
        { type: 'dialogue', speaker: "MAXIE", text: "Why?" },
        { type: 'dialogue', speaker: "GEOFF", text: "Bail money." },
        { type: 'stage-direction', text: "She laughs*." },
        { type: 'dialogue', speaker: "GEOFF", text: "Have a good trip. The President awaits." },
        { type: 'dialogue', speaker: "MAXIE", text: "The President and all the other boys who were kingdoms without any idea of what to do with them." },
        { type: 'stage-direction', text: "Lights shift." },
        { type: 'musical-number', text: "[Musical Number]" }
      ]
    },
    { id: "01-09d", title: "Scene 9d", summary: "TBA", hasMusic: false },
    { id: "01-10", title: "I Know What Happened On That Island", summary: "Gus finally speaks out.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "01-11", title: "Who Was That? (Preprise 2)", summary: "The mystery deepens.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "01-12", title: "Scene 12", summary: "TBA", hasMusic: false },
    { id: "01-13", title: "The Arrest Waltz", summary: "The law finally catches up, but with a rhythmic twist.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "01-Finale", title: "Finale Standard Procedure", summary: "The first act ends with the chilling realization of how the system works.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
  ];

  const act2Scenes: Scene[] = [
    { 
      id: "02-01", 
      title: "Who Was That? (Part 3)", 
      summary: "The fallout begins. Maxie is in custody, but Geoff is nowhere to be found.", 
      characters: "Maxie, Tammy",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
      lyric: "WHO WAS THAT?\nThe one who let him go.\nWHO WAS THAT?\nThe one who didn't know.\nOr the one who knew too much\nAnd had the power and the touch\nTo make the truth a show.",
      script: [
        { type: 'stage-direction', text: "A sterile, white-walled detention center. MAXIE is dressed in a simple but high-quality jumpsuit. TAMMY stands by the door." },
        { type: 'musical-number', text: "[Musical Number]" },
        { type: 'dialogue', speaker: "TAMMY", text: "He's gone, Maxie. Vanished. From a high-security facility. How does that happen?" },
        { type: 'dialogue', speaker: "MAXIE", text: "In our world, Tammy, 'high-security' is just a suggestion for those who can't afford the exit fee." },
        { type: 'dialogue', speaker: "TAMMY", text: "And you? Why are you still here?" },
        { type: 'dialogue', speaker: "MAXIE", text: "Because someone has to be the face of the scandal. And I have a very photogenic conscience." }
      ]
    },
    { id: "02-02", title: "Scene 2", summary: "TBA", hasMusic: false },
    { id: "02-03", title: "Scene 3", summary: "TBA", hasMusic: false },
    { id: "02-04", title: "Scene 4", summary: "TBA", hasMusic: false },
    { id: "02-05", title: "Witch Hunt & Snowstorm", summary: "The media frenzy and the cover-up collide.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "02-06", title: "Scene 6", summary: "TBA", hasMusic: false },
    { id: "02-07", title: "Scene 7", summary: "TBA", hasMusic: false },
    { id: "02-08", title: "What Did You Do?", summary: "A confrontation between Geoff and Maxie.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "02-09", title: "Just Like Them, Just Like Me", summary: "Gus realizes his own complicity.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "02-10", title: "Scene 10", summary: "TBA", hasMusic: false },
    { id: "02-11", title: "Scene 11", summary: "TBA", hasMusic: false },
    { id: "02-12", title: "I Need to Walk", summary: "A moment of reflection before the final trial.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "02-13", title: "Not Unreasonable, Man", summary: "The Solicitor General's final stand.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "02-14", title: "We the People", summary: "The jury's verdict and the public's reaction.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "02-15", title: "A Reasonable Vice (President)", summary: "A satirical take on the political fallout.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { id: "02-16", title: "Park Bench Sobriety", summary: "Gus finds a moment of peace and clarity.", hasMusic: true, youtubeId: "niNLu3u8Fps", script: [{ type: 'musical-number', text: "[Musical Number]" }] },
    { 
      id: "02-Finale", 
      title: "Finale Standard Procedure", 
      summary: "The cycle continues. A new island, a new name, the same old rules.", 
      characters: "Ensemble, Geoff (Voice)",
      hasMusic: true,
      youtubeId: "niNLu3u8Fps",
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
                  <button 
                    onClick={() => openLyrics(act1Scenes[selectedAct1SceneIndex], 1, selectedAct1SceneIndex)}
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
                  </button>
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
                  <button 
                    onClick={() => openLyrics(act2Scenes[selectedAct2SceneIndex], 2, selectedAct2SceneIndex)}
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
                  </button>
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
                      <span className={`text-xs font-display font-black uppercase tracking-[0.3em] px-3 py-1 border-2 border-bauhaus-black ${
                        scriptCards[currentLineIndex].type === 'stage-direction' ? 'bg-bauhaus-yellow' : 'bg-bauhaus-red text-bauhaus-white'
                      }`}>
                        {scriptCards[currentLineIndex].type === 'stage-direction' ? 'STAGE DIRECTION' : scriptCards[currentLineIndex].speaker}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {scriptCards[currentLineIndex].lines.map((line, i) => (
                        <p 
                          key={i} 
                          className={`
                            ${scriptCards[currentLineIndex].type === 'stage-direction' ? 'text-xl md:text-2xl italic opacity-60 font-sans' : 'text-3xl md:text-5xl font-display font-black uppercase leading-tight'}
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
                      onClick={() => openLyrics(currentScene, currentAct, currentSceneIndex)}
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

      <Modal isOpen={activeModal === 'lyrics'} onClose={closeModal} title="LYRICS & VIDEO">
        {currentScene && (
          <div className="flex flex-col md:flex-row gap-12 text-bauhaus-black">
            <div className="w-full md:w-1/2 space-y-8">
              <div className="p-6 border-4 border-bauhaus-black bg-bauhaus-yellow">
                <h3 className="text-3xl font-display font-black uppercase mb-2">{currentScene.title}</h3>
                <p className="text-xs font-display font-black uppercase tracking-widest opacity-40">Musical Number</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-display font-black uppercase tracking-widest opacity-40">Scene Context</h4>
                <p className="text-lg font-sans leading-relaxed">{currentScene.summary}</p>
                <div className="pt-4 border-t-2 border-bauhaus-black/10">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-1">Characters</span>
                  <p className="font-display font-bold uppercase">{currentScene.characters}</p>
                </div>
              </div>

              {currentScene.youtubeId && (
                <div className="aspect-video border-4 border-bauhaus-black bg-bauhaus-black relative overflow-hidden shadow-[8px_8px_0px_0px_var(--bauhaus-red)]">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentScene.youtubeId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <div className="flex justify-between items-center border-b-4 border-bauhaus-black pb-4">
                <h4 className="text-xs font-display font-black uppercase tracking-widest opacity-40">Lyrics</h4>
                <div className="flex gap-2">
                  <button onClick={prevScene} disabled={currentSceneIndex === 0} className="p-2 border-2 border-bauhaus-black hover:bg-bauhaus-black hover:text-bauhaus-white transition-all disabled:opacity-20"><ChevronRight className="rotate-180" size={16} /></button>
                  <button onClick={nextScene} disabled={currentSceneIndex === (currentAct === 1 ? act1Scenes.length - 1 : act2Scenes.length - 1)} className="p-2 border-2 border-bauhaus-black hover:bg-bauhaus-black hover:text-bauhaus-white transition-all disabled:opacity-20"><ChevronRight size={16} /></button>
                </div>
              </div>
              <div className="bg-bauhaus-white p-8 border-4 border-bauhaus-black shadow-[8px_8px_0px_0px_var(--bauhaus-blue)] max-h-[60vh] overflow-y-auto custom-scrollbar">
                <pre className="font-display text-xl whitespace-pre-line leading-tight uppercase">
                  {currentScene.lyric || "Lyrics coming soon..."}
                </pre>
              </div>
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
                      {/* Grouped Version Selection */}
                      {(() => {
                        const versions = Object.keys(youtubeTracks[selectedYoutubeIndex].versions);
                        const hasV1 = versions.some(v => v === '1.0' || v === '1.5');
                        const hasV2 = versions.some(v => v.startsWith('2.'));
                        
                        return (
                          <>
                            {hasV1 && (
                              <button
                                onClick={() => {
                                  if (versions.includes('1.5')) setSelectedYoutubeVersion('1.5');
                                  else setSelectedYoutubeVersion('1.0');
                                }}
                                className={`px-6 py-2 border-2 border-bauhaus-black font-display font-bold uppercase transition-all ${
                                  (selectedYoutubeVersion === '1.0' || selectedYoutubeVersion === '1.5') ? 'bg-bauhaus-black text-bauhaus-white' : 'bg-bauhaus-white text-bauhaus-black hover:bg-bauhaus-yellow'
                                }`}
                              >
                                1.0/1.5
                              </button>
                            )}
                            {hasV2 && (
                              <button
                                onClick={() => {
                                  const v2s = versions.filter(v => v.startsWith('2.'));
                                  setSelectedYoutubeVersion(v2s[v2s.length - 1]); // Pick latest 2.x
                                }}
                                className={`px-6 py-2 border-2 border-bauhaus-black font-display font-bold uppercase transition-all ${
                                  selectedYoutubeVersion.startsWith('2.') ? 'bg-bauhaus-black text-bauhaus-white' : 'bg-bauhaus-white text-bauhaus-black hover:bg-bauhaus-yellow'
                                }`}
                              >
                                2.0+
                              </button>
                            )}
                            {/* Fallback for other versions */}
                            {versions.filter(v => v !== '1.0' && v !== '1.5' && !v.startsWith('2.')).map(v => (
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
                          </>
                        );
                      })()}
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
