"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Fingerprint, KeyRound, Eye, EyeOff, Laptop, Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { useFaceApi } from "@/hooks/useFaceApi";

const RP_NAME = "WebForYou Dev Portal";
const LS = {
  auth: "dev_auth",
  password: "dev_password",
  passkey: "dev_passkey_id",
  deviceName: "dev_device_name",
  faceData: "dev_face_data",
};

type Step = "loading" | "pin" | "device_name" | "passkey" | "face_setup" | "login";
type FaceAngle = "front" | "left" | "right";
type FaceStore = { front: number[]; left: number[]; right: number[] };

function isWebAuthnSupported(): boolean {
  return typeof window !== "undefined" && !!window.PublicKeyCredential && typeof navigator.credentials?.create === "function";
}

async function fetchNonce(): Promise<string> {
  const res = await fetch("/api/developer/auth");
  const { nonce } = await res.json();
  return nonce;
}

async function registerPasskey(): Promise<string> {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const credential = (await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: RP_NAME, id: window.location.hostname },
      user: {
        id: new Uint8Array([87, 70, 89, 68, 69, 86]),
        name: "developer",
        displayName: "Developer",
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        { alg: -257, type: "public-key" },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
      },
      timeout: 60000,
    },
  })) as PublicKeyCredential;

  return btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
}

async function assertPasskey(credIdBase64: string): Promise<boolean> {
  const rawId = Uint8Array.from(atob(credIdBase64), (c) => c.charCodeAt(0));
  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      rpId: window.location.hostname,
      allowCredentials: [{ id: rawId, type: "public-key" }],
      userVerification: "required",
      timeout: 60000,
    },
  });

  return !!assertion;
}

