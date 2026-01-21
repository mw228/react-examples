import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

const STORAGE_KEY = "mw.reactExamples.formsDemo.v1";

const RoleSchema = z.enum(["frontend", "fullstack", "other"]);

// What the form *inputs* hold (role can be "" until user selects)
const InputSchema = z.object({
  fullName: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  role: z.string().refine((v) => v !== "", { message: "Please select a role." }),
  company: z.string().min(2, "Please enter a company name."),
  message: z
    .string()
    .min(20, "Message should be at least 20 characters.")
    .max(500, "Message should be 500 characters or less."),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please confirm you agree to be contacted.",
  }),
});

// Final validated payload type (role is strict union)
const Schema = InputSchema.transform((v) => ({
  ...v,
  role: RoleSchema.parse(v.role),
}));

type FormInput = z.infer<typeof InputSchema>;
type FormValues = z.infer<typeof Schema>;

function safeParseDraft(raw: string | null): Partial<FormInput> {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw) as any;
    if (!data || typeof data !== "object") return {};

    return {
      fullName: typeof data.fullName === "string" ? data.fullName : undefined,
      email: typeof data.email === "string" ? data.email : undefined,
      role: typeof data.role === "string" ? data.role : undefined, // allow "" in draft
      company: typeof data.company === "string" ? data.company : undefined,
      message: typeof data.message === "string" ? data.message : undefined,
      consent: typeof data.consent === "boolean" ? data.consent : undefined,
    };
  } catch {
    return {};
  }
}

export default function FormsDemo() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const errorSummaryRef = useRef<HTMLDivElement | null>(null);

  const draft = useMemo(() => safeParseDraft(localStorage.getItem(STORAGE_KEY)), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    watch,
    reset,
    setFocus,
  } = useForm<FormInput>({
    resolver: zodResolver(InputSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: draft.fullName ?? "",
      email: draft.email ?? "",
      role: draft.role ?? "",
      company: draft.company ?? "",
      message: draft.message ?? "",
      consent: draft.consent ?? false,
    },
  });

  // Persist draft on change (debounced-ish via setTimeout)
  const watched = watch();
  useEffect(() => {
    const t = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watched));
    }, 250);
    return () => window.clearTimeout(t);
  }, [watched]);

  async function fakeSubmitToServer(values: FormValues) {
    await new Promise((r) => setTimeout(r, 900));

    if (values.email.toLowerCase().includes("test")) {
      throw new Error("Server validation: Please use a real email address.");
    }

    if (values.message.toLowerCase().includes("error")) {
      throw new Error("Server error: Something went wrong. Please try again.");
    }

    return { ok: true };
  }

  const onSubmit = handleSubmit(async (rawValues) => {
    setServerError(null);
    setSuccess(false);

    // Convert form input -> final validated payload
    const parsed = Schema.safeParse(rawValues);
    if (!parsed.success) {
      // Should be rare since RHF already validates, but keeps the flow safe.
      setServerError("Please fix the form errors and try again.");
      return;
    }

    try {
      await fakeSubmitToServer(parsed.data);
      setSuccess(true);

      localStorage.removeItem(STORAGE_KEY);

      reset({
        fullName: "",
        email: "",
        role: "",
        company: "",
        message: "",
        consent: false,
      });
    } catch (e) {
      setSuccess(false);
      setServerError((e as Error).message);
    }
  });

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors && !isSubmitting && !isSubmitSuccessful) {
      window.setTimeout(() => errorSummaryRef.current?.focus(), 0);
    }
  }, [errors, isSubmitting, isSubmitSuccessful]);

  const errorEntries = Object.entries(errors);

  return (
    <div>
      <h2 className="page-title">Forms Demo</h2>
      <p className="page-subtitle">
        React Hook Form + Zod validation with accessible error UX, async submit states, and draft persistence.
      </p>

      <div className="grid grid--cards">
        <Card title="Example form" description="Includes inline validation, error summary, and server-side error handling.">
          {errorEntries.length > 0 && (
            <div
              ref={errorSummaryRef}
              tabIndex={-1}
              className="form-summary"
              role="alert"
              aria-label="There are errors in the form"
            >
              <div className="form-summary__title">Please fix the following:</div>
              <ul className="form-summary__list">
                {errorEntries.map(([name, err]) => (
                  <li key={name}>
                    <button
                      type="button"
                      className="form-summary__link"
                      onClick={() => setFocus(name as keyof FormInput)}
                    >
                      {err?.message as string}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {serverError && (
            <div className="form-banner" role="alert">
              {serverError}
            </div>
          )}

          {success && (
            <div className="form-banner form-banner--success" role="status" aria-live="polite">
              Sent! Thanks. I’ll get back to you soon.
            </div>
          )}

          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="fullName">
                  Name
                </label>
                <input
                  id="fullName"
                  className={`input ${errors.fullName ? "input--error" : ""}`}
                  placeholder="Matthew Wilson"
                  {...register("fullName")}
                />
                {errors.fullName && <div className="error">{errors.fullName.message}</div>}
              </div>

              <div className="field">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className={`input ${errors.email ? "input--error" : ""}`}
                  placeholder="name@company.com"
                  {...register("email")}
                />
                {errors.email && <div className="error">{errors.email.message}</div>}
              </div>

              <div className="field">
                <label className="label" htmlFor="company">
                  Company
                </label>
                <input
                  id="company"
                  className={`input ${errors.company ? "input--error" : ""}`}
                  placeholder="Company name"
                  {...register("company")}
                />
                {errors.company && <div className="error">{errors.company.message}</div>}
              </div>

              <div className="field">
                <label className="label" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  className={`select ${errors.role ? "input--error" : ""}`}
                  {...register("role")}
                >
                  <option value="">Select a role…</option>
                  <option value="frontend">Frontend</option>
                  <option value="fullstack">Full-stack</option>
                  <option value="other">Other</option>
                </select>
                {errors.role && <div className="error">{errors.role.message as string}</div>}
              </div>

              <div className="field field--full">
                <label className="label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  className={`textarea ${errors.message ? "input--error" : ""}`}
                  rows={5}
                  placeholder="Tell me what you’re building and what you need help with…"
                  {...register("message")}
                />
                <div className="hint">
                  Tip: entering the word <code>error</code> simulates a server failure. Using an email containing{" "}
                  <code>test</code> simulates server-side validation.
                </div>
                {errors.message && <div className="error">{errors.message.message}</div>}
              </div>

              <div className="field field--full">
                <label className="check">
                  <input type="checkbox" {...register("consent")} />
                  <span>I agree to be contacted about opportunities.</span>
                </label>
                {errors.consent && <div className="error">{errors.consent.message}</div>}
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setServerError(null);
                  setSuccess(false);
                  localStorage.removeItem(STORAGE_KEY);
                  reset({
                    fullName: "",
                    email: "",
                    role: "",
                    company: "",
                    message: "",
                    consent: false,
                  });
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>

        <Card title="What this demonstrates" description="Patterns interviewers look for in production forms.">
          <ul className="card-desc" style={{ margin: 0, paddingLeft: "1.1rem" }}>
            <li>Schema validation (Zod) + ergonomic form state (React Hook Form)</li>
            <li>Accessible error summary + focus management</li>
            <li>Inline field errors and safe submit disabling</li>
            <li>Async submit UX: loading, success, and server error states</li>
            <li>Draft persistence across page reload (localStorage)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
