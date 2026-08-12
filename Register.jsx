import { db } from "./mockDb";

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { UserPlus, Mail, Lock, Loader2, User, Hash, Upload, ShieldCheck, ShieldAlert, AlertCircle, FileSearch } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./select";
import { FACULTY } from "./cpe";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";
import AuthLayout from "./AuthLayout";
import GoogleIcon from "./GoogleIcon";
import { toast } from "./use-toast";


export default function Register() {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [role, setRole] = useState("Offer My Skills");
  const [faculty, setFaculty] = useState(FACULTY[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!certificateFile) {
      setError("Please upload your Certificate of Enrollment");
      return;
    }
    setLoading(true);
    try {
      await db.auth.register({ email, password, full_name: fullName });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await db.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        db.auth.setToken(result.access_token);
      }
      await db.auth.updateMe({
        student_id: studentId,
        preferred_role: role,
        faculty_reference: faculty,
        verification_status: "pending",
      });
      setShowOtp(false);
      await verifyCertificate(certificateFile);
    } catch (err) {
      setError(err.message || "Invalid verification code");
      setShowOtp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await db.auth.resendOtp(email);
      toast({
        title: "Code sent",
        description: "Check your email for the new code.",
      });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    db.auth.loginWithProvider("google", undefined);
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertificateFile(file);
    setCertificatePreview(URL.createObjectURL(file));
    setError("");
  };

  const verifyCertificate = async (file) => {
    setVerifying(true);
    setVerificationResult(null);
    setError("");
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      await db.auth.updateMe({
        enrollment_certificate_url: file_url,
        verification_status: "pending",
      });
      const res = await db.functions.invoke("VerifyEnrollmentCertificate", {
        certificate_url: file_url,
      });
      setVerificationResult(res.data);
    } catch (err) {
      setVerificationResult({
        status: "error",
        reason: err.message || "We couldn't verify your certificate right now. You can continue — we'll review manually.",
      });
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <AuthLayout
        icon={FileSearch}
        title="Verifying your enrollment"
        subtitle="Checking your Certificate of Enrollment…"
      >
        <div className="flex flex-col items-center py-6">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-5" aria-hidden="true" />
          <p className="text-sm text-muted-foreground text-center">
            Our system is reviewing your certificate of enrollment. This usually takes a few seconds.
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (verificationResult) {
    const ok = verificationResult.status === "verified";
    const errored = verificationResult.status === "error";
    const Icon = ok ? ShieldCheck : errored ? AlertCircle : ShieldAlert;
    return (
      <AuthLayout
        icon={Icon}
        title={ok ? "You're verified!" : errored ? "Couldn't verify" : "Verification denied"}
        subtitle={
          ok
            ? "Your enrollment has been confirmed."
            : errored
            ? "You can continue while we review manually."
            : "We couldn't confirm your enrollment."
        }
      >
        <div className="p-4 rounded-xl bg-muted text-sm text-muted-foreground">
          {verificationResult.reason}
        </div>
        {!ok && !errored && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="recert">Try a different certificate</Label>
            <Input
              id="recert"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) verifyCertificate(f);
              }}
              className="h-12"
            />
          </div>
        )}
        <Button
          className="w-full h-12 font-medium mt-6"
          onClick={() => { window.location.href = undefined; }}
        >
          Continue to Work 4 a bit
        </Button>
      </AuthLayout>
    );
  }

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Verify your email"
        subtitle={`We sent a code to ${email}`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-medium"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">
            Resend
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Join Work 4 a bit"
      subtitle="Exclusive to Computer Engineering students"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to={"/login" + (undefined !== "/" ? "?returnTo=" + encodeURIComponent(undefined) : "")}
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="fullName"
              autoComplete="name"
              autoFocus
              placeholder="Juan Dela Cruz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID</Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="studentId"
              placeholder="2023-00123"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Preferred Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Offer My Skills">Offer My Skills</SelectItem>
              <SelectItem value="Need Technical Assistance">Need Technical Assistance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Faculty Reference</Label>
          <Select value={faculty} onValueChange={setFaculty}>
            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FACULTY.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Optional faculty reference for additional verification.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="certificate">Certificate of Enrollment</Label>
          <label
            htmlFor="certificate"
            className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-border bg-muted/40 cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-colors text-center px-4"
          >
            {certificatePreview ? (
              <img src={certificatePreview} alt="Certificate preview" className="max-h-24 rounded-lg object-contain" />
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Click to upload an image of your certificate</span>
              </>
            )}
          </label>
          <Input
            id="certificate"
            type="file"
            accept="image/*"
            onChange={handleCertificateChange}
            className="hidden"
            required
          />
          <p className="text-xs text-muted-foreground">
            We'll automatically verify your enrollment from this document.
          </p>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}