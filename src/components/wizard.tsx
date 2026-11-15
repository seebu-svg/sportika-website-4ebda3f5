"use client";

// Shared building blocks for the two long public applications (join as player,
// list your tournament). Panels stay in the DOM the whole time: the wizard only
// hides them once it has hydrated, so the form still submits in full without JS
// and the server always receives every field to validate against.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useActionState } from "react";
import { HONEYPOT, type ActionResult } from "@/lib/actions";

export type Rule = "text" | "email" | "mobile" | "cnic" | "date" | "num";

const PATTERNS: Record<Exclude<Rule, "text">, [RegExp, string]> = {
  email: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
  mobile: [/^(\+92|0)3\d{2}[- ]?\d{7}$/, "Enter a valid mobile number, like 03XX XXXXXXX."],
  cnic: [/^\d{5}-\d{7}-\d$/, "Use the format 12345-1234567-1."],
  date: [/^\d{4}-\d{2}-\d{2}$/, "Pick a date."],
  num: [/^\d+(\.\d+)?$/, "Use numbers only."],
};

const Errors = createContext<Record<string, string>>({});

export function Field({
  name,
  label,
  rule = "text",
  required,
  hint,
  isPrivate,
  placeholder,
  options,
  max,
}: {
  name: string;
  label: string;
  rule?: Rule;
  required?: boolean;
  hint?: string;
  isPrivate?: boolean;
  placeholder?: string;
  options?: string[];
  max?: number;
}) {
  const error = useContext(Errors)[name];
  const shared = {
    id: `f-${name}`,
    name,
    placeholder,
    maxLength: max,
    "data-rule": rule,
    ...(required ? { "data-req": "1" } : {}),
    ...(error ? { "aria-invalid": true as const } : {}),
  };

  return (
    <label htmlFor={`f-${name}`}>
      <span>{label}{required ? " *" : ""}</span>
      {options ? (
        <select {...shared}>
          <option value="">Select</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : rule === "date" ? (
        <input type="date" {...shared} />
      ) : rule === "num" ? (
        <input type="number" min="0" step="any" inputMode="decimal" {...shared} />
      ) : rule === "email" ? (
        <input type="email" {...shared} />
      ) : rule === "mobile" ? (
        <input type="tel" inputMode="tel" {...shared} />
      ) : (
        <input type="text" autoComplete="off" {...shared} />
      )}
      {isPrivate ? (
        <small className="flock">🔒 Used for verification only — never shown publicly.</small>
      ) : hint ? (
        <small>{hint}</small>
      ) : null}
      {error && <span className="err" role="alert">{error}</span>}
    </label>
  );
}

export function Area({
  name,
  label,
  required,
  placeholder,
  rows = 5,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  const error = useContext(Errors)[name];
  return (
    <label htmlFor={`f-${name}`}>
      <span>{label}{required ? " *" : ""}</span>
      <textarea
        id={`f-${name}`}
        name={name}
        rows={rows}
        placeholder={placeholder}
        data-rule="text"
        {...(required ? { "data-req": "1" } : {})}
        {...(error ? { "aria-invalid": true as const } : {})}
      />
      {error && <span className="err" role="alert">{error}</span>}
    </label>
  );
}

export interface WizardStep {
  title: string;
  sub?: string;
}

export function Wizard({
  action,
  steps,
  panels,
  submitLabel,
  successTitle,
  successLink,
  onValueChange,
}: {
  action: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  steps: WizardStep[];
  panels: ReactNode[];
  submitLabel: string;
  successTitle: string;
  successLink: { href: string; label: string };
  // Lets a form react to a few key inputs (age check, sport-specific fields,
  // the review summary) without every field becoming controlled state.
  onValueChange?: (name: string, value: string) => void;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const panelEls = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => setMounted(true), []);

  const checkOne = useCallback((el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    if (el.closest("[hidden]")) return null; // a collapsed conditional block is skipped
    const value = el.value.trim();
    if (!value) return el.dataset.req === "1" ? "This field is required." : null;
    const rule = (el.dataset.rule ?? "text") as Rule;
    if (rule === "text") return null;
    const [pattern, msg] = PATTERNS[rule];
    return pattern.test(value) ? null : msg;
  }, []);

  const validateAt = useCallback((index: number) => {
    const panel = panelEls.current[index];
    if (!panel) return {};
    const found: Record<string, string> = {};
    for (const el of Array.from(panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[data-rule]"))) {
      const msg = checkOne(el);
      if (msg && !found[el.name]) {
        found[el.name] = msg;
        el.focus();
      }
    }
    return found;
  }, [checkOne]);

  function goTo(next: number) {
    if (next > step) {
      const found = validateAt(step);
      if (Object.keys(found).length) { setErrors(found); return; }
    }
    setErrors({});
    setStep(Math.max(0, Math.min(next, steps.length - 1)));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    for (let i = 0; i < steps.length; i++) {
      const found = validateAt(i);
      if (Object.keys(found).length) {
        e.preventDefault();
        setStep(i);
        setErrors(found);
        return;
      }
    }
  }

  function onInput(e: React.FormEvent<HTMLFormElement>) {
    const el = e.target as HTMLInputElement;
    if (el.name && onValueChange) onValueChange(el.name, el.value);
  }

  if (state?.ok) {
    return (
      <div className="fdone" role="status">
        <h3>✓ {successTitle}</h3>
        <p>{state.message}</p>
        <a href={successLink.href}>{successLink.label} →</a>
      </div>
    );
  }

  return (
    <form className="form fw" action={formAction} noValidate onInput={onInput} onSubmit={onSubmit} {...(mounted ? { "data-wizard": "on" } : {})}>
      <div style={{ position: "absolute", left: -9999 }} aria-hidden="true">
        <label>Company website<input name={HONEYPOT} tabIndex={-1} autoComplete="off" /></label>
      </div>

      <ol className="fsteps">
        {steps.map((s, i) => (
          <li key={s.title} {...(i === step ? { "data-on": "" } : {})} {...(i < step ? { "data-done": "" } : {})}>
            <button type="button" onClick={() => goTo(i)}>
              <b>{i < step ? "✓" : i + 1}</b>
              <span>{s.title}</span>
            </button>
          </li>
        ))}
      </ol>

      {steps[step]?.sub && <p className="fsub">{steps[step].sub}</p>}

      <Errors.Provider value={errors}>
        {panels.map((p, i) => (
          <div
            key={steps[i].title}
            ref={(el) => { panelEls.current[i] = el; }}
            className="fpanel"
            {...(i === step ? { "data-on": "" } : {})}
            hidden={mounted && i !== step}
          >
            {p}
          </div>
        ))}
      </Errors.Provider>

      <div className="fnav">
        {step > 0 && <button type="button" className="wback" onClick={() => goTo(step - 1)}>← Back</button>}
        {step < steps.length - 1
          ? <button type="button" className="submit" onClick={() => goTo(step + 1)}>Continue →</button>
          : <button type="submit" className="submit" disabled={pending}>{pending ? "Sending…" : submitLabel}</button>}
      </div>

      {state && !state.ok && state.message && <p className="err" role="alert">{state.message}</p>}
    </form>
  );
}
