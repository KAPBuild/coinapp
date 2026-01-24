import { useState, useEffect } from 'react'
import { X, Trophy, Target, RotateCcw } from 'lucide-react'

interface GradeGuessingGameProps {
  isOpen: boolean
  onClose: () => void
}

interface Question {
  description: string
  coinType: string
  correctGrade: string
  options: string[]
  hint: string
}

// Questions about coin conditions and their grades
const QUESTIONS: Question[] = [
  {
    description: "This Morgan Dollar shows heavy wear with the design visible but flat. LIBERTY on the headband is completely worn away. The eagle's feathers are smooth with no detail.",
    coinType: "Morgan Dollar",
    correctGrade: "G-4",
    options: ["AG-3", "G-4", "VG-8", "F-12"],
    hint: "Design visible but flat, major details worn"
  },
  {
    description: "This Walking Liberty Half has light wear on Liberty's head and hand. The skirt lines are complete and sharp. About half of the mint luster remains.",
    coinType: "Walking Liberty Half",
    correctGrade: "AU-50",
    options: ["EF-45", "AU-50", "AU-58", "MS-60"],
    hint: "Trace wear on high points, half luster remaining"
  },
  {
    description: "This Mercury Dime shows no wear whatsoever. Strong luster with only a few light contact marks. Well struck with excellent eye appeal.",
    coinType: "Mercury Dime",
    correctGrade: "MS-65",
    options: ["MS-63", "MS-64", "MS-65", "MS-66"],
    hint: "No wear, strong luster, light marks, excellent appeal"
  },
  {
    description: "This Peace Dollar has moderate wear on the high points. All lettering is visible. The hair above Liberty's ear shows flatness but major strands are visible.",
    coinType: "Peace Dollar",
    correctGrade: "F-12",
    options: ["VG-10", "F-12", "VF-20", "VF-30"],
    hint: "Moderate wear, all lettering visible"
  },
  {
    description: "This Buffalo Nickel is barely identifiable. The date is completely worn away. Only the outline of the buffalo and Indian are visible.",
    coinType: "Buffalo Nickel",
    correctGrade: "AG-3",
    options: ["P-1", "FR-2", "AG-3", "G-4"],
    hint: "Very heavily worn, outline visible"
  },
  {
    description: "This Standing Liberty Quarter has slight wear on Liberty's head and shield. Nearly full luster present with just a trace of wear on the highest points.",
    coinType: "Standing Liberty Quarter",
    correctGrade: "AU-58",
    options: ["AU-53", "AU-55", "AU-58", "MS-60"],
    hint: "Slight wear on highest points, nearly full luster"
  },
  {
    description: "This Lincoln Cent is perfectly struck with no marks visible under 5x magnification. Full red color with blazing luster. Absolutely flawless.",
    coinType: "Lincoln Cent",
    correctGrade: "MS-70",
    options: ["MS-67", "MS-68", "MS-69", "MS-70"],
    hint: "Perfect coin, no marks under magnification"
  },
  {
    description: "This Barber Dime shows well-worn surfaces but the main features are clear. The word LIBERTY on the headband shows at least 3 letters clearly.",
    coinType: "Barber Dime",
    correctGrade: "VG-8",
    options: ["G-6", "VG-8", "VG-10", "F-12"],
    hint: "Well worn, main features clear, partial LIBERTY"
  },
  {
    description: "This Franklin Half shows light wear on the high points only. Bell lines at the bottom of the Liberty Bell are complete and sharp.",
    coinType: "Franklin Half",
    correctGrade: "AU-55",
    options: ["EF-40", "EF-45", "AU-55", "AU-58"],
    hint: "Light wear on high points, full bell lines"
  },
  {
    description: "This Kennedy Half has mirror-like proof surfaces with minimal hairlines. Deep cameo contrast between the frosted devices and mirror fields.",
    coinType: "Kennedy Half (Proof)",
    correctGrade: "PF-67",
    options: ["PF-65", "PF-66", "PF-67", "PF-69"],
    hint: "Exceptional mirrors, minimal flaws, deep cameo"
  },
  {
    description: "This Washington Quarter shows light wear on the hair above the ear and on the eagle's breast. All details are sharp with traces of luster in protected areas.",
    coinType: "Washington Quarter",
    correctGrade: "EF-45",
    options: ["VF-35", "EF-40", "EF-45", "AU-50"],
    hint: "Light wear on high points, traces of luster"
  },
  {
    description: "This Indian Head Cent has no wear but numerous bagmarks and scratches. The luster is somewhat dull. Below average eye appeal for the grade.",
    coinType: "Indian Head Cent",
    correctGrade: "MS-60",
    options: ["AU-58", "MS-60", "MS-62", "MS-63"],
    hint: "No wear, but heavy marks and dull luster"
  },
]

