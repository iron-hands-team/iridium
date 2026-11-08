"use client";

import { cs } from "@/lib/classStore";
import "@/app/globals.css";

import Btn from "@/components/ui/btn";

export default function QuizBody() {
  const classes = cs((state) => state.classes);
  const setQuizPopup = cs((state) => state.setQuizPopup);
  const addClassQuiz = cs((state) => state.addClassQuiz);
  const deleteClassQuiz = cs((state) => state.deleteClassQuiz);
  const setClassQuiz = cs((state) => state.setClassQuiz);
  const addQuizQuestion = cs((state) => state.addQuizQuestion);
  const deleteQuizQuestion = cs((state) => state.deleteQuizQuestion);
  const setQuizQuestion = cs((state) => state.setQuizQuestion);
  const addQuizChoice = cs((state) => state.addQuizChoice);
  const deleteQuizChoice = cs((state) => state.deleteQuizChoice);
  const setQuizChoice = cs((state) => state.setQuizChoice);
  const addQuizAnswer = cs((state) => state.addQuizAnswer);
  const deleteQuizAnswer = cs((state) => state.deleteQuizAnswer);
  const settingsClassIndex = cs((state) => state.settingsClassIndex);

  function isCorrectAnswer(
    choiceIndex: number,
    choices: string[],
    answers: string[],
  ) {
    for (let i = 0; i < answers.length; i++) {
      if (choices[choiceIndex] == answers[i]) return true;
    }
    return false;
  }

  async function handleSave() {
    console.log(classes);
    //TODO: post/save to db
  }

  return (
    <div
      className="fixed flex h-full w-full justify-center items-center overflow-y-auto  flex-col flex-wrap"
      onClick={() => setQuizPopup(false)}
    >
      <div
        className=" z-10 overflow-y-auto w-2/3  flex justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" h-[700px] w-3/4 bg-blue">
          <div className="flex justify-between items-center">
            <p className="text-[30px] pb-5">
              <b>{classes[settingsClassIndex].className || ""}&apos;s</b>{" "}
              Quizzes
            </p>
          </div>
          <Btn
            onclick={() => addClassQuiz(settingsClassIndex)}
            text="Add Quiz"
          />
          {classes[settingsClassIndex]?.quizzes.length == 0 && (
            <div className="w-full text-center py-5 text-sm text-zinc-700 dark:text-zinc-300">
              No Quizzes currently. Create one by pressing the button here!
            </div>
          )}
          <div className="flex py-5 flex-col gap-y-3">
            {classes[settingsClassIndex]?.quizzes.map((quizItem, quizIndex) => (
              <div key={quizIndex} className="border-1 border-zinc-800 p-2">
                <div className="flex w-full h-full bg-grey-50 justify-between">
                  <div className="flex">
                    <div className="gap-[10px] flex flex-col">
                      <div className="flex items-center gap-[10px]">
                        <p>{quizIndex}</p>
                        <input
                          value={quizItem.name}
                          onChange={(e) =>
                            setClassQuiz(
                              settingsClassIndex,
                              quizIndex,
                              e.target.value,
                              "name",
                            )
                          }
                          placeholder="Enter Name Here"
                          className="text-white w-full resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans "
                        ></input>
                        <p className="w-[200px]">
                          {quizItem.questions.length} Questions
                        </p>
                      </div>

                      <div className="flex items-center gap-x-[10px]">
                        <Btn
                          onclick={() =>
                            setClassQuiz(
                              settingsClassIndex,
                              quizIndex,
                              !quizItem.canShow,
                              "canShow",
                            )
                          }
                          text={
                            quizItem.canShow
                              ? "Hide Questions"
                              : "Show Questions"
                          }
                        />
                        <Btn
                          onclick={() => {
                            addQuizQuestion(settingsClassIndex, quizIndex);
                            setClassQuiz(
                              settingsClassIndex,
                              quizIndex,
                              true,
                              "canShow",
                            );
                          }}
                          text="Add Question"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h-2/3">
                    <Btn
                      onclick={() =>
                        deleteClassQuiz(settingsClassIndex, quizIndex)
                      }
                      text="Delete Quiz"
                    />
                  </div>
                </div>
                <br></br>

                {quizItem.canShow && (
                  <div className="h-full w-full gap-y-[100px] p-[10px]">
                    {quizItem.questions.map((questionItem, questionIndex) => (
                      <div
                        key={questionIndex}
                        className="flex flex-col mb-[20px] bg-zinc-900 p-[10px] rounded-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex item-center justify-center gap-[10px] mb-3">
                            <p className="flex items-center">
                              <b>Question {questionIndex}:</b>{" "}
                            </p>
                            <input
                              value={questionItem.question}
                              onChange={(e) =>
                                setQuizQuestion(
                                  settingsClassIndex,
                                  quizIndex,
                                  questionIndex,
                                  e.target.value,
                                  "question",
                                )
                              }
                              className="text-white  resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans "
                              placeholder="Enter Question Name"
                            ></input>
                          </div>
                          <Btn
                            onclick={() =>
                              deleteQuizQuestion(
                                settingsClassIndex,
                                quizIndex,
                                questionIndex,
                              )
                            }
                            text="Delete Question"
                          />
                        </div>
                        <div className="flex gap-x-3">
                          <Btn
                            onclick={() => {
                              questionItem.choices = addQuizChoice(
                                questionItem.choices,
                                "",
                              );
                              questionItem.canShow = true;
                              setQuizQuestion(
                                settingsClassIndex,
                                quizIndex,
                                questionIndex,
                                questionItem.question,
                                "question",
                              );
                            }}
                            text="Add choice"
                          />
                          <Btn
                            onclick={() =>
                              setQuizQuestion(
                                settingsClassIndex,
                                quizIndex,
                                questionIndex,
                                !questionItem.canShow,
                                "canShow",
                              )
                            }
                            text={
                              questionItem.canShow
                                ? "Hide Choices"
                                : "Show Choices"
                            }
                          />
                        </div>
                        {questionItem.canShow && (
                          <p>
                            Choices:{" "}
                            {questionItem.choices.length == 0
                              ? "Make choices for this question!"
                              : ""}
                          </p>
                        )}
                        {questionItem.canShow &&
                          questionItem.choices.map(
                            (choiceItem, choiceIndex) => (
                              <div
                                key={choiceIndex}
                                className="flex justify-between"
                              >
                                <div className="flex gap-[10px]">
                                  <input
                                    value={choiceItem}
                                    onChange={(e) => {
                                      questionItem.choices = setQuizChoice(
                                        questionItem.choices,
                                        choiceIndex,
                                        e.target.value,
                                      );
                                      setQuizQuestion(
                                        settingsClassIndex,
                                        quizIndex,
                                        questionIndex,
                                        questionItem.question,
                                        "question",
                                      );
                                    }}
                                    className={`text-white border-1 border-${isCorrectAnswer(choiceIndex, questionItem.choices, questionItem.answers) ? "green" : "gray"}-500`}
                                  ></input>
                                  <Btn
                                    onclick={() => {
                                      questionItem.answers =
                                        questionItem.answers.includes(
                                          choiceItem,
                                        )
                                          ? deleteQuizAnswer(
                                              questionItem.answers,
                                              questionItem.answers.indexOf(
                                                choiceItem,
                                              ),
                                            )
                                          : addQuizAnswer(
                                              questionItem.answers,
                                              choiceItem,
                                            );

                                      setQuizQuestion(
                                        settingsClassIndex,
                                        quizIndex,
                                        questionIndex,
                                        questionItem.question,
                                        "question",
                                      );
                                      console.log(questionItem.answers);
                                    }}
                                    text={
                                      questionItem.answers.includes(choiceItem)
                                        ? "Set As Choice"
                                        : "Set As Answer"
                                    }
                                  />
                                </div>
                                <Btn
                                  onclick={() => {
                                    questionItem.choices = deleteQuizChoice(
                                      questionItem.choices,
                                      choiceIndex,
                                    );
                                    setQuizQuestion(
                                      settingsClassIndex,
                                      quizIndex,
                                      questionIndex,
                                      questionItem.question,
                                      "question",
                                    );
                                    console.log(questionItem.answers);
                                  }}
                                  text="Delete Choice"
                                />
                              </div>
                            ),
                          )}
                        <br></br>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <Btn text="Save" onclick={handleSave} primary />
        </div>
      </div>
    </div>
  );
}
