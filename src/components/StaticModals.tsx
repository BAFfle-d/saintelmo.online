import React, { useState, useEffect } from 'react';
import { RefreshCw, Video, StickyNote, Info, Mail, FlaskConical } from 'lucide-react';
import { Modal, BauhausButton } from './BauhausUI';

// All uploaded BTS images (referenced from /public/ folder in the built site)
const btsImages = [
    '098fc3c1-cdef-4ebf-9e8d-b732d2ab8452.jpg',
    '12321342134.png',
    '63c8fdea-5b1a-4995-8c0a-500ca6c3b9fd.jpg',
    '66e48a1f-9e01-4f7d-919a-027e07bb14f9.jpg',
    '786b3b2c-fab0-485a-b114-36aecc718a33.jpg',
    '8f70ec6c-d2b4-469c-9f06-6d1c3be7bf02.jpg',
    'GM1.png',
    'Gemini_Generated_Image_87hzqh87hzqh87hz.png',
    'Gemini_Generated_Image_fox7e6fox7e6fox7.png',
    'Gemini_Generated_Image_nr5qu3nr5qu3nr5q.png',
    'Yellow Colorful.png',
    'banana_0 (11).png',
    'banana_1 (17).png',
    'banana_2 (7).png',
    'unnamed.jpg',
  ];

interface StaticModalsProps {
    activeModal: string | null;
    onClose: () => void;
    onOpenModal: (modal: string) => void;
}

