import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Демо текст с аккордами
  const songLines = [
    { type: "title", text: "Кино - Группа крови" },
    { type: "chord", text: "Am" },
    { type: "lyric", text: "Теплое место, но улицы ждут" },
    { type: "chord", text: "F" },
    { type: "lyric", text: "Отпечатков наших ног" },
    { type: "chord", text: "C" },
    { type: "lyric", text: "Звездная пыль на сапогах" },
    { type: "chord", text: "G" },
    { type: "lyric", text: "Мягкий свет фонарей" },
    { type: "chord", text: "Am" },
    { type: "lyric", text: "Группа крови на рукаве" },
    { type: "chord", text: "F" },
    { type: "lyric", text: "Мой порядковый номер на рукаве" },
    { type: "chord", text: "C" },
    { type: "lyric", text: "Пожелай мне удачи в бою" },
    { type: "chord", text: "G" },
    { type: "lyric", text: "Пожелай мне не остаться в этой траве" },
    { type: "chord", text: "Am" },
    { type: "lyric", text: "Пожелай мне удачи" },
    { type: "chord", text: "F" },
    { type: "lyric", text: "Пожелай мне удачи" },
  ];

  // Только строки с текстом для выделения
  const lyricLines = songLines.filter((line) => line.type === "lyric");

  useEffect(() => {
    if (isPlaying) {
      // Конвертируем BPM в миллисекунды (60000ms / BPM)
      const intervalTime = 60000 / bpm;

      intervalRef.current = setInterval(() => {
        setCurrentLyricIndex((prev) => {
          if (prev < lyricLines.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return 0;
          }
        });
      }, intervalTime);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm, lyricLines.length]);

  // Автоскролл к активной строке (только lyrics)
  useEffect(() => {
    if (scrollContainerRef.current && currentLyricIndex < lyricLines.length) {
      const currentLyricText = lyricLines[currentLyricIndex].text;

      // Найдем индекс этой строки в общем массиве
      const globalIndex = songLines.findIndex(
        (line) => line.type === "lyric" && line.text === currentLyricText,
      );

      if (globalIndex !== -1) {
        const activeElement = scrollContainerRef.current.children[
          globalIndex
        ] as HTMLElement;
        if (activeElement) {
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [currentLyricIndex, lyricLines, songLines]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSong = () => {
    setIsPlaying(false);
    setCurrentLyricIndex(0);
  };

  const getLineClassName = (index: number, type: string) => {
    const baseClasses = "py-2 px-4 rounded-lg transition-all duration-300 ";

    // Определяем активность строки
    let isActive = false;
    if (type === "lyric") {
      const currentLyricText = lyricLines[currentLyricIndex]?.text;
      const currentLineText = songLines[index]?.text;
      isActive = currentLyricText === currentLineText;
    }

    switch (type) {
      case "title":
        return (
          baseClasses +
          `text-2xl font-bold text-center ${isActive ? "bg-purple-100 text-purple-800" : "text-gray-800"}`
        );
      case "chord":
        return (
          baseClasses +
          `text-lg font-mono font-bold ${isActive ? "bg-purple-100 text-purple-700" : "text-purple-600"}`
        );
      case "lyric":
        return (
          baseClasses +
          `text-lg ${isActive ? "bg-purple-100 text-gray-900 font-semibold" : "text-gray-700"}`
        );
      default:
        return baseClasses;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Icon name="Music" size={28} />
            Гитарный помощник
          </h1>
          <p className="text-gray-600 mt-1">
            Автоскролл с подсветкой активной строки
          </p>
        </div>
      </div>

      {/* Панель управления */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={togglePlayPause}
                variant={isPlaying ? "secondary" : "default"}
                size="lg"
                className="flex items-center gap-2"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
                {isPlaying ? "Пауза" : "Играть"}
              </Button>

              <Button
                onClick={resetSong}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Icon name="RotateCcw" size={20} />
                Сначала
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Скорость:</span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    setScrollSpeed(Math.max(0.5, scrollSpeed - 0.5))
                  }
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Minus" size={16} />
                </Button>
                <span className="text-sm font-mono w-8 text-center">
                  {scrollSpeed}x
                </span>
                <Button
                  onClick={() => setScrollSpeed(Math.min(5, scrollSpeed + 0.5))}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Область с текстом песни */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div
          ref={scrollContainerRef}
          className="bg-white rounded-xl shadow-lg p-8 min-h-96"
        >
          <div className="space-y-1">
            {songLines.map((line, index) => (
              <div key={index} className={getLineClassName(index, line.type)}>
                {line.text}
              </div>
            ))}
          </div>
        </div>

        {/* Индикатор прогресса */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Строка {currentLine + 1} из {songLines.length}
            </span>
            <span>{Math.round((currentLine / songLines.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentLine / songLines.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
