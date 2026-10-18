import { useEffect, useState } from "react";

function ContestRound() {
  const questions = [
    {
      id: 1,
      question: "Which data structure follows the FIFO principle?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: "Queue",
    },
    {
      id: 2,
      question: "Which language is mainly used with React?",
      options: ["Java", "JavaScript", "Python", "C++"],
      answer: "JavaScript",
    },
    {
      id: 3,
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Program Internet",
        "Application Process Integration",
        "Automated Programming Input",
      ],
      answer: "Application Programming Interface",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const answeredCount = Object.keys(answers).length;

  const handleAnswerChange = (questionId, selectedOption) => {
    if (submitted) return;

    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  };

  const handleSubmit = () => {
    if (submitted) return;

    let totalScore = 0;

    questions.forEach((question) => {
      if (answers[question.id] === question.answer) {
        totalScore++;
      }
    });

    setScore(totalScore);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const restartContest = () => {
    setAnswers({});
    setScore(0);
    setSubmitted(false);
    setTimeLeft(60);
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Contest Round</h1>
        <p>
          Test your technical knowledge and track your performance.
        </p>
      </div>

      {!submitted ? (
        <>
          <div className="contest-info-grid">
            <div className="contest-info-card">
              <span>Time Remaining</span>
              <strong>{timeLeft}s</strong>
            </div>

            <div className="contest-info-card">
              <span>Questions Answered</span>
              <strong>
                {answeredCount} / {questions.length}
              </strong>
            </div>
          </div>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${
                  (answeredCount / questions.length) * 100
                }%`,
              }}
            />
          </div>

          <div className="contest-questions">
            {questions.map((question) => (
              <div className="content-card question-card" key={question.id}>
                <div className="question-number">
                  Question {question.id}
                </div>

                <h2>{question.question}</h2>

                <div className="options-list">
                  {question.options.map((option) => (
                    <label
                      key={option}
                      className={
                        answers[question.id] === option
                          ? "option-item selected-option"
                          : "option-item"
                      }
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() =>
                          handleAnswerChange(question.id, option)
                        }
                      />

                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className="primary-button contest-submit-button"
            onClick={handleSubmit}
          >
            Submit Contest
          </button>
        </>
      ) : (
        <div className="content-card contest-result">
          <div className="result-icon">
            {score === questions.length ? "🏆" : "🎉"}
          </div>

          <h1>Contest Completed!</h1>

          <p>Your final score</p>

          <div className="score-display">
            {score} / {questions.length}
          </div>

          <p className="result-message">
            {score === questions.length
              ? "Excellent! You achieved a perfect score."
              : score >= 2
              ? "Great job! You performed well in the contest."
              : "Good attempt! Keep practicing and improve your score."}
          </p>

          <button
            className="primary-button"
            onClick={restartContest}
          >
            Restart Contest
          </button>
        </div>
      )}
    </div>
  );
}

export default ContestRound;