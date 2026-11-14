"use client";

import { cs } from "@/lib/classStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import "@/app/globals.css";

import Btn from "@/components/ui/btn";
import { FaExclamationTriangle } from "react-icons/fa";

export default function QuizBody({ existing }: { existing?: object[] }) {
  const classes = cs((state) => state.classes);
  const setQuizzes = cs((state) => state.setQuizzes);
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    setError(null);
    const res = await fetch(
      `/api/classes/${classes[settingsClassIndex].id}/quizzes`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classes[settingsClassIndex].quizzes),
      },
    );
    if (res.ok) {
      toast.success(`Quizzes saved successfully!`);
      router.refresh();
    } else {
      setError("Failed to save quizzes. Please try again.");
    }
  }

  useEffect(() => {
    if (existing) {
      setQuizzes(
        existing.map((quiz: any) => ({
          id: quiz.id,
          name: quiz.name,
          questions: quiz.questions.map((q) => ({ ...q, canShow: true })),
          canShow: true,
        })),
        0,
      );
    }
  }, [existing, setQuizzes]);

  return (
    <div
      className="flex justify-center items-center  flex-col flex-wrap"
      onClick={() => setQuizPopup(false)}
    >
      <div className="w-full">
        <Btn onclick={() => addClassQuiz(settingsClassIndex)} text="Add Quiz" />
        {classes[settingsClassIndex]?.quizzes.length == 0 && (
          <div className="w-full text-center py-5 text-sm text-zinc-700 dark:text-zinc-300">
            No Quizzes currently. Create one by pressing the button here!
          </div>
        )}
        <div className="flex py-5 flex-col gap-y-3">
          {classes[settingsClassIndex]?.quizzes.map((quizItem, quizIndex) => (
            <div key={quizIndex} className="border-1 border-zinc-800 p-2">
              <div className="flex w-full justify-between">
                <div className="flex">
                  <div className="gap-[10px] flex flex-col">
                    <div className="flex items-center gap-[10px]">
                      {quizIndex}
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
                        className="w-full resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans "
                      ></input>
                      {quizItem.questions.length} Questions
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
                          quizItem.canShow ? "Hide Questions" : "Show Questions"
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
              {error && (
                <div className="text-red-500 text-sm flex gap-x-3 items-center px-4 pt-1 pb-3">
                  <FaExclamationTriangle size={15} /> {error}
                </div>
              )}
              {quizItem.canShow && (
                <div className="h-full w-full gap-y-[100px] p-[10px]">
                  {quizItem.questions.map((questionItem, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="flex flex-col mb-[20px] bg-zinc-200 dark:bg-zinc-900 p-[10px] rounded-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex item-center justify-center gap-[10px] mb-3">
                          <b>Question {questionIndex}:</b>{" "}
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
                            className="resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans "
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
                        <>
                          Choices:{" "}
                          {questionItem.choices.length == 0
                            ? "Make choices for this question!"
                            : ""}
                        </>
                      )}
                      {questionItem.canShow &&
                        questionItem.choices.map((choiceItem, choiceIndex) => (
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
                                className={`border-1 border-${isCorrectAnswer(choiceIndex, questionItem.choices, questionItem.answers) ? "green" : "gray"}-500`}
                              ></input>
                              <Btn
                                onclick={() => {
                                  questionItem.answers =
                                    questionItem.answers.includes(choiceItem)
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
                              }}
                              text="Delete Choice"
                            />
                          </div>
                        ))}
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
  );
}
