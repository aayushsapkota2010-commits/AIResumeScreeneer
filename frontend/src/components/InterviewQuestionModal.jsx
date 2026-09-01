function InterviewQuestionModal({

    isOpen,

    onClose,

    questions

}) {

    if (!isOpen) return null;

    return (

        <div className="interview-overlay">

            <div className="interview-modal">

                <h2>
                    🤖 AI Interview Questions
                </h2>

                <pre
                    style={{
                        whiteSpace: "pre-wrap",
                        maxHeight: "500px",
                        overflow: "auto"
                    }}
                >
                    {questions}
                </pre>

                <button onClick={onClose}>

                    Close

                </button>

            </div>

        </div>

    );

}

export default InterviewQuestionModal;