import { useEffect, useState } from "react";
import api from "../api/api";

import {
    DragDropContext,
    Droppable,
    Draggable
}
from "@hello-pangea/dnd";

function KanbanBoard() {

    const [board, setBoard] =
        useState(null);
        const loadBoard = () => {

    api.get("/resume/kanban")
        .then((response) => {

            setBoard(
                response.data
            );

        })
        .catch((error) => {

            console.log(error);

        });
};

    useEffect(() => {

       loadBoard();

    }, []);

    if (!board) {

        return <h2>Loading...</h2>;
    }

    const Column = ({
    title,
    resumes,
    status
}) => (

    <Droppable
        droppableId={status}
    >

        {(provided) => (

            <div

                ref={
                    provided.innerRef
                }

                {...provided.droppableProps}

                style={{
                    width: "250px",
                    minHeight: "500px",
                    background: "#f4f4f4",
                    padding: "15px",
                    borderRadius: "10px"
                }}
            >

                <h2>
                    {title}
                </h2>

                {

                    resumes.map(
                        (
                            resume,
                            index
                        ) => (

                            <Draggable

                                key={
                                    resume.id
                                }

                                draggableId={
                                    String(
                                        resume.id
                                    )
                                }

                                index={
                                    index
                                }
                            >

                                {(provided) => (

                                    <div

                                        ref={
                                            provided.innerRef
                                        }

                                        {...provided.draggableProps}

                                        {...provided.dragHandleProps}

                                        style={{
                                            background:
                                                "white",

                                            padding:
                                                "10px",

                                            marginBottom:
                                                "10px",

                                            borderRadius:
                                                "8px",

                                            boxShadow:
                                                "0px 2px 5px rgba(0,0,0,0.1)",

                                            ...provided
                                                .draggableProps
                                                .style
                                        }}
                                    >

                                        <h4>
                                            {
                                                resume.fileName
                                            }
                                        </h4>

                                        <p>
                                            ATS:
                                            {
                                                resume.atsScore
                                            }
                                        </p>

                                    </div>

                                )}

                            </Draggable>

                        )

                    )

                }

                {
                    provided.placeholder
                }

            </div>

        )}

    </Droppable>

);
    const onDragEnd = (result) => {

    if (!result.destination) {

        return;
    }

    const resumeId =
        result.draggableId;

    const destinationStatus =
        result.destination.droppableId;

    api.put(

        `/resume/status/${resumeId}`,

        {
            status:
                destinationStatus
        }

    )
    .then(() => {

        loadBoard();

    })
    .catch((error) => {

        console.log(error);

    });
};

  return (

<DragDropContext onDragEnd={onDragEnd}>

    <div
        style={{
            padding: "20px"
        }}
    >

        <h1>
            Recruitment Kanban Board
        </h1>

        <div
            style={{
                display: "flex",
                gap: "20px",
                overflowX: "auto"
            }}
        >

            <Column
                title="Applied"
                resumes={board.applied}
                status="APPLIED"
            />

            <Column
                title="Shortlisted"
                resumes={board.shortlisted}
                status="SHORTLISTED"
            />

            <Column
                title="Interview"
                resumes={board.interview}
                status="INTERVIEW"
            />

            <Column
                title="Selected"
                resumes={board.selected}
                status="SELECTED"
            />

            <Column
                title="Rejected"
                resumes={board.rejected}
                status="REJECTED"
            />

        </div>

    </div>

</DragDropContext>

);
}

export default KanbanBoard;