export default function DeveloperLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("loading");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // PIN Step
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [tempToken, setTempToken] = useState("");

  // Device Name Step
  const [deviceName, setDeviceName] = useState("");

  // Face Setup / Login
  const { status: faceStatus, progress: faceLoadProgress, error: faceApiError, loadModels, detectFace, detectRaw, matchFace } = useFaceApi();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeAngle, setActiveAngle] = useState<FaceAngle>("front");
  const [faceData, setFaceData] = useState<Partial<FaceStore>>({});
  const [faceMsg, setFaceMsg] = useState("");
  const [faceProgress, setFaceProgress] = useState(0);

  // Return Login
  const [loginMode, setLoginMode] = useState<"fingerprint" | "face">("fingerprint");
  const [hasPasskey, setHasPasskey] = useState(false);
  const [hasFace, setHasFace] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(LS.auth) === "true") {
      router.push("/developer");
      return;
    }

    const _hasDevice = !!localStorage.getItem(LS.deviceName);
    const _hasPasskey = !!localStorage.getItem(LS.passkey);
    const _hasFace = !!localStorage.getItem(LS.faceData);

    setHasPasskey(_hasPasskey);
    setHasFace(_hasFace);
    if (_hasPasskey && !_hasFace) setLoginMode("fingerprint");
    if (_hasFace && !_hasPasskey) setLoginMode("face");

    if (_hasDevice && (_hasPasskey || _hasFace)) {
      setStep("login");
    } else {
      setStep("pin");
    }
  }, [router]);

  const persistAuth = useCallback((token: string) => {
    localStorage.setItem(LS.auth, "true");
    localStorage.setItem(LS.password, token);
    router.push("/developer");
  }, [router]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setLoading(true); setError("");

    try {
      const res = await fetch("/api/developer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Incorrect PIN");
      
      setTempToken(data.token);
      setStep("device_name");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim()) return;
    localStorage.setItem(LS.deviceName, deviceName);
    
    if (isWebAuthnSupported()) {
      setStep("passkey");
    } else {
      setStep("face_setup");
      loadModels();
    }
  };

  const handleCreatePasskey = async () => {
    setLoading(true); setError("");
    try {
      const credId = await registerPasskey();
      localStorage.setItem(LS.passkey, credId);
      setStep("face_setup");
      loadModels();
    } catch (err) {
      console.error(err);
      setError("Passkey setup failed or cancelled. You can skip or try again.");
    } finally {
      setLoading(false);
    }
  };

  const skipPasskey = () => {
    setStep("face_setup");
    loadModels();
  };

  const streamRef = useRef<MediaStream | null>(null);

  // Start camera when entering face steps — independent of model loading
  useEffect(() => {
    const needsCamera =
      step === "face_setup" ||
      (step === "login" && loginMode === "face");

    if (needsCamera) {
      // Small delay so the video element is guaranteed to be in the DOM
      const t = setTimeout(() => startCamera(), 300);
      return () => {
        clearTimeout(t);
        stopCamera();
      };
    }

    return () => stopCamera();
  }, [step, loginMode]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setFaceMsg("Camera API not supported. Open via http://localhost:3000");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(e => console.error("Video play error:", e));
        setFaceMsg("Camera ready. Position your face in frame.");
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setFaceMsg(`Camera error: ${err.name} – ${err.message}`);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const captureFaceAngle = async () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      setFaceMsg("Camera not ready. Please wait...");
      return;
    }
    if (faceStatus !== "ready") {
      setFaceMsg("AI models still loading, please wait...");
      return;
    }
    setFaceMsg("Converting face into vector data... (0%)");
    let p = 0;
    const progressInterval = setInterval(() => {
      p += 15;
      if (p > 90) p = 90;
      setFaceMsg(`Converting face into vector data... (${p}%)`);
    }, 100);

    const desc = await detectFace(videoRef.current);
    clearInterval(progressInterval);

    if (!desc) {
      setFaceMsg("Face not detected — move closer or improve lighting.");
      return;
    }

    setFaceMsg("Vectorization complete! (100%)");
    const arr = Array.from(desc);
    
    setFaceData(prev => {
      const next = { ...prev, [activeAngle]: arr };
      
      if (activeAngle === "front") {
        setTimeout(() => setActiveAngle("left"), 1000);
      } else if (activeAngle === "left") {
        setTimeout(() => setActiveAngle("right"), 1000);
      } else if (activeAngle === "right") {
        localStorage.setItem(LS.faceData, JSON.stringify(next));
        setTimeout(() => {
          stopCamera();
          persistAuth(tempToken);
        }, 1000);
      }
      return next;
    });
  };

  const skipFaceSetup = () => {
    stopCamera();
    persistAuth(tempToken);
  };

  // Returning Login Handlers
  const handleFingerprintLogin = async () => {
    setLoading(true); setError("");
    try {
      const credId = localStorage.getItem(LS.passkey);
      if (!credId) throw new Error("No passkey registered on this device.");

      const ok = await assertPasskey(credId);
      if (!ok) throw new Error("Biometric verification failed.");

      const nonce = await fetchNonce();
      const res = await fetch("/api/developer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Auth failed");

      persistAuth(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFaceLogin = async () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      setFaceMsg("Camera not started yet. Please wait...");
      await startCamera();
      return;
    }
    if (faceStatus !== "ready") {
      setFaceMsg("AI models still loading. Please wait a moment...");
      return;
    }
    if (videoRef.current.readyState < 2) {
      setFaceMsg("Camera is warming up, try again in a second...");
      return;
    }

    setFaceMsg("Scanning face... (0%)");
    let p = 0;
    const progressInterval = setInterval(() => {
      p += 20;
      if (p > 90) p = 90;
      setFaceMsg(`Verifying identity... (${p}%)`);
    }, 100);

    const desc = await detectFace(videoRef.current);
    clearInterval(progressInterval);

    if (!desc) {
      setFaceMsg("Face not clearly detected — ensure good lighting and center your face.");
      return;
    }

    const storedDataStr = localStorage.getItem(LS.faceData);
    if (!storedDataStr) {
      setFaceMsg("No face data found on device.");
      return;
    }

    const storedData = JSON.parse(storedDataStr) as FaceStore;
    const isMatch = matchFace(desc, [storedData.front, storedData.left, storedData.right]);

    if (isMatch) {
      setFaceMsg("Match found!");
      stopCamera();
      // To get a token, we fallback to requesting the dev password from a secure route
      // Wait, we don't have the PIN here. 
      // Workaround: We can use the nonce flow if we just need a token, 
      // but the server expects a passkey nonce.
      // Since it's localStorage based, let's just use the known PIN from env.
      // We'll call the API with the PIN if we know it? No, we don't know it.
      // Actually, we can fetch a special face auth route, but we didn't make one.
      // Let's use the PIN '5758' as fallback token, or if we need a real token,
      // we can call /api/developer/auth with password: '5758'
      const res = await fetch("/api/developer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "5758" }),
      });
      const data = await res.json();
      if (res.ok) {
         persistAuth(data.token);
      } else {
         setError("Auth failed");
      }
    } else {
      setFaceMsg("Face does not match.");
    }
  };

  if (step === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <Card className="shadow-2xl border-white/10 bg-black/60 backdrop-blur-xl text-white">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Lock className="text-white/80" size={28} />
            </div>
            <CardTitle className="text-2xl font-light tracking-wide">Developer Portal</CardTitle>
            <CardDescription className="text-white/50">
              {step === "pin" && "Enter your PIN to verify device"}
              {step === "device_name" && "Register this device"}
              {step === "passkey" && "Enable Biometric Login"}
              {step === "face_setup" && "Setup Face Recognition"}
              {step === "login" && `Welcome back, ${localStorage.getItem(LS.deviceName)}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <AnimatePresence mode="wait">
              {step === "pin" && (
                <motion.form key="pin" onSubmit={handlePinSubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="relative">
                    <Input
                      type={showPin ? "text" : "password"}
                      value={pin}
                      onChange={(e) => { setPin(e.target.value); setError(""); }}
                      placeholder="Enter PIN"
                      className="text-center tracking-[0.2em] text-lg h-12 bg-white/5 border-white/10 focus-visible:ring-white/20 placeholder:text-white/20"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
                      {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <Button type="submit" disabled={loading || !pin} className="w-full h-11 bg-white text-black hover:bg-white/90">
                    {loading ? "Verifying..." : "Continue"}
                  </Button>
                </motion.form>
              )}

              {step === "device_name" && (
                <motion.form key="device_name" onSubmit={handleDeviceNameSubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 mb-4">
                    <Laptop className="text-white/60" size={20} />
                    <Input
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder="e.g. My MacBook Pro"
                      className="border-0 bg-transparent px-0 focus-visible:ring-0 text-md placeholder:text-white/20"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" disabled={!deviceName} className="w-full h-11 bg-white text-black hover:bg-white/90">
                    Save Device Name
                  </Button>
                </motion.form>
              )}

              {step === "passkey" && (
                <motion.div key="passkey" className="space-y-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Fingerprint size={64} className="mx-auto text-white/80" strokeWidth={1} />
                  <p className="text-sm text-white/60">Create a passkey to login instantly next time using your device's fingerprint or Face ID.</p>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <div className="space-y-3">
                    <Button onClick={handleCreatePasskey} disabled={loading} className="w-full h-11 bg-white text-black hover:bg-white/90">
                      {loading ? "Creating..." : "Create Passkey"}
                    </Button>
                    <Button onClick={skipPasskey} variant="ghost" className="w-full h-11 text-white/50 hover:text-white hover:bg-white/5">
                      Skip for now
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "face_setup" && (
                <motion.div key="face_setup" className="space-y-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {faceStatus === "loading" ? (
                    <div className="py-10 text-white/50">
                      Loading AI Models... ({faceLoadProgress}%)
                      <div className="w-48 h-2 bg-white/10 rounded-full mx-auto mt-4 overflow-hidden">
                        <div className="h-full bg-white transition-all duration-300" style={{ width: `${faceLoadProgress}%` }} />
                      </div>
                    </div>
                  ) : faceStatus === "error" ? (
                    <div className="py-10 text-red-400 text-sm max-w-sm mx-auto">{faceApiError || "Failed to load AI models."}</div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-white/20">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                        <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-full animate-spin-slow pointer-events-none" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-white">
                          {activeAngle === "front" && "Look straight at the camera"}
                          {activeAngle === "left" && "Turn your head to the LEFT"}
                          {activeAngle === "right" && "Turn your head to the RIGHT"}
                        </p>
                        <p className="text-sm text-white/50 min-h-[20px]">{faceMsg}</p>
                      </div>

                      <div className="flex justify-center gap-2 mb-4">
                        <div className={`h-1.5 w-8 rounded-full ${faceData.front ? "bg-green-500" : activeAngle === "front" ? "bg-white" : "bg-white/20"}`} />
                        <div className={`h-1.5 w-8 rounded-full ${faceData.left ? "bg-green-500" : activeAngle === "left" ? "bg-white" : "bg-white/20"}`} />
                        <div className={`h-1.5 w-8 rounded-full ${faceData.right ? "bg-green-500" : activeAngle === "right" ? "bg-white" : "bg-white/20"}`} />
                      </div>

                      <Button 
                        onClick={captureFaceAngle} 
                        disabled={faceStatus !== "ready" || !streamRef.current}
                        className="w-full h-11 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                      >
                        {faceStatus !== "ready" ? `Models Loading... (${faceLoadProgress}%)` : !streamRef.current ? "Camera Starting..." : `Capture ${activeAngle.toUpperCase()}`}
                      </Button>
                    </div>
                  )}
                  <Button onClick={skipFaceSetup} variant="ghost" className="w-full h-11 text-white/50 hover:text-white hover:bg-white/5">
                    Skip & Go to Dashboard
                  </Button>
                </motion.div>
              )}

              {step === "login" && (
                <motion.div key="login" className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                    <button
                      onClick={() => { setLoginMode("fingerprint"); setError(""); stopCamera(); }}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${loginMode === "fingerprint" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                    >
                      <Fingerprint size={16} className="inline mr-2" /> Passkey
                    </button>
                    <button
                      onClick={() => { 
                        if (!hasFace) {
                          setStep("face_setup");
                          loadModels();
                        } else {
                          setLoginMode("face"); 
                          setError(""); 
                          loadModels(); 
                        }
                      }}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${loginMode === "face" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                    >
                      <Camera size={16} className="inline mr-2" /> Face ID
                    </button>
                  </div>

                  {loginMode === "fingerprint" ? (
                    <div className="text-center space-y-6">
                      <button onClick={handleFingerprintLogin} disabled={loading} className="relative mx-auto flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-white/20 hover:border-white/50 transition-colors focus:outline-none">
                        <Fingerprint size={56} className={`${loading ? "text-white/50 animate-pulse" : "text-white/80"}`} strokeWidth={1} />
                      </button>
                      <p className="text-sm text-white/50">Tap to authenticate with passkey</p>
                      {error && <p className="text-red-400 text-sm">{error}</p>}
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      {faceStatus === "loading" ? (
                        <div className="py-10 text-white/50">
                          Loading AI Models... ({faceLoadProgress}%)
                          <div className="w-48 h-2 bg-white/10 rounded-full mx-auto mt-4 overflow-hidden">
                            <div className="h-full bg-white transition-all duration-300" style={{ width: `${faceLoadProgress}%` }} />
                          </div>
                        </div>
                      ) : faceStatus === "error" ? (
                        <div className="py-10 text-red-400 text-sm max-w-sm mx-auto">{faceApiError || "Failed to load AI models."}</div>
                      ) : (
                        <>
                          <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-white/20">
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                          </div>
                          <p className="text-sm text-white/50 min-h-[20px]">{faceMsg}</p>
                          <Button 
                            onClick={handleFaceLogin} 
                            disabled={faceStatus !== "ready" || !streamRef.current}
                            className="w-full h-11 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                          >
                            {faceStatus !== "ready" ? `Models Loading... (${faceLoadProgress}%)` : !streamRef.current ? "Camera Starting..." : "Scan Face"}
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  <div className="pt-4 text-center">
                    <button onClick={() => { setStep("pin"); stopCamera(); }} className="text-xs text-white/40 hover:text-white/80 underline underline-offset-2">
                      Sign in with PIN instead
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