export const StaticModals: React.FC<StaticModalsProps> = ({ activeModal, onClose, onOpenModal }) => {
    const [displayedImages, setDisplayedImages] = useState<string[]>([]);

    const shuffleImages = () => {
          const shuffled = [...btsImages].sort(() => 0.5 - Math.random());
          setDisplayedImages(shuffled.slice(0, 4));
    };

    // Shuffle images every time the BTS modal opens
    useEffect(() => {
          if (activeModal === 'bts') {
                  shuffleImages();
          }
    }, [activeModal]);

    return (
          <>
            {/* BEHIND THE SCENES MODAL */}
                <Modal isOpen={activeModal === 'bts'} onClose={onClose} title="BEHIND THE SCENES">
                        <div className="space-y-12 text-bauhaus-black">
                        
                          {/* Stats Table */}
                                  <section>
                                              <table className="w-full border-4 border-bauhaus-black text-left">
                                                            <thead>
                                                                            <tr className="bg-bauhaus-black text-bauhaus-white">
                                                                                              <th className="p-4 font-display uppercase tracking-widest text-sm">METRIC</th>th>
                                                                                              <th className="p-4 font-display uppercase tracking-widest text-sm text-right">VALUE</th>th>
                                                                            </tr>tr>
                                                            </thead>thead>
                                                            <tbody>
                                                              {[
            { metric: 'WORDS', value: '298,896' },
            { metric: 'SENTENCES', value: '35,021' },
            { metric: 'DIALOGUE TURNS', value: '759', note: '(not including firebase and claude chrome extension)' },
            { metric: 'EXCHANGES (INCL. MISSING)', value: 'EST. OVER 10,000' },
            { metric: 'TOTAL PLANNED SONGS', value: '24 — V1.0 COMPLETED' },
            { metric: 'ACTIVE PROCESSING TIME', value: '1,495 MIN' },
            { metric: 'HIGHEST RETENTION RATE (YT)', value: '60%' },
            { metric: 'FLESCH-KINCAID', value: '5.9', note: '(equivalent to chicago)' },
                            ].map((row, i) => (
                                                <tr key={i} className={`border-b-2 border-bauhaus-black ${i % 2 === 0 ? 'bg-bauhaus-white' : 'bg-bauhaus-yellow/10'}`}>
                                                                    <td className="p-4 font-display font-bold uppercase tracking-wide text-sm">
                                                                      {row.metric}
                                                                      {row.note && <div className="text-xs font-sans font-normal opacity-50 normal-case tracking-normal mt-1">{row.note}</div>div>}
                                                                    </td>td>
                                                                    <td className="p-4 text-right font-bold text-bauhaus-red font-mono">{row.value}</td>td>
                                                </tr>tr>
                                              ))}
                                                            </tbody>tbody>
                                              </table>table>
                                  </section>section>
                        
                          {/* Essay: Care About It */}
                                  <section className="space-y-6 border-l-4 border-bauhaus-blue pl-6">
                                              <h2 className="text-4xl font-display font-black uppercase">CARE ABOUT IT.</h2>h2>
                                              <div className="w-16 h-1 bg-bauhaus-red"></div>div>
                                              <div className="space-y-4 font-sans leading-relaxed">
                                                            <p>I told myself Geoff &amp; Maxie was a sandbox. A sacrificial project. I was too afraid to risk Calliope Spun - that one&apos;s blood and bone, too close to the surface - so I needed somewhere to fail where failure wouldn&apos;t cost me anything I couldn&apos;t afford to lose. Low stakes. Controlled conditions. A subject so culturally radioactive that my emotional distance from it felt guaranteed.</p>p>
                                                            <p>I chose the Epstein fallout because I believed I had no skin in it.</p>p>
                                                            <p>That was the lie.</p>p>
                                                            <p>You don&apos;t get to satirize a system without finding yourself inside it. I found myself inside it by page twelve.</p>p>
                                              </div>div>
                                  
                                              <div className="bg-bauhaus-yellow inline-block px-3 py-1 font-display font-black uppercase tracking-widest text-sm mt-4">THE ASSEMBLY LINE</div>div>
                                              <div className="space-y-4 font-sans leading-relaxed">
                                                            <p>We didn&apos;t write a show. We processed one.</p>p>
                                                            <p>Ten thousand exchanges across six models. Thousands of drafts. Not collaboration - extraction. I pushed the models toward something they couldn&apos;t name, and they pulled structure out of material I couldn&apos;t organize. The result is this: twenty-four songs, two acts, one argument about power and performance and what happens when both run out.</p>p>
                                              </div>div>
                                  
                                              <div className="bg-bauhaus-yellow inline-block px-3 py-1 font-display font-black uppercase tracking-widest text-sm mt-4">THE MUSIC AS A LIE</div>div>
                                              <div className="space-y-4 font-sans leading-relaxed">
                                                            <p>The music does what the system does. It distracts.</p>p>
                                                            <p>Act 1 is spectacle - big, polished, airtight. The sound of power presenting itself as orderly. &quot;The Arrest Waltz&quot; is a 3/4 time signature carrying language that has no business being that graceful. Elegant structure. Ugly content. The tension between them is the whole argument.</p>p>
                                                            <p>By Act 2, the performance can&apos;t hold. The orchestration collapses inward. What&apos;s left is smaller, quieter, harder to reframe. Piano. Guitar. Two people and the thing that can&apos;t be cleaned up anymore.</p>p>
                                                            <p>No insulation. No gloss. Just what it is.</p>p>
                                              </div>div>
                                  </section>section>
                        
                          {/* Concept Gallery (Picsum placeholders) */}
                                  <section className="space-y-8 mt-16 pt-12 border-t-8 border-bauhaus-black">
                                              <div className="flex justify-between items-end border-b-4 border-bauhaus-black pb-4">
                                                            <h3 className="text-3xl font-display font-black uppercase bg-bauhaus-yellow inline-block px-4">Concept Gallery</h3>h3>
                                                            <span className="font-display font-black text-bauhaus-red animate-pulse uppercase tracking-widest text-lg">COMING SOON</span>span>
                                              </div>div>
                                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                {['blue-office', 'bauhaus-island', 'police-bauhaus', 'man-chair-blue', 'man-desk-vibrant', 'man-box', 'judge-harlequin', 'green-suit-man', 'purple-dress-woman', 'marching-band'].map((seed, i) => (
                            <div key={i} className="aspect-[2/3] bg-bauhaus-black border-4 border-bauhaus-black relative overflow-hidden group">
                                              <img
                                                                    src={`https://picsum.photos/seed/${seed}/600/900`}
                                                                    alt={`Concept ${i}`}
                                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105 filter grayscale hover:grayscale-0"
                                                                    referrerPolicy="no-referrer"
                                                                  />
                                              <div className="absolute inset-0 bg-bauhaus-red/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>div>
                          ))}
                                              </div>div>
                                  </section>section>
                        
                          {/* BTS Photo Gallery - shuffled each time modal opens */}
                                  <section className="space-y-6 pt-12 border-t-4 border-bauhaus-black/10">
                                              <div className="flex justify-between items-center">
                                                            <h4 className="font-display font-black text-lg uppercase tracking-tighter text-bauhaus-black">
                                                                            CONCEPT IMAGES — <span className="text-bauhaus-red italic">COMING SOON</span>span>
                                                            </h4>h4>
                                                            <button
                                                                              onClick={shuffleImages}
                                                                              className="flex items-center gap-2 bg-bauhaus-black text-bauhaus-white px-3 py-1.5 font-display font-black text-[10px] uppercase tracking-widest hover:bg-bauhaus-red transition-colors"
                                                                            >
                                                                            <RefreshCw size={12} />
                                                                            Shuffle
                                                            </button>button>
                                              </div>div>
                                              <div className="grid grid-cols-4 gap-4">
                                                {displayedImages.map((img, i) => (
                            <div key={i} className="aspect-square border-2 border-bauhaus-black overflow-hidden bg-bauhaus-white">
                                              <img
                                                                    src={`/${img}`}
                                                                    alt={`BTS Concept ${i + 1}`}
                                                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                                                    referrerPolicy="no-referrer"
                                                                  />
                            </div>div>
                          ))}
                                              </div>div>
                                  </section>section>
                        
                        </div>div>
                </Modal>Modal>
          
            {/* CHARACTERS MODAL */}
                <Modal isOpen={activeModal === 'characters'} onClose={onClose} title="CHARACTERS">
                        <div className="space-y-8 text-bauhaus-black">
                                  <p className="font-sans text-lg leading-relaxed opacity-70">Character profiles coming soon.</p>p>
                        </div>div>
                </Modal>Modal>
          
            {/* NOTES MODAL */}
                <Modal isOpen={activeModal === 'notes'} onClose={onClose} title="PRODUCTION NOTES">
                        <div className="space-y-8 text-bauhaus-black">
                                  <p className="font-sans text-lg leading-relaxed opacity-70">Production notes coming soon.</p>p>
                        </div>div>
                </Modal>Modal>
          
            {/* ABOUT MODAL */}
                <Modal isOpen={activeModal === 'about'} onClose={onClose} title="ABOUT">
                        <div className="space-y-8 text-bauhaus-black">
                                  <p className="font-sans text-lg leading-relaxed opacity-70">About section coming soon.</p>p>
                        </div>div>
                </Modal>Modal>
          
            {/* CONTACT MODAL */}
                <Modal isOpen={activeModal === 'contact'} onClose={onClose} title="CONTACT">
                        <div className="space-y-8 text-bauhaus-black">
                                  <p className="font-sans text-lg leading-relaxed opacity-70">Contact information coming soon.</p>p>
                        </div>div>
                </Modal>Modal>
          </>>
        );
};</>
