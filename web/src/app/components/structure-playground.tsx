"use client";

import { useMemo, useState } from "react";
import {
  OperationDefinition,
  StructureDefinition,
  StructureId,
  structures,
  simulateStructure,
} from "@/lib/structures";

const parseInitialValues = (source: string): number[] => {
  if (!source.trim()) {
    return [];
  }

  return source
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => Number.parseFloat(token))
    .filter((value) => Number.isFinite(value));
};

const formatInitialValues = (values: number[]) => values.join(", ");

const buildDefaultInput = (initial: number[]) => formatInitialValues(initial);

const fieldDefault = (fieldId: string, operation: OperationDefinition) => {
  switch (fieldId) {
    case "index":
      return 0;
    case "value":
      return operation.id.includes("insert") ||
        operation.id.includes("push") ||
        operation.id.includes("enqueue")
        ? 13
        : 0;
    default:
      return 0;
  }
};

const clampIndex = (index: number, values: number[]) => {
  if (values.length === 0) return 0;
  return Math.max(0, Math.min(index, values.length));
};

const buildFieldDefaults = (operation: OperationDefinition) => {
  const defaults: Record<string, string> = {};
  for (const field of operation.fields) {
    defaults[field.id] = String(fieldDefault(field.id, operation));
  }
  return defaults;
};

const errorForOperation = (
  operation: OperationDefinition,
  values: number[],
  rawInputs: Record<string, string>,
) => {
  for (const field of operation.fields) {
    const typedValue = Number.parseFloat(rawInputs[field.id] ?? "");
    if (!Number.isFinite(typedValue)) {
      return `Field "${field.label}" expects a numeric value.`;
    }

    if (field.id === "index") {
      const normalized = clampIndex(typedValue, values);
      if (normalized !== typedValue) {
        return `Index must be between 0 and ${Math.max(values.length, 0)}.`;
      }
    }
  }

  if (values.length > 24) {
    return "Limit the structure to 24 elements to keep the visualization readable.";
  }

  return null;
};

