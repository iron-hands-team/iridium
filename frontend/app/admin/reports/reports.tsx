"use client";

import type { ReportType } from "@/types/report";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FaFilter, FaTrash, FaUserSecret, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { reportOptions } from "@/lib/schemas";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import WarningModal from "@/components/modals/warning";

const types = ["All", ...reportOptions];

function Reports({ reports }: { reports: ReportType[] }) {
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>(types[0]);
  const [dismissing, setDismissing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolvedReports, setResolvedReports] = useState<Record<number, boolean>>({});
  const router = useRouter();

  const displayed = reports.filter((r) => {
    const matchesSearch = [r.title, r.description, r.type]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesType = type === types[0] ? true : r.type === type;
    return matchesSearch && matchesType;
  });
  async function dismissReport(id: number) {
    setError(null);
    const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDismissing(null);
      toast.success("Report dismissed successfully!");
      router.refresh();
    } else {
      setError("Something went wrong, please try again");
    }
  }

  async function resolveReport(id: number, currentlyResolved: boolean) {
    const res = await fetch(`/api/reports/${id}`, { method: "POST" });
    if (res.ok) {
      setResolvedReports((prev)=>({
        ...prev,
        [id]: !prev[id]
      }));
      if (currentlyResolved===true) {
        toast.success("Report set unresolved.");
      } else {
        toast.success("Report resolved");
      }
      router.refresh();
    } else {
      setError("Something went wrong, please try again");
    }
  }
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-x-10 items-center">
        <Input
          placeholder={`Search reports (${reports.length})`}
          value={search}
          setValue={(s) => setSearch(s)}
          styles="w-100!"
          clear
        />
        <div
          className="flex gap-x-3 items-center"
          title="Filter reports by type"
        >
          <FaFilter size={18} />
          <Dropdown
            value={type}
            setValue={(t) => setType(t)}
            values={types}
            label="Report type"
          />
        </div>
      </div>
      {displayed.length === 0 ? (
        <div className="text-center text-sm text-zinc-700 dark:text-zinc-300 py-10">
          No report to show.
        </div>
      ) : (
        <div className="flex flex-col gap-y-3">
          {displayed.map((r) => (
            <div
              key={r.id}
              className="border border-zinc-800 rounded-lg p-4 flex flex-col gap-y-2"
            >
              <div className="flex justify-between items-start gap-x-3">
                <div className="flex flex-col gap-y-1">
                  <div className="flex items-center gap-x-2 text-xs text-zinc-500">
                    <span className="border border-zinc-800 rounded px-2 py-0.5">
                      {r.type}
                    </span>
                    {r.role && (
                      <span className="border border-zinc-800 rounded px-2 py-0.5">
                        For: {r.role}
                      </span>
                    )}
                    {r.resolved &&(
                      <span className="border border-green-700 text-green-600 rounded px-2 py-0.5">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold">{r.title}</p>
                </div>
                <div className="flex items-center gap-x-3 shrink-0">
                  <FaCheckCircle
                    className={
                      r.resolved
                        ? "text-green-500 cursor-pointer"
                        : "text-zinc-500 cursor-pointer hover:text-green-500"
                    }
                    title={r.resolved ? "Mark as unresolved": "Mark as resolved"}
                    onClick={()=>resolveReport(r.id, r.resolved)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer shrink-0"
                    title="Dismiss this report"
                    onClick={() => setDismissing(r.id)}
                  />
                </div>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {r.description}
              </p>
              <p className="text-xs text-zinc-500 flex items-center gap-x-1">
                {r.user ? (
                  <>
                    Reported by {r.user.firstName} {r.user.lastName} (@
                    {r.user.username})
                  </>
                ) : (
                  <>
                    <FaUserSecret size={12} /> Reported anonymously
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {dismissing !== null && (
          <WarningModal
            title="Dismiss report confirmation"
            description="Are you sure you want to dismiss this report? This action is permanent and irreversible."
            confirm={() => dismissReport(dismissing)}
            closeModal={() => setDismissing(null)}
            error={error || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Reports;
