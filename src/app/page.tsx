// src/app/page.tsx
"use client";
import { useRef } from "react";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import domtoimage from "dom-to-image-more";

type Option = { label: string; text: string; points: number };
type Question = { question: string; options: Option[] };

const questions: Question[] = [
  {
    question: "Current relationship status",
    options: [
      { label: "A", text: "Committed partner you live with", points: 4 },
      { label: "B", text: "Committed partner you don’t live with", points: 3 },
      { label: "C", text: "Casual dating / situationship", points: 2 },
      { label: "D", text: "Single & not seeing anyone", points: 0 },
    ],
  },
  {
    question: "How often did you have sex in the last 30 days?",
    options: [
      { label: "A", text: "≥ 8 times", points: 4 },
      { label: "B", text: "4–7 times", points: 3 },
      { label: "C", text: "1–3 times", points: 2 },
      { label: "D", text: "0 times", points: 0 },
    ],
  },
  {
    question:
      "Already scheduled 1‑on‑1 plans with someone you’re attracted to this week?",
    options: [
      { label: "A", text: "Yes, overnight or weekend trip", points: 4 },
      { label: "B", text: "Yes, evening date", points: 3 },
      { label: "C", text: "Only informal “maybe” plans", points: 2 },
      { label: "D", text: "Nothing scheduled", points: 0 },
    ],
  },
  {
    question: "Active use of dating apps in the past 72 h",
    options: [
      { label: "A", text: "> 20 messages sent", points: 4 },
      { label: "B", text: "5–20 messages", points: 3 },
      { label: "C", text: "Browsing only", points: 2 },
      { label: "D", text: "No apps / no use", points: 0 },
    ],
  },
  {
    question: "Social events you’ll attend this week",
    options: [
      { label: "A", text: "≥ 2 large events", points: 4 },
      { label: "B", text: "1 large event", points: 3 },
      { label: "C", text: "Small friend meet‑ups only", points: 2 },
      { label: "D", text: "None", points: 0 },
    ],
  },
  {
    question: "Privacy of your living space",
    options: [
      { label: "A", text: "Own place / partner’s place always free", points: 4 },
      { label: "B", text: "Frequently have privacy", points: 3 },
      { label: "C", text: "Sometimes have privacy", points: 2 },
      { label: "D", text: "Rarely/never have privacy", points: 0 },
    ],
  },
  {
    question: "Personal energy & health this week",
    options: [
      { label: "A", text: "Feeling great, high energy", points: 4 },
      { label: "B", text: "Fine overall", points: 3 },
      { label: "C", text: "A bit under the weather", points: 2 },
      { label: "D", text: "Very tired / sick", points: 0 },
    ],
  },
  {
    question: "Confidence flirting in person",
    options: [
      { label: "A", text: "I start most flirty interactions", points: 4 },
      { label: "B", text: "Comfortable if mutual", points: 3 },
      { label: "C", text: "Need alcohol / cues", points: 2 },
      { label: "D", text: "Very uncomfortable", points: 0 },
    ],
  },
  {
    question: "Communication with a likely partner in the last 48 h",
    options: [
      { label: "A", text: "Explicitly talked about meeting up", points: 4 },
      { label: "B", text: "Sent flirty messages", points: 3 },
      { label: "C", text: "Casual chat only", points: 2 },
      { label: "D", text: "No contact", points: 0 },
    ],
  },
  {
    question: "Grooming & self‑care readiness",
    options: [
      { label: "A", text: "Fresh haircut/style & wardrobe prepped", points: 4 },
      { label: "B", text: "Pretty well groomed", points: 3 },
      { label: "C", text: "Passable/neutral", points: 2 },
      { label: "D", text: "Feeling unkempt", points: 0 },
    ],
  },
  {
    question: "Time‑demand from work/school this week",
    options: [
      { label: "A", text: "Light (< 20 h)", points: 4 },
      { label: "B", text: "Moderate (20–40 h)", points: 3 },
      { label: "C", text: "Heavy (40–60 h)", points: 2 },
      { label: "D", text: "Crunch time (> 60 h)", points: 0 },
    ],
  },
  {
    question: "Stress/mood level",
    options: [
      { label: "A", text: "Relaxed & optimistic", points: 4 },
      { label: "B", text: "Manageable", points: 3 },
      { label: "C", text: "Somewhat stressed", points: 2 },
      { label: "D", text: "Very stressed/irritable", points: 0 },
    ],
  },
  {
    question: "Alcohol or other social lubricants",
    options: [
      { label: "A", text: "Comfortable sober or light drinks", points: 4 },
      { label: "B", text: "Likely 1–2 drinks", points: 3 },
      { label: "C", text: "Need 3+ drinks to loosen up", points: 2 },
      { label: "D", text: "Plan to stay totally home/sober & alone", points: 0 },
    ],
  },
  {
    question: "Travel distance to your most probable partner",
    options: [
      { label: "A", text: "Same bed", points: 4 },
      { label: "B", text: "Same city", points: 3 },
      { label: "C", text: "≤ 1 h commute", points: 2 },
      { label: "D", text: "Different city/long‑distance", points: 0 },
    ],
  },
  {
    question: "Birth‑control / protection availability",
    options: [
      { label: "A", text: "Already on hand, both comfortable", points: 4 },
      { label: "B", text: "Easy to get quickly", points: 3 },
      { label: "C", text: "Might need a store run", points: 2 },
      { label: "D", text: "None / unsure", points: 0 },
    ],
  },
];

