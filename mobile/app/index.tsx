import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5001";

const normalizeCanadianPhone = (rawPhone: string) => {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
};

export default function Index() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code" | "done">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const requestCode = async () => {
    setError(null);
    setDevCode(null);
    const normalized = normalizeCanadianPhone(phone);
    if (!normalized) {
      setError("Enter a valid Canadian phone number (ex: 416-555-1234).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/phone/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.message ?? "Unable to send verification code.");
        return;
      }
      if (data?.devCode) {
        setDevCode(data.devCode);
      }
      setStep("code");
    } catch (err) {
      setError("Network error. Check your backend URL.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setError(null);
    const normalized = normalizeCanadianPhone(phone);
    if (!normalized) {
      setError("Phone number is invalid.");
      return;
    }
    if (code.trim().length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/phone/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.message ?? "Verification failed.");
        return;
      }
      setToken(data?.token ?? null);
      setStep("done");
    } catch (err) {
      setError("Network error. Check your backend URL.");
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setPhone("");
    setCode("");
    setToken(null);
    setDevCode(null);
    setError(null);
    setStep("phone");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Canadian Phone Sign In</Text>
      <Text style={styles.subtitle}>
        Verification codes are sent by the backend (no Firebase).
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {step === "phone" ? (
        <>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="416-555-1234"
            keyboardType="phone-pad"
            style={styles.input}
            autoComplete="tel"
          />
          <Pressable style={styles.button} onPress={requestCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Code</Text>}
          </Pressable>
        </>
      ) : null}

      {step === "code" ? (
        <>
          <Text style={styles.label}>Enter verification code</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="6-digit code"
            keyboardType="number-pad"
            style={styles.input}
          />
          {devCode ? (
            <Text style={styles.devNote}>Dev code: {devCode}</Text>
          ) : null}
          <Pressable style={styles.button} onPress={verifyCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
          </Pressable>
          <Pressable style={styles.link} onPress={resetFlow} disabled={loading}>
            <Text style={styles.linkText}>Change phone number</Text>
          </Pressable>
        </>
      ) : null}

      {step === "done" ? (
        <>
          <Text style={styles.success}>Phone verified!</Text>
          {token ? (
            <Text style={styles.token}>Token: {token.slice(0, 28)}...</Text>
          ) : null}
          <Pressable style={styles.button} onPress={resetFlow}>
            <Text style={styles.buttonText}>Sign in again</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  error: {
    color: "#b91c1c",
    marginBottom: 12,
  },
  success: {
    color: "#15803d",
    fontSize: 16,
    marginBottom: 8,
  },
  devNote: {
    color: "#6b7280",
    marginBottom: 12,
  },
  link: {
    marginTop: 12,
    alignItems: "center",
  },
  linkText: {
    color: "#2563eb",
  },
  token: {
    fontSize: 12,
    color: "#111827",
    marginBottom: 16,
  },
});
