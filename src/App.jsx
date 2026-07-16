import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { 
  Play, 
  RotateCcw, 
  Share2, 
  Sliders, 
  Cpu, 
  Terminal, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Dna,
  Volume2,
  VolumeX,
  FileText,
  Bookmark,
  ShieldAlert,
  CheckCircle2,
  Lock
} from 'lucide-react';

import { CLASSIFIER_DB } from './data/classifier.js';
import RedactedText from './components/RedactedText.jsx';
import { playTerminalBeep } from './utils/audio.js';
import { supabase } from './lib/supabase.js';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // landing, nda, quiz, tiebreaker, loading, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [displayedQuestionIndex, setDisplayedQuestionIndex] = useState(0);
  const [quizFadeState, setQuizFadeState] = useState('idle'); 
  const [selections, setSelections] = useState({}); 
  const [tieBreakerSelection, setTieBreakerSelection] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeAudio, setActiveAudio] = useState(null); // New state for audio playback

  // High-immersion bio-signature authorization states
  const [guestName, setGuestName] = useState("");
  const [ndaAccepted, setNdaAccepted] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState([
    "CONFIDENTIAL ENCLAVE ACCESS KEY VALIDATED",
    "DECRYPTION SYSTEMS COMPLETED AND ARCHIVED..."
  ]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("ISOLATING GENETIC SEQUENCING...");
  const [matchResult, setMatchResult] = useState(null);
  const [matchedScoreSummary, setMatchedScoreSummary] = useState({});
  const [overrideActive, setOverrideActive] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const triggerBeep = (freq, duration, type) => {
    if (soundEnabled) playTerminalBeep(freq, duration, type);
  };

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [...prev.slice(-3), `[${time}] ${message}`]);
  };

  const saveQuizResult = async (species) => {
    if (!supabase || !guestName.trim()) return;

    const { error } = await supabase
      .from('quiz_results')
      .insert({ guest_name: guestName.trim(), species });

    if (error) {
      console.error('Could not save quiz result:', error.message);
      addLog('RESULT ARCHIVE UNAVAILABLE. CLASSIFICATION REMAINS LOCAL.');
      return;
    }

    addLog('RESULT ARCHIVED TO PRIVATE REGISTRY.');
  };

  const handleStartClassification = () => {
    triggerBeep(480, 0.25, "sine");
    addLog("ACCESS GATE DEPLOYED: AWAITING BEHAVIOURAL DISCLOSURE SIGN-OFF.");
    setCurrentScreen('nda');
  };

  const handleSignAndCommit = (e) => {
    e.preventDefault();
    if (!ndaAccepted || !guestName.trim()) return;
    triggerBeep(600, 0.2, "sine");
    addLog(`SECURITY MEMORANDUM COMMITTED BY: ${guestName.toUpperCase()}`);
    setCurrentScreen('quiz');
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=0&mute=0&rel=0&modestbranding=1`;
    }
    return null;
  };

  const handleSelectAnswer = (ansIndex) => {
    triggerBeep(520, 0.08, "sine");
    const question = CLASSIFIER_DB.questions[currentQuestionIndex];
    setSelections(prev => ({
      ...prev,
      [question.id]: ansIndex
    }));
    
    const ansObj = question.answers[ansIndex];
    addLog("RESPONSE SECURED");

    if (ansObj.override) {
      setOverrideActive(true);
      addLog("ATTENTION: UNCLASSIFIED EXTINCTION CLASS RE-ROUTING ENABLED.");
    } else if (question.id === "meme_song") {
      setOverrideActive(false);
    }
  };

  const transitionToQuestion = (newIndex) => {
    setQuizFadeState('fading-out');
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      setDisplayedQuestionIndex(newIndex);
      setQuizFadeState('fading-in');
      setTimeout(() => {
        setQuizFadeState('idle');
      }, 250);
    }, 250);
  };

  const handleNextQuestion = () => {
    triggerBeep(640, 0.06, "sine");
    if (currentQuestionIndex < CLASSIFIER_DB.questions.length - 1) {
      // Stop audio when navigating
      if (activeAudio) {
        activeAudio.pause();
        setActiveAudio(null);
      }
      transitionToQuestion(currentQuestionIndex + 1);
    } else {
      evaluateFirstPassResults();
    }
  };

  const handlePrevQuestion = () => {
    triggerBeep(440, 0.08, "sine");
    if (currentQuestionIndex > 0) {
      // Stop audio when navigating
      if (activeAudio) {
        activeAudio.pause();
        setActiveAudio(null);
      }
      transitionToQuestion(currentQuestionIndex - 1);
    }
  };

  const evaluateFirstPassResults = () => {
    addLog("COMPILING GENETIC SPECTRUM MATCH...");
    
    if (overrideActive) {
      addLog("GENOMIC ABERRATION ENCOUNTERED. OVERRIDING DATA BANK...");
      startLoadingScreen("Nephimai");
      return;
    }

    const scoreMap = {
      Adrielite: 0,
      Heleion: 0,
      Kazandrian: 0,
      Ymaari: 0,
      Elysian: 0
    };

    CLASSIFIER_DB.questions.forEach((q) => {
      const selectedIndex = selections[q.id];
      if (selectedIndex !== undefined) {
        const answer = q.answers[selectedIndex];
        if (answer && answer.species && scoreMap[answer.species] !== undefined) {
          scoreMap[answer.species] += 1;
        }
      }
    });

    setMatchedScoreSummary(scoreMap);

    let highestScore = -1;
    let candidates = [];

    Object.keys(scoreMap).forEach(sp => {
      if (scoreMap[sp] > highestScore) {
        highestScore = scoreMap[sp];
        candidates = [sp];
      } else if (scoreMap[sp] === highestScore) {
        candidates.push(sp);
      }
    });

    if (candidates.length > 1) {
      addLog(`MULTIPLE METRIC TIES DETECTED: ${candidates.join(" | ")}. REDIRECTING TO VERIFICATION RESOLVER.`);
      setCurrentScreen('tiebreaker');
    } else {
      const winner = candidates[0];
      addLog(`OPTIMAL ALIGNMENT RESOLVED: ${winner}`);
      startLoadingScreen(winner);
    }
  };

  const handleTieBreakerSubmit = (ansIndex) => {
    triggerBeep(700, 0.15, "sine");
    const selectedAnswer = CLASSIFIER_DB.tieBreakerQuestion.answers[ansIndex];
    setTieBreakerSelection(ansIndex);
    addLog(`SPECIES TIE DISAMBIGUATION RESOLVED: ${selectedAnswer.species}`);
    startLoadingScreen(selectedAnswer.species);
  };

  const startLoadingScreen = (finalWinner) => {
    setCurrentScreen('loading');
    setLoadingProgress(0);
    
    const messages = [
      "EXTRACTING MACROMOLECULAR STRANDS...",
      "CALIBRATING NEURAL ARCHIVE CHANNELS...",
      "MATCHING CLASSIFIED ELITE DATABASES...",
      "DECRYPTING GENETIC EMBED FACTORS...",
      "COMPUTING D-R-I-T-E PROFILE VECTOR CODES...",
      "RESOLVING FINAL GENETIC SPECTRUM...",
      "FINAL SPECIMEN ARCHIVE LOADED!"
    ];

    let currentProg = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 3) + 1; 
      currentProg = Math.min(currentProg + increment, 100);
      setLoadingProgress(currentProg);
      
      const msgIndex = Math.min(Math.floor((currentProg / 100) * messages.length), messages.length - 1);
      setLoadingText(messages[msgIndex]);
      
      if (currentProg % 12 === 0) {
        triggerBeep(250 + currentProg * 3.5, 0.04, "sine");
      }

      if (currentProg >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setMatchResult(finalWinner);
          setCurrentScreen('results');
          addLog(`DOSSIER ENVELOPE [${finalWinner.toUpperCase()}] DECLASSIFIED.`);
          void saveQuizResult(finalWinner);
        }, 600);
      }
    }, 120); 
  };

  useEffect(() => {
    if (currentScreen === 'results' && matchResult) {
      const speciesData = CLASSIFIER_DB.species[matchResult];
      const traitsDef = CLASSIFIER_DB.traits;
      
      const matchedTraits = [
        speciesData.traits.D,
        speciesData.traits.R,
        speciesData.traits.I,
        speciesData.traits.T,
        speciesData.traits.E
      ];

      const traitLabels = [
        traitsDef.D.name,
        traitsDef.R.name,
        traitsDef.I.name,
        traitsDef.T.name,
        traitsDef.E.name
      ];

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: traitLabels,
          datasets: [{
            label: `${speciesData.name} Identity Matrix`,
            data: matchedTraits,
            backgroundColor: 'rgba(56, 189, 248, 0.04)',
            borderColor: speciesData.accentColor,
            borderWidth: 1.5,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: speciesData.accentColor,
            pointHoverBackgroundColor: speciesData.accentColor,
            pointHoverBorderColor: '#ffffff',
            pointRadius: 4.5,
            pointHoverRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animations: {
            tension: {
              duration: 2000,
              easing: 'easeOutCubic',
              from: 1,
              to: 0,
            },
            numbers: {
              type: 'number',
              properties: ['x', 'y', 'radius', 'pointRadius', 'borderWidth'],
              duration: 2400,
              easing: 'easeOutQuart'
            },
            scales: {
              properties: ['ticks', 'grid', 'angleLines'],
              duration: 1500,
            }
          },
          animation: {
            duration: 2400,
            easing: 'easeOutCubic',
          },
          scales: {
            r: {
              angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
              grid: { color: 'rgba(255, 255, 255, 0.08)' },
              pointLabels: {
                color: '#cbd5e1',
                font: {
                  family: 'Cormorant Garamond, serif',
                  size: 14,
                  style: 'italic'
                }
              },
              ticks: {
                backdropColor: 'transparent',
                color: '#64748b',
                stepSize: 1,
                font: { size: 10 }
              },
              suggestedMin: 0,
              suggestedMax: 5
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [currentScreen, matchResult]);

  const handleReset = () => {
    triggerBeep(320, 0.3, "sine");
    if (activeAudio) {
      activeAudio.pause();
      setActiveAudio(null);
    }
    setSelections({});
    setGuestName("");
    setNdaAccepted(false);
    setTieBreakerSelection(null);
    setCurrentQuestionIndex(0);
    setDisplayedQuestionIndex(0);
    setOverrideActive(false);
    setMatchResult(null);
    setMatchedScoreSummary({});
    setCurrentScreen('landing');
  };

  const playAudioTransmission = (audioUrl) => {
    const resolvedAudioUrl = new URL(audioUrl, window.location.href).href;
    if (activeAudio) {
      activeAudio.pause();
      if (activeAudio.src === resolvedAudioUrl) {
        setActiveAudio(null);
        return;
      }
    }
    const audio = new Audio(resolvedAudioUrl);
    audio.addEventListener('ended', () => setActiveAudio(null), { once: true });
    audio.play().catch(() => setActiveAudio(null));
    setActiveAudio(audio);
  };

  const handleShare = async () => {
    const link = window.location.href;

    try {
      let copied = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(link);
          copied = true;
        } catch {
          copied = false;
        }
      }

      if (!copied) {
        const copyField = document.createElement('textarea');
        copyField.value = link;
        copyField.style.position = 'fixed';
        copyField.style.opacity = '0';
        document.body.appendChild(copyField);
        copyField.select();
        copied = document.execCommand('copy');
        document.body.removeChild(copyField);
      }

      if (!copied) throw new Error('Copy failed');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  };

  const calculateCompatibility = () => {
    if (overrideActive) return "99.9%";
    let sum = 0;
    CLASSIFIER_DB.questions.forEach(q => {
      if (selections[q.id] !== undefined) sum += selections[q.id];
    });
    const hash = (sum * 7) % 21;
    return `${78 + hash}%`;
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 flex flex-col font-sans-luxury selection:bg-cyan-500/30 selection:text-white relative overflow-hidden">
      
      {/* Premium Font Definitions */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        .font-serif-luxury {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .font-display-luxury {
          font-family: 'Cinzel', Times New Roman, serif;
        }
        .font-sans-luxury {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .fade-transition {
          transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Background radial overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(16,36,65,0.4),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(9,20,38,0.5),transparent_60%)] pointer-events-none" />

      {/* Header Banner - Configured to present the director title cleanly below her name */}
      <header className="border-b border-slate-900 bg-[#070b12]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur-md opacity-70" />
              <div className="relative bg-[#0b1322] p-2 rounded-full border border-slate-800">
                <Dna className="w-5 h-5 text-cyan-400/80" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-sans-luxury tracking-[0.25em] text-cyan-400 block">ARCHIVE ACCESS REGISTRY</span>
              <h1 className="text-xs font-display-luxury tracking-[0.2em] font-medium text-slate-100 uppercase">SPECIES IDENTIFICATION</h1>
            </div>
          </div>

          {/* Persistent Immersion Header Tag */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right font-sans-luxury">
            <span className="text-[10px] text-emerald-400 tracking-[0.15em] font-semibold uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {guestName ? `SECURE GUEST FEED: ${guestName.toUpperCase()}` : "SECURE GUEST ACCESS"}
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider">
              AUTHORISATION: <span className="text-slate-200 font-medium">DR. SHRADHA LAKSHMAN</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider">
              DIRECTOR OF XENOMEDICAL INTELLIGENCE
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-12 flex flex-col justify-center relative z-10">
        
        {/* LANDING SCREEN */}
        {currentScreen === 'landing' && (
          <div className="space-y-12 max-w-3xl mx-auto animate-fadeIn text-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800 text-slate-400 text-[11px] tracking-[0.2em] uppercase font-sans-luxury">
        <Cpu className="w-3.5 h-3.5 text-cyan-400/70" />
        <span>Interdomic Archival Registry</span>
      </div>
      
      <h2 className="text-4xl md:text-6xl font-light font-display-luxury tracking-[0.15em] text-white uppercase leading-tight">
                Which Alien Species Are You?
              </h2>
              
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto my-4" />
              
              <p className="font-serif-luxury italic text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                “Your instincts, beliefs, and survival patterns reveal your species classification.”
              </p>
            </div>

            {/* Glassmorphic Portal Indicator */}
            <div className="relative max-w-lg mx-auto rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md overflow-hidden text-left shadow-2xl">
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-400/30" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-400/30" />

              <div className="space-y-3 text-xs font-sans-luxury text-slate-400 tracking-wider">
                <div className="flex justify-between border-b border-slate-900 pb-2 text-[10px] text-cyan-400">
                  <span>TERMINAL FEED ACTIVE:</span>
                  <span>ONLINE [100%]</span>
                </div>
                <p className="font-serif-luxury italic text-sm text-slate-300">
                  You are accessing an encrypted intelligence classification mainframe designed to isolate genomic alignment metrics via behavioural analysis.
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  &gt; AUTH_ID: DR. SHRADHA LAKSHMAN // DECK_9 // DISCOVERY SEQUENCE ARMED.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleStartClassification}
                className="group relative px-8 py-3.5 bg-transparent border-0 font-medium tracking-[0.25em] text-white uppercase rounded-none overflow-hidden focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <div className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 transition-colors" />
                <span className="relative font-sans-luxury text-xs flex items-center space-x-3 text-cyan-300 group-hover:text-cyan-200 transition-colors">
                  <span>Begin Classification Protocol</span>
                  <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                </span>
              </button>
            </div>
          </div>
        )}

        {/* NDA / CONFIDENTIAL BEHAVIOURAL DISCLAIMER GATEWAY SCREEN */}
        {currentScreen === 'nda' && (
          <div className="max-w-2xl mx-auto w-full animate-fadeIn space-y-8">
            <div className="text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
              <h3 className="text-2xl font-display-luxury tracking-widest text-white uppercase">
                XENOBEHAVIOURAL DISCLOSURE AGREEMENT
              </h3>
              <p className="text-xs font-sans-luxury text-slate-400 uppercase tracking-[0.2em]">
                Directives of Orbit Archive Section 9-A // Class-A Clearance Requirement
              </p>
            </div>

            <div className="p-6 md:p-8 rounded-xl border border-red-950/45 bg-red-950/10 backdrop-blur-md space-y-6 text-sm text-slate-300 font-serif-luxury leading-relaxed overflow-y-auto max-h-96 shadow-inner relative">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-950 text-red-400 text-[9px] font-mono rounded border border-red-500/30 tracking-widest uppercase">
                STRICT DISCLOSURE REQUIRED
              </div>
              
              <p className="font-semibold text-slate-200 italic">
                IMPORTANT WARNING: BY DECRYPTING YOUR GENOMIC MATRIX DATASET AND COMPILING INDEPENDENT SYSTEM ALIGNMENTS, YOU AGREE TO THE FOLLOWING PROTOCOLS:
              </p>
              <p>
                1. <span className="font-bold text-slate-100">Absolute Non-Disclosure:</span> The results computed by Dr. Shradha Lakshman, Director of Xenomedical Intelligence's mainframe contain structural behavioural analytics that indicate evolutionary alignment with <RedactedText>restricted interspecies networks</RedactedText>. Any uncontrolled transmission of <RedactedText>target species vectors</RedactedText> is prosecutable by the Cosmic Tribunal.
              </p>
              <p>
                2. <span className="font-bold text-slate-100">Metadata Access Consent:</span> You grant temporary read-access to your behavioural profile metrics, decision history parameters, and cognitive heuristics for scientific synthesis purposes under strict privacy constraints.
              </p>
              <p>
                3. <span className="font-bold text-slate-100">Censorship Protocols:</span> Due to active system scrubbing inside contested orbital space, select sensitive database terminologies may fluctuate or temporarily redact to prevent accidental data leaks.
              </p>
              <p className="text-slate-400 text-xs italic">
                By typing your sign-off key below and authorising, you pledge your cognitive integrity to the secure database system.
              </p>
              <p className="text-slate-400 text-xs italic">
                Your entered name and final species classification will be stored in a private results registry for the quiz owner to review.
              </p>
            </div>

            {/* Interactive Bio-signature input form */}
            <form onSubmit={handleSignAndCommit} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-xs font-sans-luxury uppercase text-cyan-400 tracking-widest">
                  Secure Digital Bio-Signature
                </label>
                <div className="relative rounded bg-slate-950 border border-slate-900 overflow-hidden">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                  <input 
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Type Full Name / Signature to Authorise"
                    className="w-full bg-transparent pl-12 pr-4 py-4 text-slate-100 focus:outline-none placeholder-slate-600 font-mono text-sm tracking-widest uppercase"
                  />
                </div>
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start space-x-3 cursor-pointer group select-none">
                <input 
                  type="checkbox"
                  required
                  checked={ndaAccepted}
                  onChange={(e) => setNdaAccepted(e.target.checked)}
                  className="mt-1 accent-cyan-500 rounded text-slate-900 border-slate-800"
                />
                <span className="text-xs text-slate-400 font-sans-luxury leading-relaxed group-hover:text-slate-300">
                  I commit my metadata vectors to the Archive Access Registry secure database under absolute non-disclosure protocols.
                </span>
              </label>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={!ndaAccepted || !guestName.trim()}
                className="w-full relative px-6 py-4 bg-transparent border-0 font-medium tracking-[0.25em] text-white uppercase rounded-none overflow-hidden focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                <div className="absolute inset-0 bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400 transition-colors" />
                <span className="relative font-sans-luxury text-xs flex items-center justify-center space-x-3 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign & Begin Classification</span>
                </span>
              </button>
            </form>
          </div>
        )}

        {/* QUIZ PORTAL WITH LIVE TEXT CENSORSHIP */}
        {currentScreen === 'quiz' && (
          <div className="space-y-8 max-w-3xl mx-auto w-full">
            
            {/* Elegant Header Progress bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5 font-sans-luxury">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-[0.25em] block">
                  SYSTEM QUERY {currentQuestionIndex + 1} OF {CLASSIFIER_DB.questions.length}
                </span>
                <h3 className="text-lg font-display-luxury tracking-widest text-slate-100 uppercase">
                  CLASSIFYING PARAMETERS
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-slate-950 rounded-full h-1 border border-slate-900 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400/60 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / CLASSIFIER_DB.questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] tracking-widest text-slate-500">
                  {Math.round(((currentQuestionIndex + 1) / CLASSIFIER_DB.questions.length) * 100)}%
                </span>
              </div>
            </div>

            {/* Dynamic Fade Container for Question Deck Content */}
            <div 
              className={`space-y-8 fade-transition ${
                quizFadeState === 'fading-out' ? 'opacity-0 translate-y-2' : 
                quizFadeState === 'fading-in' ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Question Text in Editorial Serif */}
              <div className="py-6 border-b border-slate-900">
                <h2 className="text-2xl md:text-3.5xl font-serif-luxury italic font-light text-slate-100 leading-relaxed text-center sm:text-left">
                  {CLASSIFIER_DB.questions[displayedQuestionIndex].question}
                </h2>
              </div>

              {/* Answer Options mapping */}
              {CLASSIFIER_DB.questions[displayedQuestionIndex].display === "image-grid" ? (
                /* Premium Responsive Image Grid Design */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {CLASSIFIER_DB.questions[displayedQuestionIndex].answers.map((ans, idx) => {
                    const isSelected = selections[CLASSIFIER_DB.questions[displayedQuestionIndex].id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`text-left rounded-xl overflow-hidden border transition-all duration-300 flex flex-col group w-full ${
                          isSelected 
                            ? "border-cyan-500 bg-[#091424] shadow-[0_4px_30px_rgba(56,189,248,0.1)]" 
                            : "border-slate-900 bg-slate-950/40 hover:border-slate-800"
                        }`}
                      >
                        <div className="relative h-44 w-full overflow-hidden">
                          <img 
                            src={ans.image} 
                            alt={ans.alt}
                            className="w-full h-full object-cover transition-transform duration-700 opacity-60 group-hover:opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] to-transparent" />
                        </div>
                        <div className="p-5 space-y-2">
                          <span className="text-[10px] font-sans-luxury text-cyan-400 tracking-[0.2em]">OPTION {String.fromCharCode(65 + idx)}</span>
                          <h4 className="font-display-luxury text-white text-base tracking-wider">{ans.text}</h4>
                          <p className="text-xs font-serif-luxury italic text-slate-400 leading-relaxed">{ans.alt}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Classy Standard Responsive Answer Options with Larger Text */
                <div className="space-y-4 w-full">
                  {CLASSIFIER_DB.questions[displayedQuestionIndex].answers.map((ans, idx) => {
                    const isSelected = selections[CLASSIFIER_DB.questions[displayedQuestionIndex].id] === idx;
                    const hasEmbed = getEmbedUrl(ans.url);
                    const isMemeQuestion = CLASSIFIER_DB.questions[displayedQuestionIndex].id === "meme_song";
                    
                    return (
                      <div 
                        key={idx} 
                        className={`rounded-lg border transition-all duration-300 overflow-hidden w-full ${
                          isSelected 
                            ? "border-cyan-500 bg-[#091424]/40" 
                            : "border-slate-900 bg-slate-950/20 hover:border-slate-800"
                        }`}
                      >
                        <button
                          onClick={() => handleSelectAnswer(idx)}
                          className="w-full text-left p-6 flex items-center gap-6"
                        >
                          <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-serif-luxury italic text-lg md:text-xl shrink-0 ${
                            isSelected 
                              ? "border-cyan-500 bg-cyan-500/10 text-cyan-400" 
                              : "border-slate-800 text-slate-500"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-slate-200 font-serif-luxury italic text-lg md:text-xl leading-relaxed">{ans.text}</span>
                        </button>

                        {/* Audio Transmission Button or Embed */}
                        {(hasEmbed || isMemeQuestion) && (
                          <div className="border-t border-slate-900 bg-slate-950 p-5 w-full flex gap-3">
                            {isMemeQuestion && ans.audioUrl && (
                              <button
                                onClick={() => playAudioTransmission(ans.audioUrl)}
                                className="flex-grow py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500 transition-all font-sans-luxury uppercase text-xs tracking-widest rounded-full flex items-center justify-center space-x-2"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Audio Transmission</span>
                              </button>
                            )}
                            {hasEmbed && (
                              <a 
                                href={ans.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-grow text-center py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-sans-luxury uppercase text-xs tracking-widest rounded-full"
                              >
                                Watch Video
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation panel */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-900">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-5 py-2.5 rounded border border-slate-900 text-[11px] font-sans-luxury uppercase tracking-widest text-slate-500 hover:text-slate-300 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev Link</span>
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={selections[CLASSIFIER_DB.questions[currentQuestionIndex].id] === undefined}
                className="px-6 py-2.5 bg-transparent border border-cyan-500 text-cyan-400 text-[11px] uppercase tracking-widest font-sans-luxury hover:bg-cyan-500/10 disabled:opacity-35 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
              >
                <span>{currentQuestionIndex === CLASSIFIER_DB.questions.length - 1 ? "Classify Target" : "Next Segment"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TIE BREAKER INTERFACE */}
        {currentScreen === 'tiebreaker' && (
          <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto w-full">
            <div className="p-4 rounded border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-sans-luxury tracking-widest flex items-center space-x-3 uppercase">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Spectrum Split. Resolving Overlaps via tiebreaker query.</span>
            </div>

            <div className="py-6 border-b border-slate-900">
              <h2 className="text-2xl md:text-3xl font-serif-luxury italic font-light text-slate-150 leading-relaxed text-center sm:text-left">
                “{CLASSIFIER_DB.tieBreakerQuestion.question}”
              </h2>
            </div>

            <div className="space-y-4">
              {CLASSIFIER_DB.tieBreakerQuestion.answers.map((ans, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => handleTieBreakerSubmit(idx)}
                    className="w-full text-left p-6 rounded border border-slate-900 bg-slate-950/40 hover:border-amber-500/40 hover:bg-slate-900/10 transition-all duration-300 flex items-center space-x-4"
                  >
                    <div className="w-10 h-10 rounded-full border border-slate-850 text-slate-400 flex items-center justify-center font-serif-luxury italic text-lg md:text-xl shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-slate-350 font-serif-luxury italic text-lg md:text-xl">{ans.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* LOADING SCREEN WITH SCANNER */}
        {currentScreen === 'loading' && (
          <div className="space-y-12 py-16 text-center max-w-md mx-auto animate-fadeIn">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 border-t border-b border-cyan-500/30 rounded-full animate-spin [animation-duration:12s]" />
              <div className="absolute inset-4 border-l border-r border-slate-800 rounded-full animate-spin [animation-duration:8s] [animation-direction:reverse]" />
              <div className="absolute inset-6 border border-cyan-400/40 rounded-full flex items-center justify-center">
                <Dna className="w-12 h-12 text-cyan-400/80 animate-pulse" />
              </div>
              
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400/20 animate-pulse pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-cyan-400/20 animate-pulse pointer-events-none" />
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-sans-luxury text-cyan-400 uppercase tracking-[0.25em] block">CALCULATING PROFILE</span>
              <h3 className="text-lg font-display-luxury tracking-widest text-slate-100 uppercase min-h-[56px] flex items-center justify-center">
                {loadingText}
              </h3>
              
              <div className="space-y-2">
                <div className="h-[2px] bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400/70 transition-all duration-150"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-sans-luxury text-slate-600 tracking-widest">
                  <span>SYSTEM_LOAD: 0x2A94</span>
                  <span>{loadingProgress}% COMPLETE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS PAGE (NO IMAGES AT ALL - JUST RADAR + DOSSIER DATA) */}
        {currentScreen === 'results' && matchResult && (
          <div className="space-y-12 animate-fadeIn w-full">
            
            {/* Header Identity Reveal */}
            <div className="text-center space-y-3">
              <span className="text-[10px] font-sans-luxury text-cyan-400 tracking-[0.3em] uppercase block">
                CLASSIFICATION RECORD DETECTED
              </span>
              <h2 className="text-5xl md:text-7xl font-light font-display-luxury tracking-[0.15em] text-white uppercase select-none relative inline-block">
                {CLASSIFIER_DB.species[matchResult].name}
              </h2>
              <div className="h-px w-24 bg-cyan-500/20 mx-auto" />
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-sans-luxury pt-1">
                Compatibility Rating: <span className="text-cyan-400 font-bold">{calculateCompatibility()}</span>
              </p>
            </div>

            {/* Split Grid - Two-Column Aesthetic */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
              
              {/* Left Column: Dossier Overview Text Data */}
              <div className="lg:col-span-7 space-y-6 w-full">
                <div className="p-8 md:p-10 rounded bg-slate-950/40 border border-slate-900 space-y-6">
                  <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
                    <FileText className="w-4 h-4 text-cyan-400/80" />
                    <span className="text-[10px] font-sans-luxury uppercase tracking-widest text-slate-500">
                      [CLASSIFIED OVERVIEW DOSSIER]
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-display-luxury tracking-widest text-white uppercase">
                    {CLASSIFIER_DB.species[matchResult].tagline}
                  </h3>
                  <p className="text-slate-300 font-serif-luxury italic text-lg md:text-2xl leading-relaxed text-justify">
                    “{CLASSIFIER_DB.species[matchResult].blurb}”
                  </p>
                </div>
              </div>

              {/* Right Column: Holographic Spider/Radar Chart */}
              <div className="lg:col-span-5 space-y-8 w-full">
                
                {/* Radar visualization card */}
                <div className="p-8 rounded bg-slate-950/40 border border-slate-900 space-y-4 relative overflow-hidden w-full">
                  <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyan-400/20" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-cyan-400/20" />

                  <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
                    <Sliders className="w-4 h-4 text-cyan-400/80 animate-pulse" />
                    <span className="text-[10px] font-sans-luxury uppercase tracking-widest text-slate-500">
                      [COSMIC IDENTITY RADAR]
                    </span>
                  </div>
                  
                  {/* Canvas container for reliable auto-layout aspect controls */}
                  <div className="h-64 sm:h-72 w-full flex items-center justify-center relative">
                    <canvas ref={chartRef} className="max-w-full max-h-full" />
                  </div>
                </div>

                {/* Traits Glossary List */}
                <div className="p-6 rounded bg-slate-950/20 border border-slate-900/60 space-y-4 w-full">
                  <span className="text-[10px] font-sans-luxury tracking-widest text-slate-400 block uppercase border-b border-slate-900 pb-2">
                    GLOSSARY OF DIAGNOSED VECTORS
                  </span>
                  <div className="space-y-4">
                    {Object.keys(CLASSIFIER_DB.traits).map(key => {
                      const value = CLASSIFIER_DB.species[matchResult].traits[key];
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-xs font-sans-luxury gap-2">
                            <span className="text-cyan-400 font-medium">{CLASSIFIER_DB.traits[key].name}</span>
                            <span className="text-slate-500 tracking-widest shrink-0">LEVEL {value}/5</span>
                          </div>
                          <p className="text-xs font-serif-luxury italic text-slate-400 leading-normal">
                            {CLASSIFIER_DB.traits[key].description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Premium Control actions footer */}
            <div className="p-6 md:p-8 rounded border border-slate-900 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
              <div className="flex items-center space-x-3">
                <Bookmark className="w-5 h-5 text-cyan-400/80" />
                <div className="font-sans-luxury">
                  <span className="text-[10px] text-slate-500 tracking-widest uppercase block">ENVELOPE STATE: SEALED</span>
                  <span className="text-xs text-cyan-400/90 font-semibold tracking-wider">GENOMIC CLASSIFICATION SECURED</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleShare}
                  className="px-6 py-3 rounded border border-slate-800 bg-slate-950 text-[11px] font-sans-luxury uppercase tracking-widest text-slate-300 hover:text-white hover:border-slate-600 transition-colors flex items-center space-x-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isCopied ? "Link Copied!" : "Export Registry Link"}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 text-[11px] font-sans-luxury uppercase tracking-widest transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return to Landing</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer console stream logs - Clean 2 column layout with NO middle slot */}
      <footer className="border-t border-slate-950 bg-[#070b12]/80 backdrop-blur py-4">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center w-full">
          
          <div className="md:col-span-9 flex items-center space-x-3 bg-slate-950/60 p-2.5 rounded border border-slate-900 font-sans-luxury text-[10px] text-slate-500 tracking-wider overflow-hidden w-full">
            <Terminal className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
            <div className="flex-grow flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
              {terminalLogs.map((log, index) => (
                <span key={index} className="opacity-80">
                  {log}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 text-right">
            <span className="text-[10px] font-sans-luxury tracking-widest text-slate-600 uppercase">
              SECURE DECK ACCESS // 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
