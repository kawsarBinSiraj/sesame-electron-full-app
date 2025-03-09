const QuizCardComp = ({ data, callback }) => {
    if (!data?.id) return;
    return (
        <div className="quiz-component-card p-3 rounded border">
            <p className="quiz-name d-flex gap-3 fw-600 mb-2">
                <span className="quiz-name flex-grow-1">
                    {data?.index + 1}. {data?.question}
                </span>
                <span className="quiz-point rounded px-3 py-1 fw-normal">{data?.point} point</span>
            </p>
            <div className="quiz-options">
                {data?.options?.map((opt: any, i: number) => {
                    return (
                        <div key={i} className="form-check-wrapper">
                            <label style={{ cursor: "pointer" }} className="form-check d-inline-flex align-items-center gap-2" htmlFor={`quiz-${data?.id}-opt-${i}`}>
                                <input
                                    className="form-check-input me-1"
                                    onChange={({ target: { value } }) => {
                                        if (callback) callback(data, value);
                                    }}
                                    value={opt}
                                    type="radio"
                                    name={`quiz-${data?.id}`}
                                    id={`quiz-${data?.id}-opt-${i}`}
                                />
                                <span style={{ top: 1 }} className="form-check-label text-secondary position-relative">
                                    {i == 0 && "a"} {i == 1 && "b"} {i == 2 && "c"} {i == 3 && "d"}. {opt}
                                </span>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizCardComp;
