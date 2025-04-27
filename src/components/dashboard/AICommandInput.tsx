import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react'; // Import useAuth from Clerk
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Web Speech API setup
const SpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

const AICommandInput = () => {
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [executingCommand, setExecutingCommand] = useState('');
  const [resultContent, setResultContent] = useState('');
  const recognitionRef = useRef<any>(null);
  const { getToken } = useAuth(); // Get the getToken function from Clerk's useAuth

  useEffect(() => {
    if (!SpeechRecognition) return;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
    }
    const recognition = recognitionRef.current;
    const handleResult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCommand(transcript);
      setIsListening(false);
    };
    const handleError = (event: any) => {
      setIsListening(false);
    };
    const handleEnd = () => {
      setIsListening(false);
    };
    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('end', handleEnd);
    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('error', handleError);
      recognition.removeEventListener('end', handleEnd);
    };
  }, []);

  const toggleListening = () => {
    if (!SpeechRecognition) {
      toast.error('Speech Recognition Not Supported', {
        description: 'Your browser does not support the Web Speech API.',
      });
      return;
    }
    const recognition = recognitionRef.current;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info('Listening...', { description: 'Speak your command clearly.' });
    }
  };

  // Helper for speech synthesis
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const speakNow = () => {
        const utterance = new window.SpeechSynthesisUtterance(text);
        synth.speak(utterance);
      };
      if (synth.getVoices().length === 0) {
        synth.onvoiceschanged = speakNow;
      } else {
        speakNow();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsLoading(true);
    setModalOpen(true);
    setExecutingCommand(command);
    speak('I am processing your input.');
    const loadingToastId = toast.loading('Processing command...');

    try {
      const token = await getToken(); // Get the Clerk token
      if (!token) {
        throw new Error('Authentication token not available. Please sign in.');
      }

      const response = await fetch(`${API_URL}/api/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ command }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process command');
      }

      toast.success('Command Processed', {
        id: loadingToastId,
        description: result.interpretation || result.result || 'Received confirmation.',
      });
      speak(result.result || result.interpretation || 'Your request is successfully done.');
      setResultContent(result.result || result.interpretation || JSON.stringify(result));
      setResultModalOpen(true);
      setCommand(''); // Clear input on success
      setModalOpen(false);
      setExecutingCommand('');
    } catch (error: any) {
      console.error('Command error:', error);
      toast.error('Command Failed', {
        id: loadingToastId,
        description: error.message || 'An unexpected error occurred.',
      });
      speak('There was an error processing your request.');
      setModalOpen(false);
      setExecutingCommand('');
    } finally {
      setIsLoading(false);
    }
  };

  // Speak the result when the result modal opens
  useEffect(() => {
    if (resultModalOpen && resultContent) {
      speak(resultContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultModalOpen, resultContent]);

  return (
    <>
      {/* Processing Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Executing Command</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <span className="text-muted-foreground">{executingCommand}</span>
            <div className="mt-4 animate-pulse text-sm text-gray-500">Please wait...</div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Result Modal */}
      <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Result</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center break-words">
            <span className="text-foreground">{resultContent}</span>
          </div>
        </DialogContent>
      </Dialog>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
        <Input
          type="text"
          placeholder="Enter command (e.g., 'Summarize my unread emails')"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          disabled={isLoading || isListening}
          className="flex-grow"
        />
        {/* Microphone Button */}
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={toggleListening}
          disabled={isLoading}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        {/* Send Button */}
        <Button type="submit" disabled={isLoading || !command.trim()} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </>
  );
};

export default AICommandInput;
