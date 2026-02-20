"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/messages/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockKeyhole } from "lucide-react";
import { updatePasswordWithToken } from "@/server-functions/authentication";

function ResetPasswordForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      return setError(t("ResetPassword", "errors.passwordLength"));
    }

    if (password !== confirm) {
      return setError(t("ResetPassword", "errors.passwordMismatch"));
    }

    setLoading(true);
    const res = await updatePasswordWithToken(token, password);

    if (res.success) {
      router.push("/login?reset=success");
    } else {
      setError(res.message); // backend message (optional: translate via code system)
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-20">
        <AlertDescription>
          {t("ResetPassword", "errors.invalidToken")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-md rounded-[24px] border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pt-8 text-center">
        <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LockKeyhole size={24} />
        </div>

        <CardTitle className="text-2xl font-black">
          {t("ResetPassword", "title")}
        </CardTitle>

        <p className="text-sm text-slate-500 mt-2">
          {t("ResetPassword", "description")}
        </p>
      </CardHeader>

      <CardContent className="pb-8">
        <form onSubmit={handleUpdate} className="grid gap-4">
          {error && (
            <Alert variant="destructive" className="rounded-2xl animate-shake">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              {t("ResetPassword", "newPasswordLabel")}
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl h-12 border-slate-200"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              {t("ResetPassword", "confirmPasswordLabel")}
            </Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-xl h-12 border-slate-200"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            disabled={loading || !password || !confirm}
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white rounded-xl h-12 font-bold transition-all mt-2"
          >
            {loading
              ? t("ResetPassword", "updatingButton")
              : t("ResetPassword", "updateButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <Suspense fallback={<div>{t("ResetPassword", "loading")}</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