const maxScore = questions.length * 4;

export default function QuizApp() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = () => {
    if (name.trim()) setStarted(true);
  };

  const answerQuestion = (points: number) => {
    const newScore = score + points;
    if (current + 1 === questions.length) {
      setScore(newScore);
      setFinished(true);
    } else {
      setScore(newScore);
      setCurrent(current + 1);
    }
  };

  const probability = Math.round((score / maxScore) * 100);
  const cardRef = useRef<HTMLDivElement>(null);
  // NEW: capture & share screenshot
  const handleShareScreenshot = async () => {
    const el = cardRef.current;
    if (!el) return alert("Result card not mounted yet.");
  
    // 1) Capture the card as before
    const { width, height } = el.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
  
    let blob: Blob;
    try {
      blob = await domtoimage.toBlob(el, {
        width:  width * scale,
        height: height * scale,
        cacheBust: true,
        bgcolor: "#fff",
        style: {
          transform:       `scale(${scale})`,
          transformOrigin: "top left",
          width:            `${width}px`,
          height:           `${height}px`,
        },
        filter: (node: HTMLElement) => {
          if (node !== el && node instanceof HTMLElement) {
            node.style.border = "none";
            node.style.backgroundColor = "transparent";
          }
          return true;
        },
      });
    } catch (err) {
      console.error(err);
      return alert("Screenshot failed—see console.");
    }
  
    const scoreText = `I just scored ${probability}% in this test`;
    const shareUrl  = window.location.href;
    const fullText  = `${scoreText}, try now at ${shareUrl}`;
  
    const file = new File([blob], "quiz-result.png", { type: "image/png" });
  
    // 2) Attempt files+text+url share
    const shareWithFile = {
      title: "Quiz Result",
      text:  fullText,
      url:   shareUrl,
      files: [file] as File[],
    };
  
    // Check if the browser supports sharing files+text
    const canShareFiles = !!navigator.canShare && navigator.canShare({
      files: [file],
      text:  fullText,
      url:   shareUrl,
    });
  
    try {
      if (canShareFiles) {
        await navigator.share(shareWithFile);
      } else if (navigator.canShare?.({ text: fullText, url: shareUrl })) {
        // fallback: text+url only
        await navigator.share({
          title: "Quiz Result",
          text:  fullText,
          url:   shareUrl,
        });
      } else {
        // ultimate fallback: copy to clipboard
        await navigator.clipboard.writeText(fullText);
        alert("Image sharing not supported—copied text to clipboard.");
      }
    } catch (err) {
      console.error("Share failed:", err);
      alert("Share canceled or failed.");
    }
  };
  
  // NAME ENTRY
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-center">
              Will you get laid?
            </h1>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button className="w-full" onClick={startQuiz}>
              Start
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // RESULTS
  if (finished) {
    let bandText = "";
    if (score <= 14) bandText = "Looks like a pretty quiet week.";
    else if (score <= 29) bandText = "Some sparks, but no guarantees.";
    else if (score <= 44) bandText = "Odds are in your favor—make a move!";
    else bandText = "Red‑hot runway; buckle up!";

    return (
      <div  className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <Card ref={cardRef} id="result-card" className="w-full max-w-md">
          <CardContent className="p-6 space-y-4 text-center">
            <h2 className="text-2xl font-bold">Hey {name}!</h2>
            <p className="text-xl">Your probability of getting laid this week is</p>
            <p className="text-6xl font-extrabold">{probability}%</p>
            <p className="italic">{bandText}</p>
            <div className="space-y-2 mt-4">
              <Button className="w-full" onClick={handleShareScreenshot}>
                Share Result
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => window.open("https://www.buymeacoffee.com/thelayman", "_blank")}
              >
                Buy me a beer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // QUESTIONS
  const q = questions[current];
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="p-6 space-y-6">
          <Progress value={(current / questions.length) * 100} />
          <h2 className="text-xl font-semibold">
            Question {current + 1} of {questions.length}
          </h2>
          <p className="font-medium">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((opt) => (
              <Button
                key={opt.label}
                className="w-full justify-start"
                variant="outline"
                onClick={() => answerQuestion(opt.points)}
              >
                <span className="font-bold mr-2">{opt.label}.</span>
                {opt.text}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