const Card = ({
  children,
  highlight = false,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-2xl border bg-white/80 p-5 shadow-sm ring-1 ring-inset transition ${
      highlight
        ? "border-cyan-500/60 ring-cyan-500/20"
        : "border-zinc-200 ring-black/5"
    }`}
  >
    {children}
  </div>
);

const StepVisual = ({ visual }: { visual: string }) => (
  <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100">
    {visual}
  </pre>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
    {children}
  </h2>
);

export const StructurePlayground = () => {
  const [structureId, setStructureId] = useState<StructureId>("array");
  const activeStructure = useMemo(
    () => structures.find((entry) => entry.id === structureId)!,
    [structureId],
  );

  const [operationId, setOperationId] = useState(activeStructure.operations[0].id);
  const activeOperation = useMemo(
    () =>
      activeStructure.operations.find(
        (operation) => operation.id === operationId,
      ) ?? activeStructure.operations[0],
    [activeStructure, operationId],
  );

  const [initialRaw, setInitialRaw] = useState(
    buildDefaultInput(activeStructure.defaultInitialValues),
  );
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    buildFieldDefaults(activeOperation),
  );

  const [error, setError] = useState<string | null>(null);
  const [didRun, setDidRun] = useState(false);
  const [result, setResult] = useState(() =>
    simulateStructure(
      activeStructure.id,
      activeOperation.id,
      activeStructure.defaultInitialValues,
      Object.fromEntries(
        activeOperation.fields.map((field) => [
          field.id,
          fieldDefault(field.id, activeOperation),
        ]),
      ),
    ),
  );

  const runSimulation = () => {
    const parsedValues = parseInitialValues(initialRaw);
    const validationError = errorForOperation(
      activeOperation,
      parsedValues,
      fieldValues,
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    const numericInputs: Record<string, number> = {};
    for (const field of activeOperation.fields) {
      numericInputs[field.id] = Number.parseFloat(fieldValues[field.id]);
    }

    const nextResult = simulateStructure(
      activeStructure.id,
      activeOperation.id,
      parsedValues,
      numericInputs,
    );

    setError(null);
    setResult(nextResult);
    setDidRun(true);
  };

  const reconfigureForStructure = (structure: StructureDefinition) => {
    const defaultOperation = structure.operations[0];
    setOperationId(defaultOperation.id);
    setInitialRaw(buildDefaultInput(structure.defaultInitialValues));
    setFieldValues(buildFieldDefaults(defaultOperation));
    setDidRun(false);
    setError(null);
  };

  const handleStructureChange = (nextId: StructureId) => {
    if (nextId === structureId) return;
    const structure = structures.find((entry) => entry.id === nextId);
    if (!structure) return;
    setStructureId(nextId);
    reconfigureForStructure(structure);
  };

  const handleOperationChange = (nextOperationId: OperationDefinition["id"]) => {
    const nextOperation =
      activeStructure.operations.find(
        (operation) => operation.id === nextOperationId,
      ) ?? activeStructure.operations[0];
    setOperationId(nextOperation.id);
    setFieldValues(buildFieldDefaults(nextOperation));
    setDidRun(false);
    setError(null);
  };

  const handlePreset = (values: number[]) => {
    setInitialRaw(buildDefaultInput(values));
    setDidRun(false);
  };

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 rounded-3xl border border-transparent bg-gradient-to-br from-white via-white/90 to-cyan-50/70 p-8 shadow-xl shadow-cyan-100/30 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-6">
        <SectionTitle>Structure</SectionTitle>
        <div className="grid gap-3">
          {structures.map((structure) => (
            <button
              key={structure.id}
              type="button"
              onClick={() => handleStructureChange(structure.id)}
              className={`rounded-2xl border p-4 text-left transition hover:border-cyan-400/70 hover:bg-white ${
                structure.id === structureId
                  ? "border-cyan-500 bg-white shadow-md"
                  : "border-zinc-200 bg-white/60"
              }`}
            >
              <h3 className="text-sm font-medium text-cyan-900">
                {structure.name}
              </h3>
              <p className="mt-2 text-xs text-zinc-600">{structure.description}</p>
            </button>
          ))}
        </div>
        <SectionTitle>Scenarios</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-cyan-500/40 px-3 py-1 text-xs font-medium text-cyan-700 transition hover:border-cyan-500 hover:bg-cyan-500/10"
            onClick={() => handlePreset(activeStructure.defaultInitialValues)}
          >
            Reset defaults
          </button>
          <button
            type="button"
            className="rounded-full border border-cyan-500/40 px-3 py-1 text-xs font-medium text-cyan-700 transition hover:border-cyan-500 hover:bg-cyan-500/10"
            onClick={() => handlePreset([1, 3, 5, 7, 9])}
          >
            Sorted numbers
          </button>
          <button
            type="button"
            className="rounded-full border border-cyan-500/40 px-3 py-1 text-xs font-medium text-cyan-700 transition hover:border-cyan-500 hover:bg-cyan-500/10"
            onClick={() => handlePreset([9, 4, 6])}
          >
            Small set
          </button>
        </div>
      </aside>

      <div className="space-y-8">
        <Card highlight={!didRun}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionTitle>Configure operation</SectionTitle>
              <p className="mt-2 text-sm text-zinc-600">
                Tune inputs and run the simulator to see each phase of the algorithm.
              </p>
            </div>
            <button
              type="button"
              onClick={runSimulation}
              className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 transition hover:bg-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Run simulation
            </button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
              Initial values
              <input
                value={initialRaw}
                onChange={(event) => setInitialRaw(event.target.value)}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 font-mono text-sm text-zinc-900 shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                placeholder="e.g. 1, 4, 9"
              />
              <span className="text-xs font-normal text-zinc-500">
                Provide comma-separated integers. Tailwind ensures the playground stays
                responsive up to 24 values.
              </span>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
              Operation
              <select
                value={operationId}
                onChange={(event) =>
                  handleOperationChange(
                    event.target.value as OperationDefinition["id"],
                  )
                }
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              >
                {activeStructure.operations.map((operation) => (
                  <option key={operation.id} value={operation.id}>
                    {operation.label} ({operation.complexity})
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal text-zinc-500">
                {activeOperation.summary}
              </span>
            </label>
          </div>

          {activeOperation.fields.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {activeOperation.fields.map((field) => (
                <label
                  key={field.id}
                  className="flex flex-col gap-2 text-sm font-medium text-zinc-800"
                >
                  {field.label}
                  <input
                    value={fieldValues[field.id] ?? ""}
                    onChange={(event) =>
                      setFieldValues((previous) => ({
                        ...previous,
                        [field.id]: event.target.value,
                      }))
                    }
                    type="number"
                    min={field.min}
                    max={field.max}
                    inputMode="numeric"
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    placeholder={field.placeholder}
                  />
                </label>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl border border-rose-400/40 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          )}
        </Card>

        <Card>
          <SectionTitle>Timeline</SectionTitle>
          <p className="mt-2 text-sm text-zinc-600">
            Inspect each transition to understand the mechanics behind the algorithm.
          </p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Complexity
              </dt>
              <dd className="mt-1 text-sm font-semibold text-cyan-700">
                {result.complexity}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Takeaway
              </dt>
              <dd className="mt-1 text-sm text-zinc-700">{result.takeaway}</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-4">
            {result.steps.map((step, index) => (
              <div
                key={step.id}
                className="relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <span className="absolute -left-3 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-sm font-semibold text-white shadow-lg">
                  {index + 1}
                </span>
                <h3 className="pl-6 text-sm font-semibold text-zinc-900">
                  {step.title}
                </h3>
                <p className="mt-2 pl-6 text-sm text-zinc-600">{step.description}</p>
                <StepVisual visual={step.visual} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
