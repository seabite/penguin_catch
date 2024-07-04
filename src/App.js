import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsDown } from 'lucide-react';

// ゲームパラメータ
const GAME_CONFIG = {
  width: 390,
  height: 844,
  penguinSpeed: 0.1, // ペンギンの移動速度 (0-1の値、大きいほど速い)
  penguinMoveInterval: 3000, // ペンギンが新しい位置に移動する間隔 (ミリ秒)
  catchThreshold: 10, // キャッチ成功と判定される距離
};

const PenguinCatcherGame = () => {
  const [chopstickPosition, setChopstickPosition] = useState(50);
  const [penguinPosition, setPenguinPosition] = useState(50);
  const [targetPenguinPosition, setTargetPenguinPosition] = useState(50);
  const [score, setScore] = useState(0);
  const [isDropping, setIsDropping] = useState(false);
  const [showCaughtEffect, setShowCaughtEffect] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);

  // ペンギンの新しい位置を設定
  const movePenguin = useCallback(() => {
    setTargetPenguinPosition(Math.random() * 100);
  }, []);

  // ペンギンの動きを制御
  useEffect(() => {
    const penguinInterval = setInterval(movePenguin, GAME_CONFIG.penguinMoveInterval);
    return () => clearInterval(penguinInterval);
  }, [movePenguin]);

  // ペンギンの滑らかな移動を実現
  useEffect(() => {
    const smoothMove = setInterval(() => {
      setPenguinPosition((prev) => {
        if (Math.abs(prev - targetPenguinPosition) < 0.1) return targetPenguinPosition;
        return prev + (targetPenguinPosition - prev) * GAME_CONFIG.penguinSpeed;
      });
    }, 16); // 約60FPS
    return () => clearInterval(smoothMove);
  }, [targetPenguinPosition]);

  // 箸の移動
  const moveChopstick = (direction) => {
    setChopstickPosition((prev) => {
      if (direction === 'left' && prev > 0) return Math.max(0, prev - 5);
      if (direction === 'right' && prev < 100) return Math.min(100, prev + 5);
      return prev;
    });
  };

  // 箸を落として、ペンギンをキャッチする
  const dropChopstick = () => {
    setIsDropping(true);
    setTimeout(() => {
      if (Math.abs(chopstickPosition - penguinPosition) < GAME_CONFIG.catchThreshold) {
        setScore((prev) => prev + 1);
        setShowCaughtEffect(true);
        setTimeout(() => setShowCaughtEffect(false), 1000); // エフェクトを1秒間表示
      }
      setIsDropping(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div 
        className="relative overflow-hidden"
        style={{
          width: `${GAME_CONFIG.width}px`,
          height: `${GAME_CONFIG.height}px`,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor: backgroundImage ? 'transparent' : 'lightblue',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-3xl font-bold mb-4 text-center">ペンギンキャッチャー</h1>
        
        {/* ゲーム画面 */}
        <div className="relative w-full h-3/4 border-2 border-gray-300 rounded-lg overflow-hidden">
          {/* 箸 */}
          <div
            style={{
              left: `${chopstickPosition}%`,
              top: isDropping ? '80%' : '0',
              transition: 'top 0.5s ease-in-out'
            }}
            className="absolute text-4xl"
          >
            🥢
          </div>
          
          {/* ペンギン */}
          {!showCaughtEffect && (
            <div
              style={{ left: `${penguinPosition}%` }}
              className="absolute bottom-4 text-4xl transition-all duration-300 ease-in-out"
            >
              🐧
            </div>
          )}
          
          {/* キャッチ時のエフェクト */}
          {showCaughtEffect && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-ping">💥</div>
            </div>
          )}
        </div>
        
        {/* コントロールボタン */}
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => moveChopstick('left')}
            className="p-2 bg-blue-500 text-white rounded-full"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={dropChopstick}
            disabled={isDropping}
            className="p-2 bg-green-500 text-white rounded-full disabled:bg-gray-400"
          >
            <ChevronsDown />
          </button>
          <button
            onClick={() => moveChopstick('right')}
            className="p-2 bg-blue-500 text-white rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
        {/* スコア表示 */}
        <p className="mt-4 text-xl font-bold text-center">スコア: {score}</p>
      </div>
    </div>
  );
};

export default PenguinCatcherGame;