export function GradeGuessingGame({ isOpen, onClose }: GradeGuessingGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)

  // Get a random question
  const getNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * QUESTIONS.length)
    setCurrentQuestion(QUESTIONS[randomIndex])
    setSelectedAnswer(null)
    setShowResult(false)
    setShowHint(false)
  }

  // Initialize game
  useEffect(() => {
    if (isOpen && !currentQuestion) {
      getNewQuestion()
    }
  }, [isOpen])

  const handleAnswer = (answer: string) => {
    if (showResult) return

    setSelectedAnswer(answer)
    setShowResult(true)
    setQuestionsAnswered(prev => prev + 1)

    if (answer === currentQuestion?.correctGrade) {
      setScore(prev => prev + 1)
      setStreak(prev => {
        const newStreak = prev + 1
        if (newStreak > bestStreak) {
          setBestStreak(newStreak)
        }
        return newStreak
      })
    } else {
      setStreak(0)
    }
  }

  const handleNextQuestion = () => {
    getNewQuestion()
  }

  const resetGame = () => {
    setScore(0)
    setQuestionsAnswered(0)
    setStreak(0)
    getNewQuestion()
  }

  if (!isOpen) return null

  const accuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Guess the Grade</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white transition-colors"
              aria-label="Close game"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50 border-b border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{score}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{questionsAnswered}</p>
              <p className="text-xs text-gray-500">Answered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{streak}</p>
              <p className="text-xs text-gray-500">Streak</p>
            </div>
          </div>

          {/* Game Content */}
          <div className="p-6">
            {currentQuestion && (
              <>
                {/* Coin Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {currentQuestion.coinType}
                  </span>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    <strong>Hint:</strong> {currentQuestion.hint}
                  </div>
                )}

                {/* Question */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {currentQuestion.description}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {currentQuestion.options.map((option) => {
                    let buttonClass = "py-3 px-4 rounded-lg font-semibold transition-all border-2 "

                    if (showResult) {
                      if (option === currentQuestion.correctGrade) {
                        buttonClass += "bg-green-100 border-green-500 text-green-700"
                      } else if (option === selectedAnswer) {
                        buttonClass += "bg-red-100 border-red-500 text-red-700"
                      } else {
                        buttonClass += "bg-gray-100 border-gray-200 text-gray-400"
                      }
                    } else {
                      buttonClass += "bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={showResult}
                        className={buttonClass}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>

                {/* Result Message */}
                {showResult && (
                  <div className={`mb-6 p-4 rounded-lg text-center ${
                    selectedAnswer === currentQuestion.correctGrade
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {selectedAnswer === currentQuestion.correctGrade ? (
                      <div>
                        <p className="text-lg font-bold text-green-700 mb-1">Correct!</p>
                        <p className="text-sm text-green-600">
                          {streak > 1 && `${streak} in a row!`}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-bold text-red-700 mb-1">Not quite!</p>
                        <p className="text-sm text-red-600">
                          The correct grade is <strong>{currentQuestion.correctGrade}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {showResult && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Next Question
                    </button>
                    <button
                      onClick={resetGame}
                      className="py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                      title="Reset Game"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Best streak: {bestStreak}
              </span>
              <span>Test your grading knowledge!</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
