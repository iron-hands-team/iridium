"use client";

import {
  type ReportOptionType,
  type ReportType,
  reportOptions,
  reportSchema,
} from "@/lib/schemas";
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Dropdown from "@/components/ui/dropdown";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Checkbox from "@/components/ui/checkbox";
import Btn from "@/components/ui/btn";

const labelStyles =
  "text-black dark:text-zinc-300 text-sm flex flex-col gap-y-1 w-full";

function Report() {
  const [report, setReport] = useState<ReportType>({
    title: "",
    description: "",
    type: "Discrimination",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const validated = reportSchema.safeParse(report);
    if (validated.success) {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...validated.data }),
      });
      if (!res.ok) {
        setError("Something went wrong, please try again");
      }
      setLoading(false);
    } else {
      setError(validated.error.issues[0].message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-800 p-5 flex flex-col gap-y-5 w-100 text-sm"
    >
      <label className={labelStyles}>
        <div>Type</div>
        <Dropdown
          value={report.type}
          setValue={(type) =>
            setReport({ ...report, type: type as ReportOptionType })
          }
          values={reportOptions}
        />
      </label>
      <label className={labelStyles}>
        <div>Role</div>
        <Dropdown
          value={report.role || ""}
          setValue={(role) =>
            setReport({
              ...report,
              role: role === "Any" ? undefined : (role as "Admin" | "Teacher"),
            })
          }
          values={["Any", "Admin", "Teacher"]}
        />
      </label>
      <label className={labelStyles}>
        <div>
          Subject <span className="text-red-500">*</span>
        </div>
        <Input
          placeholder="What are you reporting?"
          value={report.title}
          setValue={(title) => setReport({ ...report, title })}
        />
      </label>
      <label className={labelStyles}>
        <div>
          Description <span className="text-red-500">*</span>
        </div>
        <Textarea
          placeholder="Put specific details about what you're reporting"
          value={report.description}
          setValue={(description) => setReport({ ...report, description })}
        />
      </label>
      <Checkbox
        text="Anonymous"
        checked={report.anonymous === undefined ? true : report.anonymous}
        setChecked={(anonymous) => setReport({ ...report, anonymous })}
      />
      {error && (
        <div className="text-red-500 text-sm flex gap-x-3 items-center">
          <FaExclamationTriangle size={15} /> {error}
        </div>
      )}
      <Btn text={loading ? "Submitting..." : "Submit"} primary />
    </form>
  );
}

export default Report;
