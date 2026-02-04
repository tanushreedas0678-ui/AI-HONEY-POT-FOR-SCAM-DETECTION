import { useState, useEffect } from 'react';
import { ConversationView } from '@/app/components/ConversationView';
import { IntelligenceExtraction } from '@/app/components/IntelligenceExtraction';
import { StatsOverview } from '@/app/components/StatsOverview';
import { Shield, Play, RotateCcw, Code } from 'lucide-react';

interface Message {
  id: number;
  sender: 'scammer' | 'honeypot';
  text: string;
  timestamp: string;
}

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showJson, setShowJson] = useState(false);

  // Stats data
  const [stats, setStats] = useState({
    totalScams: 127,
    activeEngagements: 3,
    bankAccounts: 45,
    upiIds: 89,
    phishingLinks: 156
  });

  const extractedData = {
    scam_detected: true,
    scam_type: 'KYC Fraud',
    confidence_score: 0.93,
    extracted_entities: {
      upi_id: 'verify@cupi',
      bank_account: null,
      phishing_link: 'http://fake-kyc.in'
    },
    agent_persona: 'Rahul Verma',
    risk_level: 'High'
  };

  const conversationScript = [
    {
      id: 1,
      sender: 'scammer' as const,
      text: 'Dear Customer, Your KYC is pending. Click this link to verify immediately: http://fake-kyc.in',
      timestamp: '10:23 AM'
    },
    {
      id: 2,
      sender: 'honeypot' as const,
      text: 'Oh no! I just saw this message. Is my account going to be blocked? I need it for my business.',
      timestamp: '10:24 AM'
    },
    {
      id: 3,
      sender: 'scammer' as const,
      text: 'Yes sir, your account will be blocked in 2 hours. Please click the link and update your details urgently.',
      timestamp: '10:24 AM'
    },
    {
      id: 4,
      sender: 'honeypot' as const,
      text: 'I clicked but it\'s asking for payment. Is this normal? I run a small business and can\'t afford any issues.',
      timestamp: '10:25 AM'
    },
    {
      id: 5,
      sender: 'scammer' as const,
      text: 'Yes, pay ₹500 for verification. Send to UPI: verify@cupi. This is mandatory for KYC compliance.',
      timestamp: '10:26 AM'
    },
    {
      id: 6,
      sender: 'honeypot' as const,
      text: 'Okay, let me send it now. Can you confirm the UPI ID again? I want to make sure I send it to the right place.',
      timestamp: '10:27 AM'
    },
    {
      id: 7,
      sender: 'scammer' as const,
      text: 'Yes, send to verify@cupi. After payment, share screenshot here for instant activation.',
      timestamp: '10:27 AM'
    }
  ];

  const startSimulation = () => {
    setIsRunning(true);
    setCurrentStep(1);
    setMessages([]);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setMessages([]);
  };

  useEffect(() => {
    if (!isRunning) return;

    const stepDuration = 2000;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 7) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (currentStep >= 4 && currentStep <= 7) {
      const messageIndex = currentStep - 4;
      const messagesToShow = conversationScript.slice(0, (messageIndex + 1) * 2);
      setMessages(messagesToShow);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-white">AI Honeypot System</h1>
                <p className="text-sm text-gray-400">Scam Detection & Intelligence Extraction</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowJson(!showJson)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showJson
                    ? 'bg-white text-black border-white'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                }`}
              >
                <Code className="size-4" />
                {showJson ? 'Hide JSON' : 'Show JSON'}
              </button>

              {!isRunning ? (
                <button
                  onClick={startSimulation}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="size-4" />
                  Start Simulation
                </button>
              ) : (
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-2 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="size-4" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Status Banner */}
        {isRunning && (
          <div className="bg-blue-950 border border-blue-800 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-2 bg-blue-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-blue-200">
                Workflow in progress... Step {currentStep} of 7
              </p>
            </div>
            {currentStep === 7 && (
              <div className="flex items-center gap-2 bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">
                <Shield className="size-4" />
                Scam Intelligence Extracted
              </div>
            )}
          </div>
        )}

        {!isRunning && currentStep === 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center mb-6">
            <div className="size-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="size-8 text-blue-400" />
            </div>
            <h2 className="text-2xl mb-2 text-white">Agentic Honeypot for Scam Detection</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              This autonomous AI honeypot system detects scam messages and actively engages
              scammers using a believable persona to extract bank account details, UPI IDs, and
              phishing links.
            </p>
            <button
              onClick={startSimulation}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="size-5" />
              Start Demo Simulation
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview {...stats} />
        </div>

        {/* Conversation & Intelligence */}
        <div className="space-y-6">
          {/* Conversation View */}
          {currentStep >= 4 && (
            <div>
              <h2 className="text-lg mb-4 flex items-center gap-2 text-white">
                <Shield className="size-5" />
                Live Conversation Monitor
              </h2>
              <ConversationView messages={messages} persona="Rahul Verma - Small Business Owner" />
            </div>
          )}

          {/* Intelligence Extraction */}
          {currentStep >= 6 && (
            <div>
              <h2 className="text-lg mb-4 flex items-center gap-2 text-white">
                <Shield className="size-5" />
                Extracted Intelligence
              </h2>
              <IntelligenceExtraction data={extractedData} showJson={showJson} />
            </div>
          )}
        </div>

        {/* Problem Statement Reference */}
        <div className="mt-8 bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg mb-4 text-white">System Capabilities</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-950 rounded-lg border border-blue-900">
              <p className="text-sm text-blue-300">✓ Autonomous scam detection</p>
            </div>
            <div className="p-4 bg-blue-950 rounded-lg border border-blue-900">
              <p className="text-sm text-blue-300">✓ Believable AI persona engagement</p>
            </div>
            <div className="p-4 bg-blue-950 rounded-lg border border-blue-900">
              <p className="text-sm text-blue-300">✓ Intelligence extraction</p>
            </div>
            <div className="p-4 bg-blue-950 rounded-lg border border-blue-900">
              <p className="text-sm text-blue-300">✓ Structured JSON output</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}