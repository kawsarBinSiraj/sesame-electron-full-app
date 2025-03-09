const QuizCardComp = ({ quiz }) => {
    if (!quiz?.id) return null;
    const data = JSON.parse(quiz?.quiz);

    return (
        <div className="quiz-component-card p-3 rounded border">
            <p className="quiz-name d-flex gap-3 fw-600 mb-2">
                <span className="quiz-name flex-grow-1">
                    {data?.index + 1}. {data?.question}
                </span>
                <span className="quiz-point rounded px-3 py-1 fw-500">{data?.point}/1 point</span>
            </p>
            <div className="quiz-options">
                {data?.options?.map((opt: any, i: number) => {
                    const isAnswered = data?.answer;
                    const isSelected = isAnswered && data?.answer === opt;
                    const isCorrect = isAnswered && data?.correct_answer === opt;
                    const isUserCorrect = isAnswered && isSelected && isCorrect;
                    const isUserWrong = isAnswered && isSelected && !isCorrect;

                    return (
                        <div key={i} className="form-check d-flex align-items-center gap-2">
                            <input
                                disabled
                                defaultChecked={isSelected}
                                className={`form-check-input disabled me-1 opacity-100 ${isSelected ? (isUserCorrect ? "bg-theme-1" : "bg-danger border-danger") : ""}`}
                                value={opt}
                                type="radio"
                                name={`quiz-${data?.id}`}
                                id={`quiz-${data?.id}-opt-${i}`}
                                style={{ marginBottom: 1 }}
                            />
                            <label
                                style={{ top: 1 }}
                                className={`form-check-label disabled position-relative opacity-100 text-${isUserCorrect ? "theme-1" : isUserWrong ? "danger" : isCorrect ? "theme-1" : "dark"}`}
                                htmlFor={`quiz-${data?.id}-opt-${i}`}
                            >
                                {["a", "b", "c", "d"][i]}. {opt}
                                <span className="d-inline-block ms-2">{isSelected ? renderCheckOrCross(isUserCorrect) : isCorrect && renderCheckOrCross(true)}</span>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const renderCheckOrCross = (isCorrect: boolean) =>
    isCorrect ? (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.46052 9C4.08907 8.99667 3.73292 8.85021 3.46492 8.59059L0.404396 5.48279C0.145449 5.22109 0 4.86635 0 4.49648C0 4.12661 0.145449 3.77187 0.404396 3.51017C0.669086 3.25207 1.02274 3.1078 1.39077 3.1078C1.75881 3.1078 2.11246 3.25207 2.37715 3.51017L4.46052 5.63166L9.62285 0.402372C9.88754 0.144265 10.2412 0 10.6092 0C10.9773 0 11.3309 0.144265 11.5956 0.402372C11.8546 0.66407 12 1.01881 12 1.38868C12 1.75855 11.8546 2.11329 11.5956 2.37499L5.43767 8.59059C5.17638 8.84905 4.82633 8.99571 4.46052 9Z"
                fill="#00B140"
            />
        </svg>
    ) : (
        <svg width="12" height="12" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1.16843 12.1771C0.866237 12.1947 0.569039 12.0942 0.339509 11.8969C-0.11317 11.4415 -0.11317 10.7061 0.339509 10.2507L10.2517 0.338481C10.7225 -0.102086 11.4613 -0.0775955 11.9019 0.39323C12.3003 0.818995 12.3235 1.47341 11.9562 1.92632L1.98567 11.8969C1.7591 12.0914 1.46667 12.1916 1.16843 12.1771Z"
                fill="#FF0000"
            />
            <path
                d="M11.0708 12.1778C10.7645 12.1764 10.471 12.0549 10.2535 11.8392L0.341281 1.92694C-0.0781018 1.4372 -0.0210845 0.700164 0.468657 0.280742C0.905764 -0.0935807 1.55041 -0.0935807 1.98748 0.280742L11.9581 10.193C12.4288 10.6336 12.4531 11.3725 12.0124 11.8432C11.9949 11.8619 11.9768 11.88 11.9581 11.8976C11.7139 12.1099 11.3926 12.2113 11.0708 12.1778Z"
                fill="#FF0000"
            />
        </svg>
    );

export default QuizCardComp;
