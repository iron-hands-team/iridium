"use client";

import { createContext, useContext, useState } from "react";

export interface Class {
	id: number;
	className: string;
	students: Test[];
	color: string;
	canShow: boolean;
	assignments: Assignment[];
}

export interface Test {
	id: number;
	name: string;
	text: string;
	assignments: Assignment[];
}

export interface Assignment {
	id: number;
	name: string;
	text: string;
	link: string;
}

type AppContextType = {
	classes: Class[];
	setClasses: React.Dispatch<React.SetStateAction<Class[]>>;

	asd: string;
	setAsd: React.Dispatch<React.SetStateAction<string>>;

	settingsPopup: boolean;
	setSettingsPopup: React.Dispatch<React.SetStateAction<boolean>>;

	settingsClassIndex: number;
	setSettingsClassIndex: React.Dispatch<React.SetStateAction<number>>;

	studentsPopup: boolean;
	setStudentsPopup: React.Dispatch<React.SetStateAction<boolean>>;

	settingsStudentsIndex: number;
	setSettingsStudentsIndex: React.Dispatch<React.SetStateAction<number>>;

	assignmentsPopup: boolean;
	setAssignmentsPopup: React.Dispatch<React.SetStateAction<boolean>>;

	textAreaAssignment: string;
	setTextAreaAssignment: React.Dispatch<React.SetStateAction<string>>;

	untitledCount: number;
	setUntitledCount: React.Dispatch<React.SetStateAction<number>>;

	updateCanShowStudents: (index: number, canShow: boolean) => void;
	updateName: (index: number, text: string) => void;
	deleteTest: (index: number) => void;
	addClass: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [classes, setClasses] = useState<Class[]>([]);
	const [asd, setAsd] = useState("");

	const [settingsPopup, setSettingsPopup] = useState(false);
	const [settingsClassIndex, setSettingsClassIndex] = useState(-1);

	const [studentsPopup, setStudentsPopup] = useState(false);
	const [settingsStudentsIndex, setSettingsStudentsIndex] = useState(-1);

	const [assignmentsPopup, setAssignmentsPopup] = useState(false);
	const [textAreaAssignment, setTextAreaAssignment] = useState("");
	const [untitledCount, setUntitledCount] = useState(0);

	function updateCanShowStudents(index: number, canShow: boolean) {
		setClasses(prev =>
			prev.map((item, i) =>
				i === index
					? { ...item, canShow }
					: item
			)
		);
	}

	function updateName(index: number, text: string) {
		setClasses(prev =>
			prev.map((item, i) =>
				i === index
					? { ...item, className: text }
					: item
			)
		);
	}

	function deleteTest(index: number) {
		setClasses(prev =>
			prev.filter((_, i) => i !== index)
		);
	}

	function addClass() {
		setClasses(prev => [
			...prev,
			{
				id: prev.length,
				className: "Untitled",
				students: [],
				color: "border-zinc-500",
				canShow: false,
				assignments: []
			}
		]);
	}

	return (
		<AppContext.Provider
			value={{
				classes,
				setClasses,

				asd,
				setAsd,

				settingsPopup,
				setSettingsPopup,

				settingsClassIndex,
				setSettingsClassIndex,

				studentsPopup,
				setStudentsPopup,

				settingsStudentsIndex,
				setSettingsStudentsIndex,

				assignmentsPopup,
				setAssignmentsPopup,

				textAreaAssignment,
				setTextAreaAssignment,

				untitledCount,
				setUntitledCount,

				updateCanShowStudents,
				updateName,
				deleteTest,
				addClass
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useApp() {
	const context = useContext(AppContext);

	if (!context) {
		throw new Error("useApp must be used inside AppProvider");
	}

	return context;
}