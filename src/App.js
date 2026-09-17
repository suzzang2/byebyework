import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

const NUM_IMAGES = 10; // 이미지 개수

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const audioRef = useRef(null);

  // 10개 이미지의 DOM ref 배열
  const imgRefs = useRef([]);
  // 10개 이미지의 위치 및 속도 데이터
  const itemsRef = useRef([]);

  useEffect(() => {
    // 제출 완료(isSubmitted === true) 상태가 아니면 애니메이션을 실행하지 않음
    if (!isSubmitted) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 10개 이미지 각각의 초기 위치와 속도(방향) 설정
    itemsRef.current = Array.from({ length: NUM_IMAGES }, () => ({
      x: Math.random() * (screenWidth - 120),
      y: Math.random() * (screenHeight - 120),
      dx: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 2),
      dy: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 2),
    }));

    let animationFrameId;

    const moveImages = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      itemsRef.current.forEach((item, index) => {
        const imgEl = imgRefs.current[index];
        if (!imgEl) return;

        const imgWidth = imgEl.clientWidth || 100;
        const imgHeight = imgEl.clientHeight || 100;

        // 벽 충돌 검사
        if (item.x + imgWidth >= currentWidth || item.x <= 0) {
          item.dx = -item.dx;
        }
        if (item.y + imgHeight >= currentHeight || item.y <= 0) {
          item.dy = -item.dy;
        }

        item.x += item.dx;
        item.y += item.dy;

        // 위치 적용
        imgEl.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
      });

      animationFrameId = requestAnimationFrame(moveImages);
    };

    animationFrameId = requestAnimationFrame(moveImages);

    const handleResize = () => {
      itemsRef.current.forEach((item) => {
        item.x = Math.min(item.x, window.innerWidth - 100);
        item.y = Math.min(item.y, window.innerHeight - 100);
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSubmitted]); // isSubmitted 상태 변화 감지

  const handleStartTest = (e) => {
    e.preventDefault();
    if (!name) return alert('이름을 입력해 주세요!');

    setIsSubmitted(true);

    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.log('오디오 재생 실패:', err));
    }

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      <audio ref={audioRef} src="/celebration.mp3" preload="auto" />

      {/* isSubmitted가 true일 때만 10개의 배경 이미지를 화면에 렌더링 */}
      {isSubmitted &&
        Array.from({ length: NUM_IMAGES }).map((_, i) => (
          <img
            key={i}
            ref={(el) => (imgRefs.current[i] = el)}
            src="/img/me.png"
            alt={`floating me ${i}`}
            className="fixed top-0 left-0 w-40 h-auto pointer-events-none z-0 transition-transform duration-75 ease-linear drop-shadow-md opacity-80"
          />
        ))}

      {!isSubmitted ? (
        <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
          <div className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full mb-3">
            2026 NEW TREND
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            직장인 신규 MBTI 성격 검사
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            현재 나의 업무 스트레스 지수와 잠재적 커리어 성향을 정밀하게 분석합니다.
          </p>

          <form onSubmit={handleStartTest} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                이름 (Name)
              </label>
              <input
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                결과 받을 이메일 (Email)
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition duration-200 shadow-md mt-4 cursor-pointer"
            >
              검사 시작하기 (약 3분 소요)
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-6">
            🔒 수집된 개인정보는 성격 분석 외의 용도로 사용되지 않습니다.
          </p>
        </div>
      ) : (
        <div className="relative z-10 max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center border-4 border-yellow-300">
          <div className="text-6xl mb-4">🥳 🎉🍻</div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
            퇴사를 축하하노아
          </h1>
          <p className="text-lg text-teal-600 font-bold mb-6">
            {name} 님의 검사 결과는 <span className="text-xl underline">【백수】</span> 타입입니다!
          </p>

          <div className="bg-slate-50 p-4 rounded-xl mb-6 text-left space-y-2 border border-slate-200 text-sm">
            <p className="font-semibold text-slate-700">📊 {name} 님 분석:</p>
            <p className="text-slate-600">▪ 100</p>
            <p className="text-slate-600">▪ soo~ </p>
          </div>

          <p className="text-slate-700 leading-relaxed font-medium mb-6">
            그동안 고생 많았노아. 매일 열심히 일하느라 수고했노아. <br />
            노예 해방 된 것을 축하하노아~
          </p>

          <button
            onClick={() => confetti({ particleCount: 100, spread: 60 })}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-full transition shadow-md cursor-pointer"
          >
            🎊 축하 폭죽 오지게 터뜨리기 🎊
          </button>
        </div>
      )}
    </div>
  );
}